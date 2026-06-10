# syntax=docker/dockerfile:1.7
#
# Shared Docker E2E image.
# `bare` is a clean Node/Git runner for install/update lanes. `functional`
# installs the prepared OpenClaw npm tarball into /app for built-app lanes.

FROM node:24-bookworm-slim@sha256:242549cd46785b480c832479a730f4f2a20865d61ea2e404fdb2a5c3d3b73ecf AS e2e-runner

# python3 covers package/plugin install paths that execute helper scripts.
# procps provides pgrep for E2E watchdogs that assert no package-manager work is
# still running after Gateway readiness.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ca-certificates git procps python3 \
 && rm -rf /var/lib/apt/lists/*

RUN corepack enable
RUN npm install -g tsx@4.21.0 --no-fund --no-audit

RUN useradd --create-home --shell /bin/bash appuser \
 && mkdir -p /app \
 && chown appuser:appuser /app

ENV HOME="/home/appuser"
ENV PATH="/home/appuser/.local/bin:${PATH}"
ENV NODE_OPTIONS="--disable-warning=ExperimentalWarning"
# Docker E2E lanes start many loopback gateways concurrently; mDNS advertising
# is unrelated to those checks and can flap under container CPU/network load.
ENV OPENCLAW_DISABLE_BONJOUR="1"

USER appuser
WORKDIR /app

<<<<<<< HEAD
COPY --chown=appuser:appuser package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY --chown=appuser:appuser ui/package.json ./ui/package.json
COPY --chown=appuser:appuser extensions ./extensions
COPY --chown=appuser:appuser patches ./patches
COPY --chown=appuser:appuser scripts/postinstall-bundled-plugins.mjs scripts/npm-runner.mjs ./scripts/
=======
FROM e2e-runner AS bare
>>>>>>> upstream/main

CMD ["bash"]

<<<<<<< HEAD
COPY --chown=appuser:appuser tsconfig.json tsconfig.plugin-sdk.dts.json tsdown.config.ts vitest.config.ts vitest.e2e.config.ts vitest.performance-config.ts vitest.shared.config.ts vitest.system-load.ts vitest.bundled-plugin-paths.ts openclaw.mjs ./
COPY --chown=appuser:appuser src ./src
COPY --chown=appuser:appuser test ./test
COPY --chown=appuser:appuser scripts ./scripts
COPY --chown=appuser:appuser docs ./docs
COPY --chown=appuser:appuser packages ./packages
COPY --chown=appuser:appuser skills ./skills
COPY --chown=appuser:appuser ui ./ui
COPY --chown=appuser:appuser extensions ./extensions
COPY --chown=appuser:appuser vendor/a2ui/renderers/lit ./vendor/a2ui/renderers/lit
COPY --chown=appuser:appuser apps/shared/OpenClawKit/Sources/OpenClawKit/Resources ./apps/shared/OpenClawKit/Sources/OpenClawKit/Resources
COPY --chown=appuser:appuser apps/shared/OpenClawKit/Tools/CanvasA2UI ./apps/shared/OpenClawKit/Tools/CanvasA2UI
=======
FROM bare AS build
>>>>>>> upstream/main

CMD ["bash"]

FROM bare AS functional

# The app under test enters through the named BuildKit context, not by copying
# checkout sources into the image.
COPY --from=openclaw_package --chown=appuser:appuser openclaw-current.tgz /tmp/openclaw-current.tgz
# Preserve package self-reference imports such as openclaw/plugin-sdk/* after
# copying the installed package out of npm's global node_modules tree.
RUN npm install -g --prefix /tmp/openclaw-prefix /tmp/openclaw-current.tgz --no-fund --no-audit \
 && cp -a /tmp/openclaw-prefix/lib/node_modules/openclaw/. /app/ \
 && mkdir -p "$HOME/.local/bin" \
 && ln -sf /app/openclaw.mjs "$HOME/.local/bin/openclaw" \
 && rm -rf /app/node_modules/openclaw \
 && ln -sf /app /app/node_modules/openclaw \
 && rm -rf /tmp/openclaw-prefix /tmp/openclaw-current.tgz

CMD ["bash"]
