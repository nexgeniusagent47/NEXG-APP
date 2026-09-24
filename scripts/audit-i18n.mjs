import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const file = resolve(root, 'src/data/translations.ts');
const source = readFileSync(file, 'utf8');
const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
let translationsNode;

function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(sourceFile) === 'translations') {
    translationsNode = node.initializer;
  }
  ts.forEachChild(node, visit);
}

visit(sourceFile);
if (!translationsNode || !ts.isObjectLiteralExpression(translationsNode)) {
  throw new Error('Could not find the translations object in src/data/translations.ts.');
}

function propertyName(node) {
  if (ts.isIdentifier(node)) return node.text;
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  return node.getText(sourceFile).replace(/^['"]|['"]$/g, '');
}

function toValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (!ts.isObjectLiteralExpression(node)) return undefined;
  return Object.fromEntries(node.properties
    .filter(ts.isPropertyAssignment)
    .map((property) => [propertyName(property.name), toValue(property.initializer)]));
}

const localeObjects = toValue(translationsNode);
const languages = ['zh', 'sw', 'ar'];
const reference = localeObjects.en.ui;
const expectedKeys = new Set();
const shapeProblems = [];

function collectKeys(value, prefix = []) {
  for (const [key, child] of Object.entries(value ?? {})) {
    const path = [...prefix, key];
    if (typeof child === 'string') expectedKeys.add(path.join('.'));
    else collectKeys(child, path);
  }
}

collectKeys(reference);

function flatten(value, prefix = [], output = {}) {
  for (const [key, child] of Object.entries(value ?? {})) {
    const path = [...prefix, key];
    if (typeof child === 'string') output[path.join('.')] = child;
    else if (child && typeof child === 'object') flatten(child, path, output);
  }
  return output;
}

const english = flatten(reference);
const referenceGroups = Object.keys(reference);
const pendingByLocale = {};
const wrongScripts = [];

for (const language of languages) {
  const localized = flatten(localeObjects[language]?.ui);
  const localizedKeys = new Set(Object.keys(localized));
  const missing = [...expectedKeys].filter((key) => !localizedKeys.has(key));
  const extra = [...localizedKeys].filter((key) => !expectedKeys.has(key));
  if (missing.length || extra.length) shapeProblems.push({ language, missing, extra });

  const pending = Object.entries(english)
    .filter(([key, value]) => localized[key] === value)
    .map(([key]) => key);
  const byGroup = {};
  for (const key of pending) {
    const group = key.split('.')[0];
    byGroup[group] = (byGroup[group] ?? 0) + 1;
  }
  pendingByLocale[language] = { count: pending.length, byGroup };

  for (const [key, text] of Object.entries(localized)) {
    if (text === english[key]) continue;
    const hasHan = /[\u3400-\u9fff]/u.test(text);
    const hasArabic = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/u.test(text);
    const mismatch = (language === 'zh' && hasArabic)
      || (language === 'sw' && (hasHan || hasArabic))
      || (language === 'ar' && hasHan);
    if (mismatch) wrongScripts.push({ language, key, text: text.slice(0, 100) });
  }
}

const totalKeys = expectedKeys.size;
console.log(`UI message keys: ${totalKeys}`);
for (const language of languages) {
  const { count, byGroup } = pendingByLocale[language];
  const translated = totalKeys - count;
  console.log(`${language}: ${translated}/${totalKeys} differ from English; ${count} exact English matches remain`);
  for (const group of referenceGroups) {
    if (byGroup[group]) console.log(`  ${group}: ${byGroup[group]} exact English matches`);
  }
}

if (wrongScripts.length) {
  console.error('Possible wrong-script locale values:');
  for (const issue of wrongScripts) console.error(`  ${issue.language} ${issue.key}: ${issue.text}`);
}
if (shapeProblems.length) {
  console.error(`Locale key parity issues: ${JSON.stringify(shapeProblems)}`);
}

if (wrongScripts.length || shapeProblems.length) process.exitCode = 1;
