#!/usr/bin/env node
// Build and exercise the exact production Dockerfile against an isolated,
// seeded PostgreSQL 15 instance. This never targets the live host.

import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECT = 'nexg-concierge-staging';
const COMPOSE_FILE = path.join(ROOT, 'docker-compose.staging.yml');
const ENV_FILE = path.join(ROOT, '.env.staging');
const API_CONTRACT = path.join(ROOT, 'scripts', 'api-contract-test.mjs');
const GENERATED_ENV_MARKER = '# Generated locally by scripts/staging.mjs; never commit this file.';

function createEnvFile() {
  const ignoreCheck = spawnSync('git', ['check-ignore', '--quiet', '.env.staging'], {
    cwd: ROOT,
    stdio: 'ignore',
    windowsHide: true,
  });
  if (ignoreCheck.status !== 0) {
    throw new Error('.env.staging is not ignored by Git; refusing to write staging credentials.');
  }
  if (existsSync(ENV_FILE)) return;

  const authSecret = randomBytes(48).toString('base64url');
  const databasePassword = randomBytes(32).toString('base64url');
  const gitSha = /^[a-f0-9]{40}$/i.test(process.env.GITHUB_SHA ?? '')
    ? process.env.GITHUB_SHA
    : 'local-worktree';
  const builtAt = new Date().toISOString();
  const contents = [
    GENERATED_ENV_MARKER,
    'STAGING_AUTH_SECRET=' + authSecret,
    'STAGING_POSTGRES_PASSWORD=' + databasePassword,
    'STAGING_POSTGRES_PASSWORD_URLENCODED=' + databasePassword,
    'STAGING_GIT_SHA=' + gitSha,
    'STAGING_BUILT_AT=' + builtAt,
    '',
  ].join('\n');

  writeFileSync(ENV_FILE, contents, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
  console.log('Created ignored .env.staging with random disposable credentials.');
}

function compose(args, capture = false) {
  const commandArgs = [
    'compose',
    '--project-name',
    PROJECT,
    '--file',
    COMPOSE_FILE,
    '--env-file',
    ENV_FILE,
    ...args,
  ];
  const result = spawnSync('docker', commandArgs, {
    cwd: ROOT,
    encoding: capture ? 'utf8' : undefined,
    stdio: capture ? 'pipe' : 'inherit',
    windowsHide: true,
    maxBuffer: 16 * 1024 * 1024,
  });

  if (result.error) {
    if (result.error.code === 'ENOENT') {
      throw new Error('Docker CLI was not found. Install Docker Desktop with the Compose v2 plugin.');
    }
    throw result.error;
  }
  if (result.status !== 0) {
    const details = capture ? [result.stdout, result.stderr].filter(Boolean).join('\n') : '';
    throw new Error(
      'docker compose ' + args.join(' ') + ' failed with exit code ' + result.status +
      (details ? '\n' + details : '')
    );
  }
  return capture ? result.stdout.trim() : '';
}

function getBaseUrl() {
  const portOutput = compose(['port', 'app', '3001'], true);
  const match = portOutput.match(/127\.0\.0\.1:(\d+)/);
  if (!match) {
    throw new Error('Could not read the loopback app port from docker compose port output: ' + portOutput);
  }
  return 'http://127.0.0.1:' + match[1];
}

async function fetchJson(baseUrl, route) {
  const response = await fetch(baseUrl + route, { signal: AbortSignal.timeout(5000) });
  let body = null;
  try {
    body = await response.json();
  } catch {
    // A non-JSON response still leaves the HTTP status available to the check.
  }
  return { status: response.status, body };
}

async function fetchHtml(baseUrl, route) {
  const response = await fetch(baseUrl + route, { signal: AbortSignal.timeout(5000) });
  return {
    status: response.status,
    contentType: response.headers.get('content-type') ?? '',
    body: await response.text(),
  };
}

function assertSeededHealth(health) {
  const expected = {
    totalCategories: 21,
    totalMerchants: 640,
    totalItems: 6000,
  };
  if (
    health.status !== 200 ||
    health.body?.source !== 'postgres' ||
    health.body?.postgresConnected !== true
  ) {
    throw new Error(
      'Staging health is not database-backed: HTTP ' + health.status +
      ', source=' + health.body?.source + '.'
    );
  }
  for (const [field, count] of Object.entries(expected)) {
    if (health.body?.[field] !== count) {
      throw new Error(
        'Staging health expected ' + field + '=' + count +
        '; received ' + health.body?.[field] + '.'
      );
    }
  }
}

async function waitForHealthy(baseUrl, timeoutMs = 240000) {
  const deadline = Date.now() + timeoutMs;
  let last = 'No HTTP response yet.';
  while (Date.now() < deadline) {
    try {
      const health = await fetchJson(baseUrl, '/api/health');
      last = 'HTTP ' + health.status + ', source=' + (health.body?.source ?? 'unknown');
      if (
        health.status === 200 &&
        health.body?.source === 'postgres' &&
        health.body?.postgresConnected === true
      ) {
        assertSeededHealth(health);
        return health;
      }
    } catch (error) {
      last = error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error('Staging did not become database-backed within ' + timeoutMs + 'ms. Last result: ' + last);
}

async function waitForStatus(baseUrl, route, expectedStatus, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  let last = 'No HTTP response yet.';
  while (Date.now() < deadline) {
    try {
      const response = await fetchJson(baseUrl, route);
      last = 'HTTP ' + response.status;
      if (response.status === expectedStatus) return;
    } catch (error) {
      last = error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(
    'Expected ' + route + ' to return HTTP ' + expectedStatus + '; last result: ' + last
  );
}

function runApiContract(baseUrl) {
  const result = spawnSync(process.execPath, [API_CONTRACT, baseUrl], {
    cwd: ROOT,
    stdio: 'inherit',
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error('The API contract check failed with exit code ' + result.status + '.');
  }
}

function removeGeneratedEnvFile() {
  if (!existsSync(ENV_FILE)) return;
  const firstLine = readFileSync(ENV_FILE, 'utf8').split(/\r?\n/, 1)[0];
  if (firstLine === GENERATED_ENV_MARKER) {
    unlinkSync(ENV_FILE);
    console.log('Removed the generated .env.staging credentials file.');
  } else {
    console.log('Kept the pre-existing .env.staging file because this script did not create it.');
  }
}

async function smokeCheck(baseUrl) {
  console.log('Checking production image at ' + baseUrl);
  await waitForHealthy(baseUrl);
  const page = await fetchHtml(baseUrl, '/');
  if (
    page.status !== 200 ||
    !page.contentType.includes('text/html') ||
    !page.body.includes('id="root"')
  ) {
    throw new Error('GET / did not serve the production SPA: HTTP ' + page.status + '.');
  }
  const version = await fetchJson(baseUrl, '/api/version');
  if (version.status !== 200 || typeof version.body?.gitSha !== 'string') {
    throw new Error('GET /api/version failed: HTTP ' + version.status + '.');
  }
  runApiContract(baseUrl);
}

async function simulateOutage(baseUrl) {
  console.log('Stopping only the isolated staging database to verify fail-closed behavior.');
  try {
    compose(['stop', 'postgres']);
    await waitForStatus(baseUrl, '/api/health', 503);
    await waitForStatus(baseUrl, '/api/categories', 503);
    await waitForStatus(baseUrl, '/api/merchants?limit=1', 503);
  } finally {
    compose(['start', 'postgres']);
  }

  const restored = await waitForHealthy(baseUrl, 120000);
  assertSeededHealth(restored);
  console.log('Database recovery restored the seeded health response.');
}

async function main() {
  const action = (process.argv[2] ?? 'simulate').toLowerCase();
  const validActions = new Set(['up', 'smoke', 'simulate', 'down', 'reset']);
  if (!validActions.has(action)) {
    throw new Error('Usage: node scripts/staging.mjs [up|smoke|simulate|down|reset]');
  }
  createEnvFile();

  if (action === 'up') {
    compose(['up', '--detach', '--build']);
    const baseUrl = getBaseUrl();
    await waitForHealthy(baseUrl);
    console.log('Staging is ready at ' + baseUrl + '.');
    return;
  }
  if (action === 'smoke') {
    await smokeCheck(getBaseUrl());
    return;
  }
  if (action === 'simulate') {
    compose(['up', '--detach', '--build']);
    const baseUrl = getBaseUrl();
    await smokeCheck(baseUrl);
    await simulateOutage(baseUrl);
    console.log('Production-container simulation passed. The isolated stack is still running for inspection.');
    return;
  }
  if (action === 'down') {
    compose(['down', '--remove-orphans']);
    console.log('Stopped the staging stack; its isolated database volume is preserved.');
    return;
  }
  if (action === 'reset') {
    compose(['down', '--volumes', '--remove-orphans']);
    removeGeneratedEnvFile();
    console.log('Removed only the staging stack and its project-scoped volume.');
    return;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
