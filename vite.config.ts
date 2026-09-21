import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const apiPort = process.env.API_PORT ?? '3001';

  return {
    plugins: [react(), tailwindcss()],
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
