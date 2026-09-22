/*
 * device-room/room.js
 *
 * The room's behaviour: build a frame per device, keep every frame on the same
 * screen, and hand the measurement to the server.
 *
 * Three things are worth knowing before editing this file.
 *
 * 1. THE FRAMES ARE CROSS-ORIGIN. The room listens on its own port and the app on
 *    another, and a port is part of an origin — so `iframe.contentDocument` is `null`
 *    from here. That is not a bug to work around; it is why the audit lives on the
 *    server (`/api/audit`, driven by scripts/device-room/measure.mjs). An in-page
 *    audit would report "0 broken" for every frame while measuring nothing, which is
 *    the exact failure mode this project has already been burned by. The room detects
 *    the case and routes around it rather than assuming either way.
 *
 * 2. THE ONLY MEASUREMENT IS THE SERVER'S. There is deliberately no in-page copy of
 *    the measurement logic: a second implementation would drift from
 *    `scripts/device-room/measure.mjs`, and the drift would be invisible because both
 *    would still print a number. Read the module for the measurement rules — including
 *    the ban on canvas colour probes, which return opaque black for `oklch()`.
 *
 * 3. A frame that has not finished loading is a *pending* result, never a pass.
 */

const $ = (id) => document.getElementById(id);

const grid = $('grid');
const status = $('status');
const panel = $('panel');
const panelTitle = $('panel-title');
const panelBody = $('panel-body');

const state = {
  route: 'home',
  group: 'phone',
  theme: 'dark',
  zoom: 'auto',
  devices: [],
  routes: [],
  appOrigin: '',
  sameOrigin: false, // resolved once the frames are up
  frames: new Map(), // device id -> { device, wrap, bezel, box, iframe, metrics }
};

// ---------------------------------------------------------------- data

// One request, three lists. The presets live in `scripts/device-presets.mjs` and are
// imported by the server (which also imports them for the audit), so the room can
// never review a different set of devices than the audit measured.
const presets = await fetch('/api/presets').then((r) => {
  if (!r.ok) throw new Error(`/api/presets returned ${r.status}`);
  return r.json();
});

state.devices = presets.devices;
state.routes = presets.routes;
state.appOrigin = presets.appOrigin;
state.criticalWidths = presets.criticalWidths;

// ---------------------------------------------------------------- url state

