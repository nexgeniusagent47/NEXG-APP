import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const apiPort = process.env.API_PORT ?? '3001';

  /**
   * Strip the live-editing block out of the built HTML.
   *
   * `index.html` carries an `impeccable-live-start/end` region that the design
   * tooling injects into during a review session. Vite copies `index.html` into
   * `dist` verbatim, so without this the shipped page referenced
   * `http://localhost:8400/live.js` and embedded the session's auth token — a broken
   * request and a leaked credential in every production page load.
   *
   * Stripping at build time rather than deleting the block by hand means the
   * markers can stay in source (where the tool needs them) and can never reach a
   * deployment.
   *
   * `apply: 'build'` is load-bearing: without it the transform also runs on the dev
   * server, which would remove the very block the live tooling injects into and
   * silently break the design-review workflow.
   */
  const stripLiveInjection = () => ({
    name: 'nexg-strip-live-injection',
    apply: 'build' as const,
    enforce: 'pre' as const,
    transformIndexHtml(html: string) {
      return html.replace(
        /[ \t]*<!--\s*impeccable-live-start\s*-->[\s\S]*?<!--\s*impeccable-live-end\s*-->\s*/g,
        ''
      );
    },
  });

  return {
    plugins: [react(), tailwindcss(), stripLiveInjection()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Watcher ignore list.
      //
      // The `.tmpdir` patterns are the important ones. Editors and agents write
      // atomically by creating a hidden sibling directory
      // (`src/components/forms/.DynamicField.tsx.<pid>.<uuid>.tmpdir/`) and moving
      // the finished file out of it. Vite tried to watch that transient directory
      // and died outright with `EBUSY: resource busy or locked`, taking the dev
      // server down mid-session twice. None of these paths are imported by the app.
      //
      // `logs/` and `scripts/` are excluded for the same reason: throwaway
      // harnesses, screenshots and run logs live there.
      //
      // `public/fonts/` is excluded because binary font files are written by
      // download tools and lock briefly while being copied. Watching one produced
      // the same `EBUSY` and killed the dev server a third time. They are static
      // assets served straight from `public/`, never imported, so watching them
      // buys nothing.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              ignored: [
                '**/*.tmpdir/**',
                '**/.*.tmpdir/**',
                '**/.tmpdir/**',
                '**/*.tmp',
                '**/logs/**',
                '**/scripts/**',
                '**/.npm-cache/**',
                '**/dist/**',
                '**/.git/**',
                '**/public/fonts/**',
              ],
            },
      // Proxy the API so the SPA can call same-origin /api/* with no CORS and
      // no hardcoded hostname. Without this the frontend would have to know the
      // API port and the browser would need CORS preflight on every call.
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
    build: {
      // Route-level splitting is on (App.tsx lazy-imports every page), but on its own
      // Rollup also split each lucide icon into its own file: 47 chunks under 1 KB,
      // which is worse than bundling them because each one costs a request.
      //
      // These groups put the shared libraries back into a small number of cacheable
      // chunks. The split that matters for interactivity is the route split, and
      // that is untouched: `index` is the shell only, and each page still loads on
      // demand. Grouping react and icons together means a page navigation reuses
      // those chunks instead of re-fetching icons one at a time.
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('/motion') || id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('leaflet')) return 'vendor-leaflet';
            return 'vendor';
          },
        },
      },
      // The default 500 KB warning is meaningless once routes are split: the shell is
      // what matters, and it is well under. Raised so a real regression still warns
      // without the build shouting on every run.
      chunkSizeWarningLimit: 900,
    },
    preview: {
      port: 3000,
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
