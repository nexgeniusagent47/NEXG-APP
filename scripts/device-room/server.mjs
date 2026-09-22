// scripts/device-room/server.mjs
//
// DEVICE ROOM — one local URL that renders this app at every real device size we
// support, side by side, so a layout decision can be judged before it is pushed.
//
// WHY THIS EXISTS
// The device-matrix audit (`logs/critique/_device-matrix.mjs`) measures overflow
// programmatically, but a number is not a look. Reviewing one phone width at a time
// through devtools is slow, and comparing two widths means remembering one of them.
// The room removes both problems: every width is live at once, in one scroll.
//
// HOW THE FRAMES ARE DRIVEN
// The app reads its route from `?page=` and its theme from `localStorage.nexg_theme`.
// Because the room is served from the same host as the app (see `--app` / LAN notes
// below), the frames are same-origin: the room can seed the theme, re-navigate a
// frame without reloading it, and read each frame's layout to run the audit. The two
// functions below — `navigateFrame` and `measureFrame` — are the whole contract with
// the page, and they are wrapped so a frame that has not finished loading is a
// "pending" result rather than an exception.
//
// Usage:
//   node scripts/device-room/server.mjs            # http://localhost:3100
//   node scripts/device-room/server.mjs --port 3100 --app http://127.0.0.1:3000
//
// The app origin is inferred from the request Host header, so opening the room at
// http://127.0.0.1:3100 frames http://127.0.0.1:3000 and opening it at
// http://192.168.x.x:3100 frames http://192.168.x.x:3000 — which is what makes the
// same URL usable from a real phone on the same network. Both dev servers must be
// hosted (`vite --host`), which `npm run dev` already does.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEVICE_PRESETS, ROUTES, CRITICAL_WIDTHS } from '../device-presets.mjs';
import { MEASURE_SOURCE } from './measure.mjs';
import { measurePage } from './measure-page.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// ---- args
const argv = process.argv.slice(2);
const argOf = (flag, fallback) => {
  const i = argv.indexOf(flag);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const PORT = Number(argOf('--port', process.env.NEXG_ROOM_PORT ?? 3100));
const APP_OVERRIDE = argOf('--app', process.env.NEXG_APP_URL ?? '');

// ---- consent
// The banner is real, blocking, and would sit over the bottom of every frame. A
// returning visitor has already answered, so the room answers for them. The value
// must match the `ConsentState` shape in src/lib/consent.ts exactly — a mismatch is
// silently read as "undecided" and the banner comes back with no error to explain it.
const CONSENT_VERSION = 1;
const CONSENT_COOKIE = `nexg_consent=${encodeURIComponent(
  JSON.stringify({
    status: 'granted',
    categories: { necessary: true, analytics: true, marketing: false },
    version: CONSENT_VERSION,
    decidedAt: '2026-01-01T00:00:00.000Z',
  })
)}; Path=/; Max-Age=15552000; SameSite=Lax`;

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

/**
 * How long a page is given to settle before it is measured or captured.
 *
 * The app mounts its content asynchronously and lazy-loads sections below the fold,
 * so an immediate measurement reads a skeleton. 3200ms is the same settle the
 * existing audit uses (`logs/critique/_device-matrix.mjs`), kept identical so the two
 * cannot report different verdicts for the same page.
 */
const SETTLE_MS = 3200;

/** Device groups, defined once so the room's filter and the audit's agree. */
const GROUPS = {
  all: () => DEVICE_PRESETS,
  phone: () => DEVICE_PRESETS.filter((d) => d.category === 'phone'),
  narrow: () => DEVICE_PRESETS.filter((d) => d.critical),
  tablet: () => DEVICE_PRESETS.filter((d) => d.category === 'tablet'),
  desktop: () => DEVICE_PRESETS.filter((d) => d.category === 'desktop'),
};

const filterDevices = (group) => (GROUPS[group] ?? GROUPS.all)();

/** The origin the app is served from, as seen by whoever opened the room. */
function appOriginFor(req) {
  if (APP_OVERRIDE) return APP_OVERRIDE.replace(/\/$/, '');
  const host = req.headers.host ?? `127.0.0.1:${PORT}`;
  const hostname = host.split(':')[0];
  return `http://${hostname}:3000`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);
  const appOrigin = appOriginFor(req);

  // ---- the measurement function as source text.
  // Exposed so a control can run the *same* function against a deliberately broken
  // document. A clean audit is only meaningful if the measurement is known to fail on
  // a known-bad input in the same run.
  if (url.pathname === '/api/measure-source') {
    const body = Buffer.from(MEASURE_SOURCE, 'utf8');
    res.writeHead(200, {
      'Content-Type': CONTENT_TYPES['.js'],
      'Cache-Control': 'no-store',
      'Content-Length': body.length,
    });
    res.end(body);
    return;
  }

  // ---- audit: measure one route at many device sizes, server-side.
  //
  // The room's own frames are cross-origin (same host, different port, and a port is
  // part of an origin), so the page cannot read their layout — `contentDocument` is
  // `null` and every frame would report "not measured". Driving a browser here removes
  // that dependency entirely and is the only version of this that cannot silently
  // degrade into a false clean result.
  if (url.pathname === '/api/audit') {
    const routeId = url.searchParams.get('route') ?? 'home';
    const group = url.searchParams.get('group') ?? 'all';
    const theme = url.searchParams.get('theme') === 'light' ? 'light' : 'dark';
    const route = ROUTES.find((r) => r.id === routeId) ?? ROUTES[0];
    const list = filterDevices(group);
    const target = `${appOrigin}${route.path}`;

    try {
      const { chromium } = await import('playwright');
      const browser = await chromium.launch();
      const rows = [];

      // Sequential on purpose: each device is a fresh context, and running them in
      // parallel contends for the dev server that is serving every one of them.
      for (const device of list) {
        const ctx = await browser.newContext({
          viewport: { width: device.w, height: device.h },
          deviceScaleFactor: 1,
          isMobile: device.w < 768,
          hasTouch: device.w < 768,
          locale: 'en-KE',
        });
        await ctx.addInitScript(
          ([cookie, t]) => {
            document.cookie = cookie;
            try {
              localStorage.setItem('nexg_theme', t);
            } catch {
              /* storage unavailable; the app falls back to dark */
            }
          },
          [CONSENT_COOKIE.split(';')[0], theme]
        );
        const page = await ctx.newPage();
        const pageErrors = [];
        page.on('pageerror', (e) => pageErrors.push(String(e.message).slice(0, 160)));
        try {
          // Same helper the device matrix uses, so both retry identically when the dev
          // server reloads a page mid-measurement instead of one of them aborting.
          const m = await measurePage(page, {
            url: target,
            width: device.w,
            height: device.h,
            settleMs: SETTLE_MS,
          });
          if (!m) {
            rows.push({
              device,
              error: 'every attempt to read the page failed (dev server reloaded it?)',
              broken: null,
              pageErrors,
            });
          } else {
            const broken = m.overflowX > 2 || m.offenderCount > 0 || m.blank;
            rows.push({ device, ...m, broken, pageErrors });
          }
        } catch (err) {
          rows.push({ device, error: err?.message ?? String(err), broken: null, pageErrors });
        } finally {
          await ctx.close();
        }
      }

      await browser.close();
      const body = Buffer.from(JSON.stringify({ route, theme, target, rows }, null, 2), 'utf8');
      res.writeHead(200, {
        'Content-Type': CONTENT_TYPES['.json'],
        'Cache-Control': 'no-store',
        'Content-Length': body.length,
      });
      res.end(body);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`audit failed: ${err?.message ?? err}`);
    }
    return;
  }

  // ---- stills: capture one frame with Playwright and return the PNG bytes.
  // Used by the room's "Capture stills" button so a set of screenshots can be taken
  // without leaving the page. Playwright is imported lazily and its absence is
  // reported as a readable error rather than a crashed server.
  if (url.pathname === '/api/still') {
    const w = Math.max(200, Math.min(2560, Number(url.searchParams.get('w') ?? 390)));
    const h = Math.max(400, Math.min(4000, Number(url.searchParams.get('h') ?? 844)));
    const full = url.searchParams.get('full') === '1';
    const theme = url.searchParams.get('theme') === 'light' ? 'light' : 'dark';
    const target = `${appOrigin}${url.searchParams.get('path') ?? '/'}`;
    try {
      const { chromium } = await import('playwright');
      const browser = await chromium.launch();
      const ctx = await browser.newContext({
        viewport: { width: w, height: h },
        deviceScaleFactor: 2,
        isMobile: w < 768,
        hasTouch: w < 768,
        locale: 'en-KE',
      });
      await ctx.addInitScript(
        ([cookie, t]) => {
          document.cookie = cookie;
          try {
            localStorage.setItem('nexg_theme', t);
          } catch {
            /* storage unavailable; the app falls back to dark */
          }
        },
        [CONSENT_COOKIE.split(';')[0], theme]
      );
      const page = await ctx.newPage();
      await page.goto(target, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      const png = await page.screenshot({ fullPage: full });
      await browser.close();
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store',
        'Content-Length': png.length,
      });
      res.end(png);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`still capture failed: ${err?.message ?? err}`);
    }
    return;
  }

  // ---- device presets, so the room and the audit script cannot drift apart.
  // The source of truth is `scripts/device-presets.mjs`, which the audit script also
  // imports. The browser cannot import a `file://` module from an http page, so the
  // server imports that same file and serves its contents as JSON — one list, two
  // consumers, no second copy to fall out of step.
  if (url.pathname === '/api/presets' || url.pathname === '/api/devices') {
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES['.json'], 'Cache-Control': 'no-store' });
    res.end(
      JSON.stringify(
        {
          appOrigin,
          devices: DEVICE_PRESETS,
          routes: ROUTES,
          criticalWidths: CRITICAL_WIDTHS,
        },
        null,
        2
      )
    );
    return;
  }

  // ---- the room itself
  const rel = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
  const file = path.join(HERE, rel);
  if (!file.startsWith(HERE) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('not found');
    return;
  }
  const body = fs.readFileSync(file);
  res.writeHead(200, {
    'Content-Type': CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
    'Set-Cookie': CONSENT_COOKIE,
    'Content-Length': body.length,
  });
  res.end(body);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`device room   http://localhost:${PORT}`);
  console.log(`framing app   ${APP_OVERRIDE || 'http://<same-host>:3000'}`);
  console.log(`presets       ${DEVICE_PRESETS.length} devices`);
});
