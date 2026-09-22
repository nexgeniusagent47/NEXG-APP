// Hand-edit the strings the mechanical rename made awkward.
//
// A blanket "Concierge -> App" is correct for the brand name but wrong wherever
// "Concierge" was naming a ROLE or a THING rather than the product. "Available App
// Categories" and "Contact App Desk" are the tells: the replacement was grammatical and
// meaningless.
//
// Each fix below states what the string actually means, so the wording follows the
// meaning rather than the substitution.
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'src/data/translations.ts';

const FIXES = [
  // "Concierge" meant "the service", not the brand.
  ["heading: 'Available App Categories'", "heading: 'Available Categories'"],
  ["vipHostIncluded: 'Dedicated App Host'", "vipHostIncluded: 'Dedicated Host'"],
  // A bag belonging to the user, not to an app.
  ["title: 'Your App Bag'", "title: 'Your Bag'"],
  // A fee for the service; "App Hospitality Fee" says nothing.
  ["conciergeService: 'App Hospitality Fee (5%)'", "conciergeService: 'Service Fee (5%)'"],
  ["title: 'Live App Tracking'", "title: 'Live Order Tracking'"],
  // A desk people contact — the agent, not the software.
  ["contactConcierge: 'Contact App Desk'", "contactConcierge: 'Contact Support'"],
  ["conciergeDesk: 'App Desk'", "conciergeDesk: 'Support Desk'"],
  // Feature headline where "Concierge" was the noun being offered.
  ["feat1Title: '24/7 Dedicated App'", "feat1Title: '24/7 Dedicated Support'"],
];

let src = readFileSync(FILE, 'utf8');
let n = 0;
const missed = [];

for (const [from, to] of FIXES) {
  if (!src.includes(from)) {
    missed.push(from);
    continue;
  }
  src = src.split(from).join(to);
  n++;
}

writeFileSync(FILE, src, 'utf8');

console.log(`applied ${n} of ${FIXES.length}`);
if (missed.length) {
  console.log('\nnot found (wording may differ):');
  for (const m of missed) console.log('  ' + m);
}

// Show the result so the wording can be judged rather than trusted.
console.log('\n=== how these now read ===');
for (const [from, to] of FIXES) {
  if (src.includes(to)) console.log('  ' + to.replace(/^\w+: '|'$/g, '').trim());
}