// The room's own state is kept in the hash so a specific comparison can be linked,
// reloaded, and sent to someone else.
function readHash() {
  const p = new URLSearchParams(location.hash.replace(/^#/, ''));
  if (p.get('route') && state.routes.some((r) => r.id === p.get('route'))) state.route = p.get('route');
  if (p.get('group')) state.group = p.get('group');
  if (p.get('theme')) state.theme = p.get('theme');
  if (p.get('zoom')) state.zoom = p.get('zoom');
}

function writeHash() {
  const p = new URLSearchParams({
    route: state.route,
    group: state.group,
    theme: state.theme,
    zoom: state.zoom,
  });
  history.replaceState(null, '', `#${p}`);
}

const routeFor = (id) => state.routes.find((r) => r.id === id) ?? state.routes[0];

function visibleDevices() {
  switch (state.group) {
    case 'phone':
      return state.devices.filter((d) => d.category === 'phone');
    case 'narrow':
      // The presets carry the flag, so this cannot drift from CRITICAL_WIDTHS.
      return state.devices.filter((d) => d.critical);
    case 'tablet':
      return state.devices.filter((d) => d.category === 'tablet');
    case 'desktop':
      return state.devices.filter((d) => d.category === 'desktop');
    default:
      return state.devices;
  }
}

// ---------------------------------------------------------------- theme

/**
 * The app reads its theme from `localStorage.nexg_theme` on mount and writes it back
 * on every toggle. There is no `dark:` strategy in this app — components branch on
 * `isLight` — so the storage key is the only lever, and a CSS override instead would
 * desynchronise the two.
 *
 * Because the frames are cross-origin, a `localStorage` write here does NOT reach
 * them: storage is partitioned by origin. The theme is therefore handed to the audit
 * endpoint (which seeds it per context) and to `/api/still`; the frames themselves are
 * reloaded, and pick the theme up through the URL the room builds for them.
 */
function applyTheme({ reload = true } = {}) {
  try {
    localStorage.setItem('nexg_theme', state.theme);
  } catch {
    /* storage unavailable; the audit and stills seed their own */
  }
  if (reload) reloadAll();
}

// ---------------------------------------------------------------- frames

function frameUrl() {
  // A cache-busting parameter is deliberately absent: Vite's dev server is the
  // source of truth for freshness, and a changing URL would defeat its module cache.
  //
  // `?theme=` is the one channel that crosses the origin boundary — see
  // src/context/ThemeContext.tsx. Frame width comes from the iframe's own attributes,
  // not from the URL, so nothing else needs to be encoded here.
  const route = routeFor(state.route);
  const sep = route.path.includes('?') ? '&' : '?';
  return `${state.appOrigin}${route.path}${sep}theme=${state.theme}`;
}

function scaleFor(device) {
  if (state.zoom !== 'auto') return Number(state.zoom);
  const col = grid.firstElementChild?.getBoundingClientRect().width ?? 320;
  // 34px is the bezel's own horizontal chrome (1px borders + padding), so a frame
  // never sits flush against the column edge.
  return Math.min(1, Math.max(0.24, (col - 34) / device.w));
}

function buildFrame(device) {
  const wrap = document.createElement('section');
  wrap.className = 'frame';
  wrap.dataset.device = device.id;

  const head = document.createElement('header');
  head.className = 'frame__head';

  const tier = document.createElement('span');
  tier.className = 'tier';
  tier.textContent = device.tier;
  if (device.critical) {
    tier.dataset.critical = 'true';
    tier.title = 'One of the widths where every measured defect has appeared';
  }

  const name = document.createElement('span');
  name.className = 'frame__name';
  name.textContent = device.name;

  const dims = document.createElement('span');
  dims.className = 'frame__dims';
  dims.textContent = `${device.w}x${device.h}`;

  const open = document.createElement('button');
  open.className = 'frame__open';
  open.type = 'button';
  open.textContent = 'open';
  open.title = 'Open this width in its own tab';
  open.addEventListener('click', () => window.open(frameUrl(), '_blank', 'noopener'));

  head.append(tier, name, dims, open);

  const box = document.createElement('div');
  box.className = 'frame__box';

  const bezel = document.createElement('div');
  bezel.className = 'frame__scaler';

  const iframe = document.createElement('iframe');
  iframe.width = String(device.w);
  iframe.height = String(device.h);
  iframe.loading = 'lazy';
  iframe.title = `${device.name} at ${device.w} by ${device.h}`;
  // `allow` is left empty on purpose: the app asks for geolocation on mount, and a
  // permission prompt per frame would be nineteen prompts.
  iframe.setAttribute('referrerpolicy', 'no-referrer');

  const skeleton = document.createElement('div');
  skeleton.className = 'frame__skeleton';
  skeleton.textContent = 'loading';

  bezel.append(iframe);
  box.append(bezel, skeleton);

  const metrics = document.createElement('div');
  metrics.className = 'frame__metrics';
  metrics.textContent = 'not audited';

  wrap.append(head, box, metrics);
  grid.append(wrap);

  const entry = { device, wrap, box, bezel, iframe, skeleton, metrics };
  state.frames.set(device.id, entry);

  iframe.addEventListener('load', () => {
    skeleton.remove();
    layoutFrame(entry);
    metrics.textContent = routeFor(state.route).label;
    // Resolve origin-sharing once, from the first frame that loads: with a shared
    // origin a route change can be delivered without a reload, and without one it
    // cannot be attempted at all. `contentDocument` is the only reliable probe —
    // `contentWindow` is never null even when the document is unreachable.
    try {
      if (iframe.contentDocument) state.sameOrigin = true;
    } catch {
      state.sameOrigin = false;
    }
  });
  iframe.src = frameUrl();

  layoutFrame(entry);
  return entry;
}

/** Size the bezel from the current zoom. Called on build, zoom change and resize. */
function layoutFrame(entry) {
  const s = scaleFor(entry.device);
  entry.bezel.style.transform = `scale(${s})`;
  entry.bezel.style.width = `${entry.device.w}px`;
  entry.bezel.style.height = `${entry.device.h}px`;
  entry.box.style.width = `${Math.round(entry.device.w * s)}px`;
  entry.box.style.height = `${Math.round(entry.device.h * s)}px`;
}

function layoutAll() {
  for (const entry of state.frames.values()) layoutFrame(entry);
}

function clearFrames() {
  state.frames.clear();
  grid.textContent = '';
}

/**
 * Build the grid. Frames are mounted in sequence with a small gap rather than all at
 * once: nineteen simultaneous loads of the same catalogue is enough to make the dev
 * server the bottleneck, which would show up as slow frames rather than as a defect.
 */
async function renderFrames() {
  clearFrames();
  const list = visibleDevices();
  for (const device of list) {
    buildFrame(device);
    await new Promise((r) => setTimeout(r, 40));
  }
  layoutAll();
  setStatus();
}

// ---------------------------------------------------------------- navigation

function reloadAll() {
  for (const entry of state.frames.values()) entry.iframe.src = frameUrl();
  setStatus();
}

/**
 * Put every frame on the same screen.
 *
 * Two paths, because the room may or may not share an origin with the app:
 *
 *  - Same-origin: `src/App.tsx` listens for `nexg:set-route` from its own origin,
 *    rewrites the query string, re-reads it and answers `nexg:route-changed`. Nothing
 *    is refetched and no entrance animation replays.
 *  - Cross-origin (the default here): the frame cannot be reached, so it is pointed at
 *    the new URL. Slower, but honest — and any frame that fails to acknowledge on the
 *    same-origin path is reloaded the same way, because a frame quietly stuck on the
 *    wrong screen would invalidate every judgement made from it.
 */
async function navigateAll() {
  exitStills();
  const url = frameUrl();
  const pending = [];

  for (const entry of state.frames.values()) {
    let reachable = false;
    if (state.sameOrigin) {
      const route = routeFor(state.route);
      try {
        entry.iframe.contentWindow.postMessage(
          {
            type: 'nexg:set-route',
            search: `${route.path.replace(/^\//, '')}${
              route.path.includes('?') ? '&' : '?'
            }theme=${state.theme}`,
          },
          location.origin
        );
        reachable = true;
      } catch {
        reachable = false;
      }
    }
    if (reachable) pending.push(entry);
    else entry.iframe.src = url;
  }

  if (pending.length) {
    const acked = new Set();
    const onAck = (e) => {
      if (e.origin === location.origin && e.data?.type === 'nexg:route-changed') acked.add(e.source);
    };
    window.addEventListener('message', onAck);
    await new Promise((r) => setTimeout(r, 1200));
    window.removeEventListener('message', onAck);
    for (const entry of pending) {
      if (!acked.has(entry.iframe.contentWindow)) entry.iframe.src = url;
    }
  }

  for (const entry of state.frames.values()) entry.metrics.textContent = routeFor(state.route).label;
  setStatus();
}

// ---------------------------------------------------------------- audit

/**
 * Measure the current screen on the server and render the result.
 *
 * The server drives its own browser per device (see `/api/audit`), which is the only
 * approach that works with cross-origin frames and the only one that cannot silently
 * measure nothing. The response reports the route it actually loaded, and a frame that
 * failed is a row with `error`, never an omission.
 */
async function runAudit() {
  setBusy(true, `measuring ${visibleDevices().length} devices on the server...`);
  try {
    const q = new URLSearchParams({
      route: state.route,
      group: state.group,
      theme: state.theme,
    });
    const res = await fetch(`/api/audit?${q}`);
    if (!res.ok) throw new Error(`/api/audit returned ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    renderAudit(data);
    paintFrameStates(data.rows);
  } catch (err) {
    panel.hidden = false;
    panelTitle.textContent = 'Layout audit failed';
    panelBody.textContent = '';
    const p = document.createElement('p');
    p.className = 'bad';
    p.style.padding = '14px 0';
    p.textContent = `${err.message}. Nothing was measured, so nothing is known about this screen.`;
    panelBody.append(p);
  } finally {
    setBusy(false);
    setStatus();
  }
}

/**
 * A frame is only marked broken if the audit measured that exact device width on the
 * same screen. Matching on width alone would let a 360px verdict land on a different
 * 360px phone, which is harmless here but would be wrong the moment two presets share
 * a width and differ in user agent.
 */
function paintFrameStates(rows) {
  const byDevice = new Map(rows.map((r) => [r.device.id, r]));
  for (const [id, entry] of state.frames) {
    const row = byDevice.get(id);
    if (!row) {
      entry.wrap.dataset.state = '';
      continue;
    }
    if (row.error) {
      entry.wrap.dataset.state = '';
      entry.metrics.textContent = `NOT MEASURED: ${row.error}`;
      continue;
    }
    entry.wrap.dataset.state = row.broken ? 'broken' : 'clean';
    entry.metrics.textContent = row.broken
      ? `overflow ${row.overflowX}px / ${row.offenderCount} past edge / ${row.clipped} clipped`
      : `clean at ${row.vw}px`;
  }
}

function renderAudit(data) {
  const { rows, route, theme, target } = data;
  panel.hidden = false;

  const measured = rows.filter((r) => !r.error);
  const failed = rows.length - measured.length;
  const broken = measured.filter((r) => r.broken);
  panelTitle.textContent = `Layout audit - ${route.label} - ${theme} - ${new Date().toLocaleTimeString()}`;

  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <p style="font-size:12px;color:var(--text-2);margin:10px 0 6px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <span>${measured.length} of ${rows.length} device(s) measured</span>
      <span class="chip ${broken.length ? 'chip--bad' : 'chip--ok'}">${broken.length} broken</span>
      <span class="chip ${failed ? 'chip--bad' : 'chip--ok'}">${failed} not measured</span>
      <span class="chip">${target}</span>
    </p>
    ${broken.length ? '' : '<p style="font-size:12px;color:var(--ok);margin:0 0 10px">No overflow, no text past the edge, no unreadably clipped text at any of these widths.</p>'}
    <table>
      <thead>
        <tr>
          <th>Device</th><th class="num">W</th><th class="num">Tier</th>
          <th class="num">Overflow</th><th class="num">Past edge</th>
          <th class="num">Clipped</th><th class="num">Tap&lt;24</th>
          <th class="num">Page/VP</th><th>Detail</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>`;

  const tbody = wrap.querySelector('tbody');
  for (const r of [...rows].sort((a, b) => a.device.w - b.device.w)) {
    const tr = document.createElement('tr');
    if (r.error) {
      tr.innerHTML = `
        <td>${escapeHtml(r.device.name)}</td><td class="num">${r.device.w}</td>
        <td class="num">${r.device.tier}</td>
        <td colspan="6" class="bad">NOT MEASURED: ${escapeHtml(r.error)}</td>`;
      tbody.append(tr);
      continue;
    }
    const detail = [];
    for (const o of r.worst) {
      detail.push(
        `<div class="offender">&lt;${o.tag}&gt; right=<b>${o.right}</b> w=${o.width} "${escapeHtml(o.text)}" ${escapeHtml(o.cls)}</div>`
      );
    }
    for (const c of r.clippedEls) {
      detail.push(
        `<div class="offender">clipped &lt;${c.tag}&gt; needs <b>${c.needs}</b>px, has ${c.has}px "${escapeHtml(c.text)}" ${escapeHtml(c.cls)}</div>`
      );
    }
    for (const t of r.tapExamples ?? []) {
      detail.push(`<div class="offender">tap target &lt;${t.tag}&gt; <b>${t.w}x${t.h}</b> "${escapeHtml(t.text)}"</div>`);
    }
    if (r.pageErrors?.length) {
      detail.push(`<div class="offender bad">page error: ${escapeHtml(r.pageErrors[0])}</div>`);
    }
    tr.innerHTML = `
      <td>${escapeHtml(r.device.name)}${r.blank ? ' <span class="bad">BLANK?</span>' : ''}</td>
      <td class="num">${r.device.w}</td>
      <td class="num">${r.device.tier}${r.device.critical ? ' *' : ''}</td>
      <td class="num ${r.overflowX > 2 ? 'bad' : 'ok'}">${r.overflowX}</td>
      <td class="num ${r.offenderCount ? 'bad' : 'ok'}">${r.offenderCount}</td>
      <td class="num ${r.clipped ? 'warn' : 'ok'}">${r.clipped}</td>
      <td class="num ${r.tapTooSmall ? 'warn' : 'ok'}">${r.tapTooSmall}</td>
      <td class="num">${r.viewportRatio}</td>
      <td>${detail.length ? `<details><summary>${detail.length} item(s)</summary>${detail.join('')}</details>` : ''}</td>`;
    tbody.append(tr);
  }

  panelBody.textContent = '';
  panelBody.append(wrap);
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---------------------------------------------------------------- stills

/**
 * Capture PNG stills through the room's own server, which drives a separate browser.
 *
 * The frames in this page cannot be screenshot from here: an iframe's pixels are not
 * exposed to the parent document, and a canvas round-trip is not available for a
 * framed document. The server has no such limit, so it does the capture and this
 * only places the result.
 */
async function captureStills() {
  const list = visibleDevices();
  setBusy(true, `capturing ${list.length} stills...`);
  grid.hidden = true;
  let gallery = document.querySelector('.stills');
  if (gallery) gallery.remove();
  gallery = document.createElement('div');
  gallery.className = 'stills';
  document.querySelector('main').append(gallery);

  const r = routeFor(state.route);
  let done = 0;
  let failed = 0;

  // Sequential: each capture launches its own browser, and doing them in parallel
  // would contend for the dev server that is serving all of them.
  for (const device of list) {
    const q = new URLSearchParams({
      w: String(device.w),
      h: String(device.h),
      path: r.path,
      theme: state.theme,
    });
    const figure = document.createElement('figure');
    figure.className = 'still';
    const img = document.createElement('img');
    img.alt = `${r.label} on ${device.name} at ${device.w} by ${device.h}`;
    img.loading = 'lazy';
    const cap = document.createElement('figcaption');
    cap.textContent = `${device.name} - ${device.w}x${device.h} - capturing...`;
    figure.append(img, cap);
    gallery.append(figure);

    img.src = `/api/still?${q}`;
    await new Promise((resolve) => {
      img.addEventListener('load', () => {
        done++;
        cap.textContent = `${device.name} - ${device.w}x${device.h} - ${r.label} - ${state.theme}`;
        resolve();
      });
      img.addEventListener('error', () => {
        failed++;
        cap.textContent = `${device.name} - ${device.w}x${device.h} - CAPTURE FAILED`;
        resolve();
      });
    });
    setBusy(true, `capturing stills... ${done + failed}/${list.length}`);
  }

  setBusy(false);
  setStatus(
    `<span class="chip ${failed ? 'chip--bad' : 'chip--ok'}">${done} stills captured${failed ? `, ${failed} failed` : ''}</span>`
  );
}

function exitStills() {
  const gallery = document.querySelector('.stills');
  if (gallery) gallery.remove();
  grid.hidden = false;
  layoutAll();
}

// ---------------------------------------------------------------- chrome

function setStatus(extra = '') {
  const r = routeFor(state.route);
  const n = state.frames.size;
  const critical = visibleDevices().filter((d) => d.critical).length;
  status.innerHTML =
    `<b>${n}</b> frames &middot; <b>${r.label}</b> &middot; ${state.theme} &middot; zoom ` +
    `${state.zoom === 'auto' ? 'auto' : `${Math.round(Number(state.zoom) * 100)}%`}` +
    (critical ? ` &middot; <span class="chip chip--warn">${critical} critical width(s) in view</span>` : '') +
    (extra ? ` &middot; <span class="chip chip--warn">${extra}</span>` : '');
}

function setBusy(busy, text = '') {
  for (const id of ['audit', 'stills', 'reload']) $(id).disabled = busy;
  if (busy && text) status.innerHTML = `<b>${text}</b>`;
}

// ---------------------------------------------------------------- wiring

function populateSelectors() {
  const routeSel = $('route');
  routeSel.textContent = '';
  for (const r of state.routes) {
    const o = document.createElement('option');
    o.value = r.id;
    o.textContent = r.label;
    routeSel.append(o);
  }
  routeSel.value = state.route;
  $('group').value = state.group;
  $('theme').value = state.theme;
  $('zoom').value = state.zoom;
}

$('route').addEventListener('change', (e) => {
  state.route = e.target.value;
  exitStills();
  writeHash();
  setStatus('switching every frame...');
  navigateAll();
});

$('group').addEventListener('change', async (e) => {
  state.group = e.target.value;
  exitStills();
  writeHash();
  await renderFrames();
});

$('theme').addEventListener('change', (e) => {
  state.theme = e.target.value;
  exitStills();
  writeHash();
  applyTheme({ reload: true });
});

$('zoom').addEventListener('change', (e) => {
  state.zoom = e.target.value;
  writeHash();
  layoutAll();
  setStatus();
});

$('reload').addEventListener('click', () => {
  exitStills();
  reloadAll();
});

$('audit').addEventListener('click', runAudit);

$('stills').addEventListener('click', captureStills);

$('panel-close').addEventListener('click', () => {
  panel.hidden = true;
  for (const entry of state.frames.values()) entry.wrap.dataset.state = '';
});

// Keyboard: the room is used in long comparison sessions, so the two actions that
// are reached for constantly get a key. No modifier, and never on a focused input.
document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
  if (e.key === 'a' || e.key === 'A') runAudit();
  else if (e.key === 'r' || e.key === 'R') reloadAll();
  else if (e.key === 's' || e.key === 'S') captureStills();
  else if (e.key === 'Escape') {
    panel.hidden = true;
    exitStills();
  }
});

// The auto-fit zoom is a function of the column width, so it has to be recomputed
// when the window changes size. Debounced: a drag-resize fires this continuously and
// relayouting nineteen frames on every frame of the drag is wasted work.
let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (state.zoom === 'auto') layoutAll();
  }, 120);
});

// ---------------------------------------------------------------- boot

readHash();
populateSelectors();
// Seed the theme before the first frame mounts, so no frame ever paints the wrong
// one and then flips — a flash would be mistaken for a defect in the app.
try {
  localStorage.setItem('nexg_theme', state.theme);
} catch {
  /* storage unavailable */
}
await renderFrames();
