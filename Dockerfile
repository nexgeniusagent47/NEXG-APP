# Dockerfile
# NEXG Concierge production image: one process serving the API and the built SPA.
#
# Node 24 is the runtime because it executes `server/index.ts` directly — the
# Express entry point is TypeScript on disk and the image ships no transpiler.
# Pinning the same major version in both stages also keeps the SPA build
# reproducible against the version CI uses.
#
# Build context is trimmed by .dockerignore. `public/fonts` must NOT be excluded
# there: Vite copies it into dist/, and the licensed webfonts it carries are part
# of the shipped UI (see docs/PLAN-v3.md on font licensing).

# ----------------------------------------------------------------- builder ----
FROM node:24-alpine AS builder

WORKDIR /build

# Manifests first: this layer only invalidates when dependencies actually change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# The SPA is emitted to /build/dist, which the server serves when present.
RUN npm run build

# ---------------------------------------------------------------- production ---
FROM node:24-alpine AS production

ENV NODE_ENV=production \
    PORT=3001

WORKDIR /app

# `--omit=dev` and `--ignore-scripts` together keep build-only tooling (Vite,
# Tailwind, TypeScript, Playwright) and third-party install hooks out of the
# runtime image. Nothing here needs a native build step.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# The server resolves its paths relative to the compiled module's directory and
# then jumps one level up, so this layout — server/ and dist/ as siblings — is
# load-bearing, not cosmetic:
#   server/index.ts: REPO_ROOT       = <parent of server/> → /app
#                    seededCatalog   = /app/src/data/seededCatalog.json
#                    distDir         = /app/dist
# The API serves that JSON when Postgres is unset or unreachable, so the file is
# a runtime dependency and not a build artefact.
COPY --chown=node:node server/ ./server/
COPY --chown=node:node src/data/seededCatalog.json ./src/data/seededCatalog.json
COPY --chown=node:node --from=builder /build/dist ./dist

# Declared as build args so `docker build` does not warn about unused values, then
# promoted to environment variables because they describe the running process —
# /api/version reads them. release.yml supplies both; a plain `docker build` leaves
# them empty and versionInfo() reports "unknown" rather than a fabricated commit.
ARG GIT_SHA=""
ARG BUILT_AT=""
ENV GIT_SHA=${GIT_SHA} \
    BUILT_AT=${BUILT_AT}

# `node` (uid 1000) ships with the official image. The API has no reason to own
# its own code or to bind a privileged port, so it runs unprivileged.
USER node

EXPOSE 3001

# Node 24 has fetch built in, which avoids adding curl or wget to an image whose
# only job is to run the server. The endpoint is intentionally /api/health rather
# than a bare TCP check: it reports the live data source (postgres vs
# seeded_json_fallback), so an orchestrator can tell a serving container from a
# merely listening one. The first probe is deliberately delayed because initDb()
# retries the Postgres connection for a few seconds before it degrades to JSON.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/index.ts"]
