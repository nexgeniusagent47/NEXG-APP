// scripts/api-contract-test.mjs
// API contract assertions for NEXG Concierge.
//
// Run against an ALREADY-RUNNING server:
//   node scripts/api-contract-test.mjs [baseUrl]
//
// Exits non-zero on the first failing assertion.
//
// The headline check is D-03: the counts reported by /api/health must agree
// with what the list endpoints actually serve. That contradiction is what made
// the catalogue silently look 81% empty.

const BASE = process.argv[2] ?? 'http://127.0.0.1:3001';

let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(20000) });
  let body = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON body */
  }
  return { status: res.status, body };
}

async function main() {
  console.log(`API contract test against ${BASE}\n`);

  // ---------------------------------------------------------------- health
  console.log('health');
  const health = await get('/api/health');
  check('GET /api/health returns 200', health.status === 200, `got ${health.status}`);
  check('health reports a source', typeof health.body?.source === 'string', JSON.stringify(health.body?.source));
  check(
    'health reports postgres connection state',
    typeof health.body?.postgresConnected === 'boolean'
  );

  const healthMerchants = health.body?.totalMerchants ?? 0;
  const healthItems = health.body?.totalItems ?? 0;
  console.log(`        source=${health.body?.source} merchants=${healthMerchants} items=${healthItems}`);

  // ------------------------------------------------------------- categories
  console.log('\ncategories');
  const cats = await get('/api/categories');
  check('GET /api/categories returns 200', cats.status === 200, `got ${cats.status}`);
  check('returns 21 categories', cats.body?.categories?.length === 21, `got ${cats.body?.categories?.length}`);
  check(
    'health.totalCategories agrees with /api/categories',
    health.body?.totalCategories === cats.body?.categories?.length,
    `health=${health.body?.totalCategories} list=${cats.body?.categories?.length}`
  );
  check(
    'every category exposes subcategories',
    (cats.body?.categories ?? []).every((c) => Array.isArray(c.subcategories) && c.subcategories.length > 0)
  );

  const subTotal = (cats.body?.categories ?? []).reduce((n, c) => n + c.subcategories.length, 0);
  console.log(`        ${cats.body?.categories?.length} categories, ${subTotal} subcategories`);

  // -------------------------------------------------------------- merchants
  console.log('\nmerchants');
  const page = await get('/api/merchants?limit=10');
  check('GET /api/merchants returns 200', page.status === 200, `got ${page.status}`);
  check('respects limit', page.body?.merchants?.length === 10, `got ${page.body?.merchants?.length}`);

  // The D-03 regression guard.
  check(
    'health.totalMerchants EQUALS /api/merchants.total  (D-03 regression guard)',
    healthMerchants === page.body?.total,
    `health=${healthMerchants} list=${page.body?.total}`
  );
  check('merchant total is non-trivial', page.body?.total >= 100, `total=${page.body?.total}`);

  const first = page.body?.merchants?.[0];
  check('merchant has required frontend fields', Boolean(
    first?.id && first?.name && first?.categoryId && first?.heroImage !== undefined
  ));
  check('merchant.deliveryTime is a human string', typeof first?.deliveryTime === 'string', String(first?.deliveryTime));
  check('merchant.rating is numeric', typeof first?.rating === 'number');

  // Pagination must actually move the window.
  const page2 = await get('/api/merchants?limit=10&offset=10');
  const ids1 = (page.body?.merchants ?? []).map((m) => m.id).join(',');
  const ids2 = (page2.body?.merchants ?? []).map((m) => m.id).join(',');
  check('offset returns a different page', ids1 !== ids2 && ids2.length > 0);
  check('page 2 keeps the same total', page2.body?.total === page.body?.total);

  // Page size must be clamped, and garbage must not crash (D-09).
  const huge = await get('/api/merchants?limit=99999');
  check('oversized limit is clamped', huge.body?.merchants?.length <= 200, `got ${huge.body?.merchants?.length}`);
  const junk = await get('/api/merchants?limit=abc&offset=xyz');
  check('non-numeric paging does not crash', junk.status === 200, `got ${junk.status}`);

  // Filtering must narrow results.
  const byCat = await get('/api/merchants?category=restaurants-food&limit=5');
  check('category filter returns results', (byCat.body?.total ?? 0) > 0, `total=${byCat.body?.total}`);
  check(
    'category filter is honoured',
    (byCat.body?.merchants ?? []).every((m) => m.categoryId === 'restaurants-food')
  );
  check(
    'filtered total is <= unfiltered total',
    (byCat.body?.total ?? 0) <= (page.body?.total ?? 0)
  );

  const search = await get('/api/merchants?search=spa&limit=5');
  check('search returns 200', search.status === 200);

  // ------------------------------------------------------------ item hydration
  console.log('\nitem hydration');
  const withItems = await get('/api/merchants?limit=50');
  const hydrated = (withItems.body?.merchants ?? []).filter((m) => (m.items?.length ?? 0) > 0);
  check(
    'list endpoint hydrates items for merchants that have them',
    hydrated.length > 0,
    `${hydrated.length}/${withItems.body?.merchants?.length} merchants had items`
  );

  // ---------------------------------------------------------------- detail
  console.log('\nmerchant detail');
  const detailId = first?.id;
  const detail = await get(`/api/merchants/${detailId}`);
  check('GET /api/merchants/:id returns 200', detail.status === 200, `got ${detail.status}`);
  check('detail id matches request', detail.body?.id === detailId);
  check('detail carries items array', Array.isArray(detail.body?.items));

  const missing = await get('/api/merchants/__definitely-not-a-merchant__');
  check('unknown merchant returns 404', missing.status === 404, `got ${missing.status}`);

  // ------------------------------------------------------------------ areas
  console.log('\nareas');
  const areas = await get('/api/areas');
  check('GET /api/areas returns 200', areas.status === 200, `got ${areas.status}`);
  check('returns neighbourhoods', (areas.body?.areas?.length ?? 0) > 0, `got ${areas.body?.areas?.length}`);

  // ---------------------------------------------------------------- summary
  console.log(`\n${'-'.repeat(64)}`);
  console.log(`passed: ${passed}   failed: ${failures.length}`);
  if (failures.length) {
    console.log('\nfailures:');
    for (const f of failures) console.log(`  * ${f}`);
    process.exit(1);
  }
  console.log('API contract OK');
}

main().catch((err) => {
  console.error('contract test crashed:', err?.message ?? err);
  process.exit(1);
});
