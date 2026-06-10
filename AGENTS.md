# AGENTS.MD

<<<<<<< HEAD
- Repo: https://github.com/openclaw/openclaw
- In chat replies, file references must be repo-root relative only (example: `src/telegram/index.ts:80`); never absolute paths or `~/...`.
- Do not edit files covered by security-focused `CODEOWNERS` rules unless a listed owner explicitly asked for the change or is already reviewing it with you. Treat those paths as restricted surfaces, not drive-by cleanup.
=======
Telegraph style. Root rules only. Read scoped `AGENTS.md` before subtree work.
Skills own workflows; root owns hard policy and routing.
>>>>>>> upstream/main

## Start

<<<<<<< HEAD
- Source code: `src/` (CLI wiring in `src/cli`, commands in `src/commands`, web provider in `src/provider-web.ts`, infra in `src/infra`, media pipeline in `src/media`).
- Tests: colocated `*.test.ts`.
- Docs: `docs/` (images, queue, Pi config). Built output lives in `dist/`.
- Nomenclature: use "plugin" / "plugins" in docs, UI, changelogs, and contributor guidance. The bundled workspace plugin tree remains the internal package layout to avoid repo-wide churn from a rename.
- Bundled plugin naming: for repo-owned workspace plugins, keep the canonical plugin id aligned across `openclaw.plugin.json:id`, the default workspace folder name, and package names anchored to the same id (`@openclaw/<id>` or approved suffix forms like `-provider`, `-plugin`, `-speech`, `-sandbox`, `-media-understanding`). Keep `openclaw.install.npmSpec` equal to the package name and `openclaw.channel.id` equal to the plugin id when present. Exceptions must be explicit and covered by the repo invariant test.
- Plugins: live in the bundled workspace plugin tree (workspace packages). Keep plugin-only deps in the extension `package.json`; do not add them to the root `package.json` unless core uses them.
- Plugins: install runs `npm install --omit=dev` in plugin dir; runtime deps must live in `dependencies`. Avoid `workspace:*` in `dependencies` (npm install breaks); put `openclaw` in `devDependencies` or `peerDependencies` instead (runtime resolves `openclaw/plugin-sdk` via jiti alias).
- Import boundaries: extension production code should treat `openclaw/plugin-sdk/*` plus local `api.ts` / `runtime-api.ts` barrels as the public surface. Do not import core `src/**`, `src/plugin-sdk-internal/**`, or another extension's `src/**` directly.
- Installers served from `https://openclaw.ai/*`: live in the sibling repo `../openclaw.ai` (`public/install.sh`, `public/install-cli.sh`, `public/install.ps1`).
- Messaging channels: always consider **all** built-in + extension channels when refactoring shared logic (routing, allowlists, pairing, command gating, onboarding, docs).
  - Core channel docs: `docs/channels/`
  - Core channel code: `src/telegram`, `src/discord`, `src/slack`, `src/signal`, `src/imessage`, `src/web` (WhatsApp web), `src/channels`, `src/routing`
  - Bundled plugin channels: the workspace plugin tree (for example Matrix, Zalo, ZaloUser, Voice Call)
- When adding channels/plugins/apps/docs, update `.github/labeler.yml` and create matching GitHub labels (use existing channel/plugin label colors).

## Architecture Boundaries

- Start here for the repo map:
  - bundled workspace plugin tree = bundled plugins and the closest example surface for third-party plugins
  - `src/plugin-sdk/*` = the public plugin contract that extensions are allowed to import
  - `src/channels/*` = core channel implementation details behind the plugin/channel boundary
  - `src/plugins/*` = plugin discovery, manifest validation, loader, registry, and contract enforcement
  - `src/gateway/protocol/*` = typed Gateway control-plane and node wire protocol
- Progressive disclosure lives in local boundary guides:
  - bundled-plugin-tree `AGENTS.md`
  - `src/plugin-sdk/AGENTS.md`
  - `src/channels/AGENTS.md`
  - `src/plugins/AGENTS.md`
  - `src/gateway/protocol/AGENTS.md`
- Plugin and extension boundary:
  - Public docs: `docs/plugins/building-plugins.md`, `docs/plugins/architecture.md`, `docs/plugins/sdk-overview.md`, `docs/plugins/sdk-entrypoints.md`, `docs/plugins/sdk-runtime.md`, `docs/plugins/manifest.md`, `docs/plugins/sdk-channel-plugins.md`, `docs/plugins/sdk-provider-plugins.md`
  - Definition files: `src/plugin-sdk/plugin-entry.ts`, `src/plugin-sdk/core.ts`, `src/plugin-sdk/provider-entry.ts`, `src/plugin-sdk/channel-contract.ts`, `scripts/lib/plugin-sdk-entrypoints.json`, `package.json`
  - Invariant: core must stay extension-agnostic. Adding a bundled or third-party extension should not require unrelated core edits just to teach core that the extension exists.
  - Rule: extensions must cross into core only through `openclaw/plugin-sdk/*`, manifest metadata, and documented runtime helpers. Do not import `src/**` from extension production code.
  - Rule: core code and tests must not deep-import bundled plugin internals such as a plugin's `src/**` files or `onboard.js`. If core needs a bundled plugin helper, expose it through that plugin's `api.ts` and, when it is a real cross-package contract, through `src/plugin-sdk/<id>.ts`.
  - Rule: do not add hardcoded bundled extension/provider/channel/capability id lists, maps, or named special cases in core when a manifest, capability, registry, or plugin-owned contract can express the same behavior.
  - Rule: extension-owned compatibility behavior belongs to the owning extension. Core may orchestrate generic doctor/config flows, but extension-specific legacy repairs, detection rules, onboarding, auth detection, and provider defaults should live in plugin-owned contracts.
  - Rule: for legacy config specifically, prefer doctor-owned repair paths over startup/load-time core migrations. Do not add new plugin-specific legacy migration logic to shared core/runtime surfaces when `openclaw doctor --fix` can own it.
  - Rule: when a test is asserting extension-specific behavior, keep that coverage in the owning extension when feasible. Core tests should assert generic contracts and registry/capability behavior, not extension internals.
  - Refactor trigger: if you encounter core code or tests that name a specific extension/provider/channel for extension-owned behavior, refactor toward a generic registry/capability/plugin-owned seam instead of adding another special case.
  - Compatibility: new plugin seams are allowed, but they must be added as documented, backwards-compatible, versioned contracts. We have third-party plugins in the wild and do not break them casually.
- Channel boundary:
  - Public docs: `docs/plugins/sdk-channel-plugins.md`, `docs/plugins/architecture.md`
  - Definition files: `src/channels/plugins/types.plugin.ts`, `src/channels/plugins/types.core.ts`, `src/channels/plugins/types.adapters.ts`, `src/plugin-sdk/core.ts`, `src/plugin-sdk/channel-contract.ts`
  - Rule: `src/channels/**` is core implementation. If plugin authors need a new seam, add it to the Plugin SDK instead of telling them to import channel internals.
- Provider/model boundary:
  - Public docs: `docs/plugins/sdk-provider-plugins.md`, `docs/concepts/model-providers.md`, `docs/plugins/architecture.md`
  - Definition files: `src/plugins/types.ts`, `src/plugin-sdk/provider-entry.ts`, `src/plugin-sdk/provider-auth.ts`, `src/plugin-sdk/provider-catalog-shared.ts`, `src/plugin-sdk/provider-model-shared.ts`
  - Rule: core owns the generic inference loop; provider plugins own provider-specific behavior through registration and typed hooks. Do not solve provider needs by reaching into unrelated core internals.
  - Rule: avoid ad hoc reads of `plugins.entries.<id>.config` from unrelated core code. If core needs plugin-owned auth/config behavior, add or use a generic seam (`resolveSyntheticAuth`, public SDK/helper facades, manifest metadata, plugin auto-enable hooks) and honor plugin disablement plus SecretRef semantics.
  - Rule: vendor-owned tools and settings belong in the owning plugin. Do not add provider-specific tool config, secret collection, or runtime enablement to core `tools.*` surfaces unless the tool is intentionally core-owned.
- Gateway protocol boundary:
  - Public docs: `docs/gateway/protocol.md`, `docs/gateway/bridge-protocol.md`, `docs/concepts/architecture.md`
  - Definition files: `src/gateway/protocol/schema.ts`, `src/gateway/protocol/schema/*.ts`, `src/gateway/protocol/index.ts`
  - Rule: protocol changes are contract changes. Prefer additive evolution; incompatible changes require explicit versioning, docs, and client/codegen follow-through.
- Config contract boundary:
  - Canonical public config lives in exported config types, zod/schema surfaces, schema help/labels, generated config metadata, config baselines, and any user-facing gateway/config payloads. Keep those surfaces aligned.
  - When a legacy config key is retired from the public contract, remove it from every public config surface above. Keep backward compatibility only through raw-config migration/doctor seams unless explicit product policy says otherwise.
  - Do not reintroduce removed legacy aliases into public types/schema/help/baselines “for convenience”. If old configs still need to load, handle that in `legacy.migrations.*`, config ingest, or `openclaw doctor --fix`.
  - `hooks.internal.entries` is the canonical public hook config model. `hooks.internal.handlers` is compatibility-only input and must not be re-exposed in public schema/help/baseline surfaces.
- Bundled plugin contract boundary:
  - Public docs: `docs/plugins/architecture.md`, `docs/plugins/manifest.md`, `docs/plugins/sdk-overview.md`
- Definition files: `src/plugins/contracts/registry.ts`, `src/plugins/types.ts`, `src/plugins/public-artifacts.ts`
  - Rule: keep manifest metadata, runtime registration, public SDK exports, and contract tests aligned. Do not create a hidden path around the declared plugin interfaces.
- Extension test boundary:
  - Keep extension-owned onboarding/config/provider coverage under the owning bundled plugin package when feasible.
  - If core tests need bundled plugin behavior, consume it through public `src/plugin-sdk/<id>.ts` facades or the plugin's `api.ts`, not private extension modules.
  - If a core test is asserting extension-specific behavior instead of a generic contract, move it to the owning extension package.
=======
- Repo: `https://github.com/openclaw/openclaw`
- Replies: repo-root refs only: `extensions/telegram/src/index.ts:80`. No absolute paths, no `~/`.
- Docs/user-visible work: `pnpm docs:list`, then read relevant docs only.
- Fix/triage answers need source, tests, current/shipped behavior, and dependency contract proof.
- Reviews/answers: high confidence required. Default to exhaustive relevant codebase search/read, including owners, callers, siblings, tests, docs, and upstream/dependency contracts before verdict. Diff-only review is insufficient.
- Review default: read the whole changed function/module plus callers, callees, sibling implementations, adjacent tests, scoped docs, and dependency/Codex contracts before saying `good`, `bad`, `best fix`, `proof sufficient`, or posting a comment. If challenged, keep reading first; do not defend the earlier verdict until the missing path is checked.
- Dependency-touching work: direct dependency inspection is mandatory when feasible; do not rely on assumptions, wrappers, or memory. Most dependencies are OSS, so read their source/docs/types. Codex-related work has a hard gate: the acting agent must personally inspect sibling `../codex` source for the exact protocol/runtime behavior before any verdict, comment, approval, merge recommendation, code change, or `proof sufficient` claim. If missing, clone `https://github.com/openai/codex.git` there first. Subagent reports, PR text, OpenClaw wrappers, generated schemas, memory, and prior bot reviews do not satisfy this gate. No direct `../codex` check means no Codex verdict. Cite Codex files/lines checked in final/review/comment.
- Dependency-backed behavior: read upstream docs/source/types first. No API/default/error/timing guesses.
- External API work: live test required. Google/search for additional proof. Prefer official docs/source/types; cite current proof. No memory-only API claims.
- Live-verify when feasible. Never print secrets.
- Missing deps: `pnpm install`, retry once, then report first actionable error.
- CODEOWNERS: maint/refactor/tests ok. Larger behavior/product/security/ownership: owner ask/review.
- Product/docs/UI/changelog wording: "plugin/plugins"; `extensions/` is internal.
- New channel/plugin/app/doc surface: update `.github/labeler.yml` + GH labels.
- New `AGENTS.md`: add sibling `CLAUDE.md` symlink; edit `AGENTS.md` only.
>>>>>>> upstream/main

## ClawSweeper Review Policy

- OpenClaw-specific review rules live here; generic ClawSweeper prompts stay repo-agnostic.
- ClawSweeper-owned schema, labels, close reasons, protected-label gates, maintainer-item gates, and mutation rules live in `openclaw/clawsweeper`.
- Review workers read this full root `AGENTS.md` before judging; no reliance on search snippets, `head`, partial ranges, local excerpts, or truncated copies. Then read every scoped `AGENTS.md` that owns touched paths.
- Optional integrations, providers, channels, skill bundles, MCP surfaces, and service workflows route to plugins, ClawHub, or owner repos when current seams suffice. Keep core items for missing core/plugin APIs, bundled regressions, security/core hardening, or maintainer product decisions.
- Plugin APIs, provider routing, auth/session state, persisted preferences, config loading, config/default additions, migrations, setup, startup checks, and fallback behavior are compatibility/upgrade-sensitive. Treat config breaks, new config/default surfaces, removed fallbacks, fail-closed changes, stricter validation, or new operator action as merge risk even with green CI when they can affect existing users, upgrades, provider/plugin behavior, or maintainer operations.
- For PRs that add, remove, or change config/default surfaces with possible compatibility, upgrade, provider/plugin, operator, setup, startup, or fallback impact, ClawSweeper review should emit a `reviewMetrics` entry when practical. The metric should name the count and direction of the changes, such as added, changed, or removed config/default surfaces, and explain why the metric matters before merge. When the metric indicates concrete merge risk, also surface the concern in `risks`, use `mergeRiskLabels` when the risk matches the label rubric, make `bestSolution` name the desired pre-merge state, and ensure `labelJustifications` explain the specific reason rather than restating the label.
- Review whole decision surfaces, not only the touched runtime, provider, channel, harness, plugin seam, or context path. Check sibling Codex/Pi-style runtimes, provider/model routing, channel delivery, gateway/protocol, plugin SDK, and context-management paths when relevant.
- Every PR review must explicitly ask whether the PR is the best fix, not merely a plausible fix. Verdicts need a best-fix judgment backed by enough code reading to compare owner boundaries, callers, siblings, tests, docs, current `main`, shipped behavior when relevant, and dependency/Codex contracts when involved.
- Before a PR verdict, build a small evidence map: changed surface, entry point, owner boundary, at least one caller and callee, sibling surfaces that share the invariant, existing tests, and current `main` behavior. If any cell is missing, say the gap instead of concluding.
- One-sided fixes need sibling-surface proof, an explanation for why siblings are unaffected, or explicit follow-up work.
- Changelog findings: see Docs / Changelog.
- Public ClawSweeper comments prefer `https://docs.openclaw.ai/...` when a public docs page exists; structured evidence still cites repo files, lines, SHAs.
- Findings need current source, shipped/current behavior, tests/CI evidence, and dependency contract proof when dependency-backed behavior is involved. Validation is judged against touched and sibling surfaces plus this file's commands; real behavior proof matters for user-visible changes, with Telegram/Desktop proof for Telegram-visible behavior when feasible.
- Prefer findings for concrete behavior regressions, missing changed-surface proof, owner-boundary violations, security/API contract issues, or docs/config mismatches.
- Do not file findings for repo policy preference when changed code follows the relevant scoped guide and no user-visible, runtime, security, or maintainer-risk impact is shown.

<<<<<<< HEAD
## Docs i18n (generated publish locales)

- Foreign-language docs are not maintained in this repo. The generated publish output lives in the separate `openclaw/docs` repo (often cloned locally as the sibling `openclaw-docs` directory); do not add or edit localized docs under `docs/<locale>/**` here.
- Those localized docs are autogenerated. Treat this repo's English docs plus glossary files as the source of truth, and let the publish/translation pipeline update `openclaw/docs`.
- Pipeline: update English docs here → adjust the matching `docs/.i18n/glossary.<locale>.json` entries → let the publish-repo sync + `scripts/docs-i18n` run in `openclaw/docs` / local `openclaw-docs` clone → apply targeted fixes only if instructed.
- Before rerunning `scripts/docs-i18n`, add glossary entries for any new technical terms, page titles, or short nav labels that must stay in English or use a fixed translation (for example `Doctor` or `Polls`).
- `pnpm docs:check-i18n-glossary` enforces glossary coverage for changed English doc titles and short internal doc labels before translation reruns.
- Translation memory lives in generated `docs/.i18n/*.tm.jsonl` files in the publish repo.
- See `docs/.i18n/README.md`.
- The pipeline can be slow/inefficient; if it’s dragging, ping @jospalmbier on Discord instead of hacking around it.

## Control UI i18n (generated in repo)

- Control UI foreign-language locale bundles are generated in this repo; do not hand-edit `ui/src/i18n/locales/*.ts` for non-English locales or `ui/src/i18n/.i18n/*` unless a targeted generated-output fix is explicitly requested.
- Source of truth is `ui/src/i18n/locales/en.ts` plus the generator/runtime wiring in `scripts/control-ui-i18n.ts`, `ui/src/i18n/lib/types.ts`, and `ui/src/i18n/lib/registry.ts`.
- Pipeline: update English control UI strings and locale wiring here → run `pnpm ui:i18n:sync` (or let `Control UI Locale Refresh` do it) → commit the regenerated locale bundles and `.i18n` metadata.
- If the control UI locale outputs drift, regenerate them; do not manually translate or hand-maintain the generated locale files by default.

## exe.dev VM ops (general)
=======
## Map

- Core TS: `src/`, `ui/`, `packages/`; plugins: `extensions/`; SDK: `src/plugin-sdk/*`; channels: `src/channels/*`; loader: `src/plugins/*`; protocol: `packages/gateway-protocol/*`; docs/apps: `docs/`, `apps/`.
- Installers: sibling `../openclaw.ai`.
- Scoped guides: `extensions/`, `src/{plugin-sdk,channels,plugins,gateway,agents}/`, `packages/`, `test/helpers*/`, `docs/`, `ui/`, `scripts/`.

## Docs
>>>>>>> upstream/main

- Source docs: `docs/**`; publish repo: `openclaw/docs`; host: `https://docs.openclaw.ai`.
- Flow: source -> `docs-sync-publish.yml` -> mirror build -> R2 -> Worker router.
- Docs AI: `openclaw/ask-molty`; see its `AGENTS.md`.

## Architecture

<<<<<<< HEAD
- Runtime baseline: Node **22+** (keep Node + Bun paths working).
- Install deps: `pnpm install`
- If deps are missing (for example `node_modules` missing, `vitest not found`, or `command not found`), run the repo’s package-manager install command (prefer lockfile/README-defined PM), then rerun the exact requested command once. Apply this to test/build/lint/typecheck/dev commands; if retry still fails, report the command and first actionable error.
- Pre-commit hooks: `prek install`. The hook runs the repo verification flow, including `pnpm check`.
- `FAST_COMMIT=1` skips the repo-wide `pnpm format` and `pnpm check` inside the pre-commit hook only. Use it when you intentionally want a faster commit path and are running equivalent targeted verification manually. It does not change CI and does not change what `pnpm check` itself does.
- Also supported: `bun install` (keep `pnpm-lock.yaml` + Bun patching in sync when touching deps/patches).
- Prefer Bun for TypeScript execution (scripts, dev, tests): `bun <file.ts>` / `bunx <tool>`.
- Run CLI in dev: `pnpm openclaw ...` (bun) or `pnpm dev`.
- Node remains supported for running built output (`dist/*`) and production installs.
- Mac packaging (dev): `scripts/package-mac-app.sh` defaults to current arch.
- Type-check/build: `pnpm build`
- TypeScript checks: `pnpm tsgo`
- Lint/format: `pnpm check`
- Local agent/dev shells default to lower-memory `OPENCLAW_LOCAL_CHECK=1` behavior for `pnpm tsgo` and `pnpm lint`; set `OPENCLAW_LOCAL_CHECK=0` in CI/shared runs.
- Format check: `pnpm format` (oxfmt --check)
- Format fix: `pnpm format:fix` (oxfmt --write)
- Terminology:
  - "gate" means a verification command or command set that must be green for the decision you are making.
  - A local dev gate is the fast default loop, usually `pnpm check` plus any scoped test you actually need.
  - A landing gate is the broader bar before pushing `main`, usually `pnpm check`, `pnpm test`, and `pnpm build` when the touched surface can affect build output, packaging, lazy-loading/module boundaries, or published surfaces.
  - A CI gate is whatever the relevant workflow enforces for that lane (for example `check`, `check-additional`, `build-smoke`, or release validation).
- Local dev gate: prefer `pnpm check` for the normal edit loop. It keeps the repo-architecture policy guards out of the default local loop.
- CI architecture gate: `check-additional` enforces architecture and boundary policy guards that are intentionally kept out of the default local loop.
- Formatting gate: the pre-commit hook runs `pnpm format` before `pnpm check`. If you want a formatting-only preflight locally, run `pnpm format` explicitly.
- If you need a fast commit loop, `FAST_COMMIT=1 git commit ...` skips the hook’s repo-wide `pnpm format` and `pnpm check`; use that only when you are deliberately covering the touched surface some other way.
- Tests: `pnpm test` (vitest); coverage: `pnpm test:coverage`
- Generated baseline drift detection uses SHA-256 hash files under `docs/.generated/` (`.sha256` files tracked in git; full JSON baselines are gitignored, generated locally for inspection).
- Config schema drift uses `pnpm config:docs:gen` / `pnpm config:docs:check`.
- Plugin SDK API drift uses `pnpm plugin-sdk:api:gen` / `pnpm plugin-sdk:api:check`.
- If you change config schema/help or the public Plugin SDK surface, run the matching gen command and commit the updated `.sha256` hash file. Keep the two drift-check flows adjacent in scripts/workflows/docs guidance rather than inventing a third pattern.
- For narrowly scoped changes, prefer narrowly scoped tests that directly validate the touched behavior. If no meaningful scoped test exists, say so explicitly and use the next most direct validation available.
- Verification modes for work on `main`:
  - Default mode: `main` is relatively stable. Count pre-commit hook coverage when it already verified the current tree, avoid rerunning the exact same checks just for ceremony, and prefer keeping CI/main green before landing.
  - Fast-commit mode: `main` is moving fast and you intentionally optimize for shorter commit loops. Prefer explicit local verification close to the final landing point, and it is acceptable to use `--no-verify` for intermediate or catch-up commits after equivalent checks have already run locally.
- Preferred landing bar for pushes to `main`: in Default mode, favor `pnpm check` and `pnpm test` near the final rebase/push point when feasible. In fast-commit mode, verify the touched surface locally near landing without insisting every intermediate commit replay the full hook.
- Scoped tests prove the change itself. `pnpm test` remains the default `main` landing bar; scoped tests do not replace full-suite gates by default.
- Hard gate: if the change can affect build output, packaging, lazy-loading/module boundaries, or published surfaces, `pnpm build` MUST be run and MUST pass before pushing `main`.
- Default rule: do not land changes with failing format, lint, type, build, or required test checks when those failures are caused by the change or plausibly related to the touched surface. Fast-commit mode changes how verification is sequenced; it does not lower the requirement to validate and clean up the touched surface before final landing.
- For narrowly scoped changes, if unrelated failures already exist on latest `origin/main`, state that clearly, report the scoped tests you ran, and ask before broadening scope into unrelated fixes or landing despite those failures.
- Do not use scoped tests as permission to ignore plausibly related failures.

## Prompt Cache Stability

- Treat prompt-cache stability as correctness/perf-critical, not cosmetic.
- Any code that assembles model or tool payloads from maps, sets, registries, plugin lists, MCP catalogs, filesystem reads, or network results must make ordering deterministic before building the request.
- Do not rewrite older transcript/history bytes on every turn unless you intentionally want to invalidate the cached prefix. Legacy cleanup, pruning, normalization, and migration logic should preserve recent prompt bytes when possible.
- If truncation or compaction is required, prefer mutating newest or tail content first so the cached prefix stays byte-identical for as long as possible.
- For cache-sensitive changes, require a regression test that proves turn-to-turn prefix stability or deterministic request assembly; helper-local tests alone are not enough.

## Coding Style & Naming Conventions

- Language: TypeScript (ESM). Prefer strict typing; avoid `any`.
- Formatting/linting via Oxlint and Oxfmt.
- Never add `@ts-nocheck` and do not add inline lint suppressions by default. Fix root causes first; only keep a suppression when the code is intentionally correct, the rule cannot express that safely, and the comment explains why.
- Do not disable `no-explicit-any`; prefer real types, `unknown`, or a narrow adapter/helper instead. Update Oxlint/Oxfmt config only when required.
- Prefer `zod` or existing schema helpers at external boundaries such as config, webhook payloads, CLI/JSON output, persisted JSON, and third-party API responses.
- Prefer discriminated unions when parameter shape changes runtime behavior.
- Prefer `Result<T, E>`-style outcomes and closed error-code unions for recoverable runtime decisions.
- Keep human-readable strings for logs, CLI output, and UI; do not use freeform strings as the source of truth for internal branching.
- Avoid `?? 0`, empty-string, empty-object, or magic-string sentinels when they can change runtime meaning silently.
- If introducing a new optional field or nullable semantic in core logic, prefer an explicit union or dedicated type when the value changes behavior.
- New runtime control-flow code should not branch on `error: string` or `reason: string` when a closed code union would be reasonable.
- Dynamic import guardrail: do not mix `await import("x")` and static `import ... from "x"` for the same module in production code paths. If you need lazy loading, create a dedicated `*.runtime.ts` boundary (that re-exports from `x`) and dynamically import that boundary from lazy callers only.
- Dynamic import verification: after refactors that touch lazy-loading/module boundaries, run `pnpm build` and check for `[INEFFECTIVE_DYNAMIC_IMPORT]` warnings before submitting.
- Extension SDK self-import guardrail: inside an extension package, do not import that same extension via `openclaw/plugin-sdk/<extension>` from production files. Route internal imports through a local barrel such as `./api.ts` or `./runtime-api.ts`, and keep the `plugin-sdk/<extension>` path as the external contract only.
- Extension package boundary guardrail: inside a bundled plugin package, do not use relative imports/exports that resolve outside that same package root. If shared code belongs in the plugin SDK, import `openclaw/plugin-sdk/<subpath>` instead of reaching into `src/plugin-sdk/**` or other repo paths via `../`.
- Extension API surface rule: `openclaw/plugin-sdk/<subpath>` is the only public cross-package contract for extension-facing SDK code. If an extension needs a new seam, add a public subpath first; do not reach into `src/plugin-sdk/**` by relative path.
- Never share class behavior via prototype mutation (`applyPrototypeMixins`, `Object.defineProperty` on `.prototype`, or exporting `Class.prototype` for merges). Use explicit inheritance/composition (`A extends B extends C`) or helper composition so TypeScript can typecheck.
- If this pattern is needed, stop and get explicit approval before shipping; default behavior is to split/refactor into an explicit class hierarchy and keep members strongly typed.
- In tests, prefer per-instance stubs over prototype mutation (`SomeClass.prototype.method = ...`) unless a test explicitly documents why prototype-level patching is required.
- Add brief code comments for tricky or non-obvious logic.
- Keep files concise; extract helpers instead of “V2” copies. Use existing patterns for CLI options and dependency injection via `createDefaultDeps`.
- Aim to keep files under ~700 LOC; guideline only (not a hard guardrail). Split/refactor when it improves clarity or testability.
- Naming: use **OpenClaw** for product/app/docs headings; use `openclaw` for CLI command, package/binary, paths, and config keys.
- Written English: use American spelling and grammar in code, comments, docs, and UI strings (e.g. "color" not "colour", "behavior" not "behaviour", "analyze" not "analyse").
=======
- Core stays plugin-agnostic. No bundled ids/defaults/policy in core when manifest/registry/capability contracts work.
- Plugins cross into core only via `openclaw/plugin-sdk/*`, manifest metadata, injected runtime helpers, documented barrels (`api.ts`, `runtime-api.ts`).
- Plugin prod code: no core `src/**`, `src/plugin-sdk-internal/**`, other plugin `src/**`, or relative outside package.
- Core/tests: no deep plugin internals (`extensions/*/src/**`, `onboard.js`). Use public barrels, SDK facade, generic contracts.
- Owner boundary: owner-specific repair/detection/onboarding/auth/defaults/provider behavior lives in owner plugin. Shared/core gets generic seams only.
- Dependency ownership follows runtime ownership: plugin-only deps stay plugin-local; root deps only for core imports or intentionally internalized bundled plugin runtime.
- Internal bundled plugins ship in core dist; bundled-only facade loader ok only for them.
- External official plugins own package/deps and are excluded from core dist; core uses registry-aware `facade-runtime` or generic contracts.
- Externalizing a bundled plugin: update package excludes, official catalogs, docs, tests, and prove core runtime paths resolve installed plugin roots before root-dep removal.
- Runtime reads canonical config only. No silent compat for old/malformed config keys. If a config change invalidates existing files, add a matching `openclaw doctor --fix` migration. Core/auth config repairs live in core doctor; plugin-owned config repairs live in that plugin's doctor contract (`legacyConfigRules` / `normalizeCompatibilityConfig`).
- OpenAI Codex is folded into `openai`. No new/live `openai-codex` provider/plugin/auth/model routes; treat them as legacy input only. Runtime/setup/auth/catalog use `openai` + `openai/*`; doctor/migrations repair stale `openai-codex/*` profiles/metadata.
- Config/env surface bar is high; `openclaw.json` and environment variables are already large. Before adding a config option or env var, first prove existing product behavior, provider selection, defaults, or doctor migration cannot solve it. Prefer removing or consolidating config/env options when touching these surfaces. Core supports only the latest config shape; `openclaw doctor --fix` migrates older shipped shapes into the current one.
- CLI setup flows are public API when external docs, installers, or integrations can copy them. Changes to `openclaw onboard`, `openclaw configure`, their documented flags, non-interactive behavior, or generated config shape are compatibility-sensitive API contract changes; prefer additive flags/aliases, deprecation windows, and backward-preserving migrations over breaking existing snippets.
- Fix shape: default to clean bounded refactor, not smallest patch. Move ownership to right boundary; delete stale abstractions, duplicate policy, dead branches, wrappers, fallback stacks.
- Fix observed local failures with generic product rules; do not hardcode names, ids, log phrases, or user examples in prod code unless they are an explicit contract.
- Tests may use observed examples, but prod literals need a short contract reason.
- Compatibility is opt-in. "Shipped" means reachable from a release Git tag; main/GitHub/PR/unreleased code is not shipped.
- Refactor default: one canonical path. Delete the old path unless user explicitly wants compat or the shipped public contract is obvious and cited.
- Core runtime consumes only current canonical shapes/config/data. Legacy or retired shapes normalize only in doctor/migration code before runtime; no runtime shims, aliases, or fallback readers.
- State/storage migrations are database-first. Runtime reads/writes the canonical store only. Old file stores, sidecars, aliases, and fallback readers belong in `openclaw doctor --fix` migration code only, never steady-state runtime.
- Storage default: SQLite only. Do not add JSON/JSONL/TXT/sidecar files for OpenClaw-owned runtime state, caches, queues, registries, indexes, cursors, checkpoints, or plugin scratch data.
- SQLite runtime access uses Kysely helpers, not raw SQL statement strings, except schema DDL, migrations, low-level DB bootstrap, or narrowly justified SQLite primitives.
- Use the shared state DB (`state/openclaw.sqlite`) for global runtime state and plugin KV data. Use the per-agent DB (`agents/<agentId>/agent/openclaw-agent.sqlite`) for agent-scoped state/cache. Use a dedicated SQLite DB only when schema, volume, or lifecycle clearly does not fit those stores.
- Legacy state/cache files are migration debt. When touching code that reads/writes them, prefer moving the data into SQLite or calling out the refactor follow-up; do not add parallel file paths.
- File storage must be a named product artifact: import/export, user attachment, log, backup, or external tool contract. If it is app state or cache, it belongs in SQLite.
- Before adding any path under state dirs, choose one: shared state DB, plugin KV, agent DB, or dedicated SQLite schema. If none fits, design the SQLite owner/schema first.
- Cache/transient state gets no compat migration unless a shipped user contract is cited. Prefer delete/drop/rebuild over import. If old state can be lost without user-visible data loss, remove the old path entirely.
- Persistent user state gets one migration owner. Doctor migrates, verifies, and then runtime assumes the new shape. No dual-write, read-through fallback, lazy import, or "if SQLite fails use JSON" branches.
- Fallback is a product decision, not an implementation convenience. Before adding one, name the shipped contract, failure mode, removal plan, and why doctor cannot solve it. Otherwise delete it.
- Keep old behavior only for an explicit public API/config/plugin SDK/data contract, tagged upgrade path, security/migration boundary, dependency contract, or observed prod state.
- If unsure, ask before preserving compat. Do not keep aliases, shims, fallback stacks, stale names, or obsolete tests just in case.
- Tests alone do not make internals contracts. If compat stays, name the contract and migration/removal plan in code, test, or PR.
- Lean code is a goal. No internal shims, aliases, legacy names, broad fallbacks, or defensive branches just to reduce diff or handle unrealistic edge cases.
- Handle real production states, tagged upgrade paths, security boundaries, and dependency contracts. Public/hostile/observed malformed input gets care; hypothetical malformed input does not.
- Deprecate shipped public contracts only.
- Plugin SDK exception: shipped external API gets new API first plus named compat/deprecation, small tests/docs if useful, removal plan.
- Migrate internal/bundled callers to modern API in the same change. Do not let internal compat become permanent architecture.
- Channels are implementation under `src/channels/**`; plugin authors get SDK seams. Providers own auth/catalog/runtime hooks; core owns generic loop.
- Message/channel plugins stay transport-only. They render portable presentation/actions, enforce transport limits, and map native callback envelopes. They do not own product command trees, plugin/provider policy, or feature-specific menus.
- Portable command UI must use typed presentation actions, not raw string inference. Do not make channels guess that `value` starting with `/` means a native command; core/owner plugins declare command actions, channels map them when supported.
- Raw callback data is transport/private. Approval, command, URL, web-app, and select actions must stay distinguishable before channel encoding so transport adapters do not special-case product strings.
- Agent run terminal state: normalize/merge via `src/agents/agent-run-terminal-outcome.ts`; do not rederive timeout/cancel precedence in projections.
- Hot paths should carry prepared facts forward: provider id, model ref, channel id, target, capability family, attachment class. Do not rediscover with broad plugin/provider/channel/capability loaders.
- Do not fix repeated request-time discovery with scattered caches. Move the canonical fact earlier; reuse prepared runtime objects; delete duplicate lookup branches.
- Gateway/plugin metadata is process-stable: installs, manifests, catalogs, generated paths, bundled metadata. Changes require restart or explicit owner reload/install/doctor flow.
- Runtime hot paths: no freshness polling (`stat`/`realpath`/JSON reread/hash). Reuse current snapshots, install records, discovery, lookup tables, root scopes, resolved paths.
- Process-local metadata caches ok when lifecycle-owned and bounded/single-slot. Freshness exceptions need named owner + tests.
- Inline comments: preserve reviewer context at the code site. Required for non-obvious cross-path/state invariants, lifecycle ordering, ownership boundaries, queue/dedupe symmetry, TTL/cache expiry, cleanup/release coupling, session/id adoption, fallback behavior, platform/dependency caps, deterministic ordering, compact encoded state, or intentional caller differences.
- Comment shape: 1-3 short lines; state why the branch/helper exists, what contract it protects, and the bad outcome if removed. Cite nearby constants/helpers when useful. No syntax narration, PR/user-specific lore, or obvious mechanics.
- Gateway protocol changes: additive first; incompatible needs versioning/docs/client follow-through.
- Protocol version bumps: explicit owner confirmation only; never automatic/generated.
- Config contract: exported types, schema/help, metadata, baselines, docs aligned. Retired public keys stay retired; compat in raw migration/doctor only.
- Prompt cache: deterministic ordering for maps/sets/registries/plugin lists/files/network results before model/tool payloads. Preserve old transcript bytes when possible.
- Agent tool schema cleanup: remove stale args cleanly; no hidden compat for model-facing params just to avoid churn.

## Commands

- Runtime: Node 22.19+; Node 24 recommended. Keep Node + Bun paths working.
- Package manager/runtime: repo defaults only. No swaps without approval.
- Install: `pnpm install` (keep Bun lock/patches aligned if touched).
- CLI: `pnpm openclaw ...` or `pnpm dev`; build: `pnpm build`.
- Tests in a normal source checkout: `pnpm test <path-or-filter> [vitest args...]`, `pnpm test:changed`, `pnpm test:serial`, `pnpm test:coverage`; never raw `vitest`.
- If raw Vitest is unavoidable, use `vitest run ...`; bare `vitest ...` starts local watch mode and will not exit on its own.
- Tests in a Codex worktree or linked/sparse checkout: avoid direct local `pnpm test*`; use `node scripts/run-vitest.mjs <path-or-filter>` for tiny explicit-file proof, or Crabbox/Testbox for anything broader.
- Checks in a normal source checkout: `pnpm check:changed` delegates to Crabbox/Testbox; lanes: `pnpm changed:lanes --json`; staged: `pnpm check:changed --staged`; full: `pnpm check`.
- Checks in a Codex worktree or linked/sparse checkout: avoid direct local `pnpm check*`; use `node scripts/crabbox-wrapper.mjs run ... -- env OPENCLAW_CHECK_CHANGED_REMOTE_CHILD=1 OPENCLAW_CHANGED_LANES_RAW_SYNC=1 corepack pnpm check:changed` so pnpm runs inside Testbox, not locally.
- Extension tests: `pnpm test:extensions`, `pnpm test extensions`, `pnpm test extensions/<id>`.
- Typecheck: `tsgo` lanes only (`pnpm tsgo*`, `pnpm check:test-types`); never add `tsc --noEmit`, `typecheck`, `check:types`.
- Formatting: `oxfmt`, not Prettier. Use repo wrappers (`pnpm format:*`, `pnpm lint:*`, `scripts/run-oxlint.mjs`).
- Build before push when build output, packaging, lazy/module boundaries, dynamic imports, or published surfaces can change.
>>>>>>> upstream/main

## Validation

- Use `$openclaw-testing` for test/CI choice and `$crabbox` for remote/full/E2E proof.
- Crabbox request means real scenario proof: install/update/call/repro user path; not just copy tests and run them remotely.
- Visual proof: use Crabbox, set up like a user, then screenshot-verify. No harness/bypass/shortcut unless explicitly asked.
- Small/narrow tests, lints, format checks, and type probes are fine locally only in a healthy normal checkout.
- In Codex worktrees, direct local `pnpm test*`, `pnpm check*`, `pnpm crabbox:run`, and `scripts/committer` can trigger pnpm dependency reconciliation or install prompts. Prefer `node` wrappers locally and Crabbox/Testbox for pnpm-gated proof.
- Full suites, broad changed gates, Docker/package/E2E/live/cross-OS proof, or anything that bogs down the Mac: Crabbox/Testbox.
- One/few files local. If a local command fans out, stop and move broad proof to Crabbox/Testbox.
- Before handoff/push: prove touched surface. Before landing to `main`: issue proof plus appropriate full/broad proof unless scope is clearly narrow.
- Pre-land/pre-commit code changes: mandatory fresh `$autoreview` until no accepted/actionable findings remain. Do not land code on CI, ClawSweeper, prior review comments, or your own manual review alone unless user explicitly opts out or scope is truly trivial/docs-only. If findings want refactor, refactor; no ugly fixes.
- If proof is blocked, say exactly what is missing and why.
- Do not land related failing format/lint/type/build/tests. If unrelated on latest `origin/main`, say so with scoped proof.
- Docs/changelog-only and CI/workflow metadata-only: `git diff --check` plus relevant docs/workflow sanity; escalate only if scripts/config/generated/package/runtime behavior changed.
- Prompt snapshots: CI truth is Linux Node 24. If macOS local passes but CI drifts, reproduce/generate in Linux before rerun.

## GitHub / PRs

<<<<<<< HEAD
- Framework: Vitest with V8 coverage thresholds (70% lines/branches/functions/statements).
- Naming: match source names with `*.test.ts`; e2e in `*.e2e.test.ts`.
- When tests need example Anthropic/OpenAI model constants, prefer `sonnet-4.6` and `gpt-5.4`; update older Anthropic/GPT examples when you touch those tests.
- Run `pnpm test` (or `pnpm test:coverage`) before pushing when you touch logic.
- Write tests to clean up timers, env, globals, mocks, sockets, temp dirs, and module state so `--isolate=false` stays green.
- Test performance guardrail: do not put `vi.resetModules()` plus `await import(...)` in `beforeEach`/per-test loops for heavy modules unless module state truly requires it. Prefer static imports or one-time `beforeAll` imports, then reset mocks/runtime state directly.
- Test performance guardrail: if a test file uses stable `vi.mock(...)` hoists or other static module mocks, do not pair them with `vi.resetModules()` and a fresh `await import(...)` in every `beforeEach`. Import the heavy module once in `beforeAll`, then reset/prime mocks in `beforeEach` so Browser/Matrix-style hotspot tests do not pay the module graph cost per case.
- Test performance guardrail: inside an extension package, prefer a thin local seam (`./api.ts`, `./runtime-api.ts`, or a narrower local `*.runtime-api.ts`) over direct `openclaw/plugin-sdk/*` imports for internal production code. Keep local seams curated and lightweight; only reach for direct `plugin-sdk/*` imports when you are crossing a real package boundary or when no suitable local seam exists yet.
- Test performance guardrail: keep expensive runtime fallback work such as snapshotting, migration, installs, or bootstrap behind dedicated `*.runtime.ts` boundaries so tests can mock the seam instead of accidentally invoking real work.
- Test performance guardrail: for import-only/runtime-wrapper tests, keep the wrapper lazy. Do not eagerly load heavy verification/bootstrap/runtime modules at module top level if the exported function can import them on demand.
- Test performance guardrail: prefer explicit mock factories over `importOriginal()` for broad modules. Reserve `importOriginal()` for narrow modules where partial-real behavior is genuinely needed.
- Test performance guardrail: do not partial-mock broad `openclaw/plugin-sdk/*` barrels in hot tests. Add a plugin-local `*.runtime.ts` seam and mock that seam instead.
- Test performance guardrail: when production code already accepts `deps`, callbacks, or runtime injection, use that seam in tests before adding module-level mocks.
- Test performance guardrail: prefer narrow public SDK subpaths such as `models-provider-runtime`, `skill-commands-runtime`, and `reply-dispatch-runtime` over older broad helper barrels when both expose the needed helper.
- Test performance guardrail: treat import-dominated test time as a boundary bug. Refactor the import surface before adding more cases to the slow file.
- Agents MUST NOT modify baseline, inventory, ignore, snapshot, or expected-failure files to silence failing checks without explicit approval in this chat.
- For targeted/local debugging, use the native root-project entrypoint: `pnpm test <path-or-filter> [vitest args...]` (for example `pnpm test src/commands/onboard-search.test.ts -t "shows registered plugin providers"`); do not default to raw `pnpm vitest run ...` because it bypasses the repo's default config/profile/pool routing.
- Do not set test workers above 16; tried already.
- Vitest now defaults to native root-project `threads`, with hard `forks` exceptions for `gateway`, `agents`, and `commands`. Keep new pool changes explicit and justified; use `OPENCLAW_VITEST_POOL=forks` for full local fork debugging.
- If local Vitest runs cause memory pressure, the default worker budget now derives from host capabilities (CPU, memory band, current load). For a conservative explicit override during land/gate runs, use `OPENCLAW_VITEST_MAX_WORKERS=1 pnpm test`.
- Live tests (real keys): `OPENCLAW_LIVE_TEST=1 pnpm test:live` (OpenClaw-only) or `LIVE=1 pnpm test:live` (includes provider live tests). Docker: `pnpm test:docker:live-models`, `pnpm test:docker:live-gateway`. Onboarding Docker E2E: `pnpm test:docker:onboard`.
- `pnpm test:live` defaults quiet now. Keep `[live]` progress; suppress profile/gateway chatter. Full logs: `OPENCLAW_LIVE_TEST_QUIET=0 pnpm test:live`.
- Full kit + what’s covered: `docs/help/testing.md`.
- Changelog: user-facing changes only; no internal/meta notes (version alignment, appcast reminders, release process).
- Changelog placement: in the active version block, append new entries to the end of the target section (`### Changes` or `### Fixes`); do not insert new entries at the top of a section.
- Changelog attribution: use at most one contributor mention per line; prefer `Thanks @author` and do not also add `by @author` on the same entry.
- Pure test additions/fixes generally do **not** need a changelog entry unless they alter user-facing behavior or the user asks for one.
- Mobile: before using a simulator, check for connected real devices (iOS + Android) and prefer them when available.
=======
- Use `$openclaw-pr-maintainer` immediately for maintainer-side OpenClaw issue/PR review, triage, duplicates, labels, comments, close, land, or evidence. Contributor PR creation/refresh follows the requested contributor workflow; linked refs alone do not require maintainer archive tooling.
- Issue/PR start: `git status -sb`; if clean, `git pull --ff-only`; if dirty, yell before pull/rebase.
- PR refs: `gh pr view/diff` or `gh api`, not web search. Prefer `gitcrawl` for maintainer discovery; missing/stale `gitcrawl` falls through to live `gh`, not contributor setup. Verify live with `gh` before mutation.
- Bare issue/PR URL/number: inspect live and take the efficient maintainer path; switch branches/refs when useful.
- No unsolicited PR labels/retitles/rebases/fixups/landing. Comments/reviews ok only for reviewable findings, pre-merge proof, or close/duplicate reason after explicit close/sweep/landing request.
- Maintainer decision closes the cluster: if deciding reported behavior/proposed fix is not planned, comment+close all directly associated open issues/PRs unless explicitly told to keep one open. Associated means linked PRs/issues, duplicates, companion workaround PRs, and the canonical issue for the rejected behavior.
- Do not leave associated issues open for hypothetical future repros. Close with rationale; ask for a new issue or reopen only if concrete new evidence appears. Close comment states: decision, why, supported alternative, and what evidence would change the decision.
- Issue/PR work: search strong related issues/PRs before final; close proven dupes/fixed siblings. If none close, suggest one next related follow-up.
- PR superseded by `main`: if code proof shows `main` already has same-or-better behavior, comment canonical commit/PR + focused proof, then close. Bar high: inspect PR diff, current code/tests, linked issue, caller/sibling path. If unsure, leave open.
- Issue/PR numbers need a short summary every time; assume the reader has not opened or read them.
- Before presenting a batch of issues/PRs, use smart subagents to verify live state and current `main`; omit closed/fixed items, and comment+close items already fixed on `main` when maintainer action is authorized.
- PR review answer: bug/behavior, URL(s), affected surface, provenance for regressions when traceable, best-fix judgment, evidence from code/tests/CI/current or shipped behavior.
- PR reviewable findings: post them on the PR, not chat-only, so author sees actionable feedback.
- Issue/PR final answer: last line is the full GitHub URL.
- PR verification: before merge, post land-ready work done, exact local commands, CI/Testbox run IDs, before/after proof when used, and known proof gaps.
- Issue fixed on `main` with proof: comment proof + commit/PR, then close.
- After landing or requested close/sweep: search duplicates; comment proof + canonical commit/PR/release before closing.
- After landing/ship final: include 2-5 sentence recap of what landed: behavior change, key files/surface, proof run, issue/PR state. Do not answer with only status/links.
- `ship` that fixes an issue: after push, comment proof + commit link, then close the issue.
- Public GH comments: show draft in chat first unless user explicitly asked to post/comment/reply/close/merge/land. After work starts and changes/proof exist, post the review/proof/commit comment.
- Representing user: if user already has a comment/thread for the point, update/reply there when possible; avoid duplicate PR/issue comments.
- No surprise GH writes: chat must mention every posted/updated public comment with URL.
- GH comments with backticks, `$`, or shell snippets: use heredoc/body file, not inline double-quoted `--body`.
- PR create: real body required. Include Summary + Verification; mention refs, behavior, and proof.
- PR create/refresh: keep PR branches takeover-ready. Use a branch maintainers can push to, or for fork PRs ensure `maintainer_can_modify` / GitHub's `Allow edits by maintainers` is enabled unless explicitly told otherwise or GitHub's Actions/secrets warning makes that unsafe.
- GitHub issue/PR create: read `$agent-transcript`; ask about sanitized transcript logs when available.
- Contributor PRs: parsed `Real behavior proof` uses exact `field: value` labels: `Behavior addressed`, `Real environment tested`, `Exact steps or command run after this patch`, `Evidence after fix`, `Observed result after fix`, `What was not tested`.
- PR artifacts/screenshots: attach to PR/comment/external artifact store. Never push screenshots, videos, proof images, or proof assets to OpenClaw or any product repo branch, including temp artifact branches. Use Crabbox artifact publishing plus the manifest URL. Do not commit `.github/pr-assets`.
- CI polling: exact SHA, relevant checks only, minimal fields. Skip routine noise (`Auto response`, `Labeler`, docs agents, performance/stale). Logs only after failure/completion or concrete need.
- OpenClaw write-access maintainers may skip `Real behavior proof` when local tests or Crabbox verified behavior; record proof in PR verification.
- `/landpr`: use `~/.codex/prompts/landpr.md`; do not idle on `auto-response` or `check-docs`.
>>>>>>> upstream/main

## Code

- TS ESM, strict. Avoid `any`; prefer real types, `unknown`, narrow adapters.
- No `@ts-nocheck`. Lint suppressions only intentional + explained.
- External boundaries: prefer `zod` or existing schema helpers.
- Runtime branching: discriminated unions/closed codes over freeform strings. Avoid semantic sentinels (`?? 0`, empty object/string).
- Cross-function state: when valid combos matter, return a closed mode/result shape. Avoid parallel nullable fields or derived booleans that callers must keep in sync; make impossible states unrepresentable.
- Formatter-friendly shape: when oxfmt explodes an expression vertically, extract named booleans, payloads, or small helpers. Do not change width or use format-ignore for local compactness.
- Calls should be boring: complex decisions happen above; call args/object fields are names, literals, or simple property reads.
- Prefer early returns over nested condition pyramids. Split code into gather -> normalize -> decide -> act.
- Use named intermediates only for domain meaning or readability; avoid temp-variable soup.
- Code size matters. Prefer small clear code; maintainability includes not growing LOC without payoff.
- Refactors should delete about as much local complexity as they add. If LOC grows, the new ownership/API needs to clearly pay for it.
- Refactors should reduce non-test LOC unless they remove a larger architectural cost. Treat positive prod LOC as a smell. Before closeout, run `git diff --numstat`; if non-test LOC grew, trim or explicitly justify why fewer paths now exist.
- Prefer deleting branches, modes, adapters, and tests over preserving them. A refactor that adds a second path has probably failed unless the old path is a cited shipped contract.
- New helpers/files must pay rent immediately: fewer call paths, fewer concepts, or less repeated logic. No helpers for one-off compat, naming translation, or speculative resilience.
- Before adding helpers/files, check whether existing code can absorb the behavior with less new surface.
- Keep APIs narrow: export only current caller needs; keep types/helpers local by default.
- Return the smallest useful shape. Avoid broad result objects, flags, metadata unless callers use them.
- Avoid adapter layers that only rename fields. Move real responsibility or leave code local.
- Inline simple one-use objects/spreads when clearer. Extract only when it removes duplication or hard logic.
- Tests prove behavior/regressions, not every internal branch.
- Tests are welcome, but review them before landing for duplication and value. Delete useless tests, such as assertions for behavior or paths just removed.
- Tests protect canonical behavior and migration boundaries, not obsolete internals. Delete tests for removed fallback paths instead of updating them.
- For non-trivial refactors, check `git diff --numstat` before closeout. If LOC grew, trim or explain why.
- Prefer existing narrow helpers over repeated casts/guards. Add local helpers when 2+ nearby call sites share real boundary logic.
- Prefer ctor parameter properties for injected deps/config. Do not ban them for erasable-syntax purity.
- Prefer `satisfies` for registries/config maps; derive types from schemas when a runtime schema already exists.
- Table-drive repetitive tests when it reduces code and keeps failure names clear.
- Dynamic import: no static+dynamic import for same prod module. Use `*.runtime.ts` lazy boundary. After edits: `pnpm build`; check `[INEFFECTIVE_DYNAMIC_IMPORT]`.
- Cycles: keep `pnpm check:import-cycles` + architecture/madge green.
- Classes: no prototype mixins/mutations. Prefer inheritance/composition. Tests prefer per-instance stubs.
- Split files around ~700 LOC when clarity/testability improves.
- Naming: **OpenClaw** product/docs; `openclaw` CLI/package/path/config.
- English: American spelling.

## Tests

- Vitest. Colocated `*.test.ts`; e2e `*.e2e.test.ts`; example models `sonnet-4.6`, `gpt-5.5`; test GPT with 5.5 preferred, 5.4 ok; no GPT-4.x agent-smoke defaults.
- Prefer behavior tests over workflow/docs string greps. Put operator policy reminders in AGENTS/docs.
- Clean timers/env/globals/mocks/sockets/temp dirs/module state; `--isolate=false` safe.
- Prefer injection and narrow `*.runtime.ts` mocks over broad barrels or `openclaw/plugin-sdk/*`.
- Do not edit baseline/inventory/ignore/snapshot/expected-failure files to silence checks without explicit approval.
- Do not run independent `pnpm test`/Vitest commands concurrently in one worktree; Vitest cache races with `ENOTEMPTY`. Group one command or use distinct `OPENCLAW_VITEST_FS_MODULE_CACHE_PATH`.
- Test workers max 16. Memory pressure: `OPENCLAW_VITEST_MAX_WORKERS=1 pnpm test`.
- Live: `OPENCLAW_LIVE_TEST=1 pnpm test:live`; verbose `OPENCLAW_LIVE_TEST_QUIET=0`.
- Guide: `docs/reference/test.md`.

## Docs / Changelog

- Use `$technical-documentation` for docs writing/review. Docs change with behavior/API.
- Codex harness upgrade (`extensions/codex/package.json` `@openai/codex`): refresh `docs/plugins/codex-harness.md` model snapshot from the new harness `model/list`.
- Docs final answers: include relevant full `https://docs.openclaw.ai/...` URL(s). If issue/PR work too, GitHub URL last.
- `CHANGELOG.md`: release-only. Do not edit for normal PRs, direct `main` fixes, or `ship it`; release generation owns it. Do not ask contributors/agents for changelog edits.
- User-facing `fix`/`feat`/`perf`: put release-note context in PR body, squash message, or direct commit: behavior, surface, issue/PR refs, credited human author/reporter.
- Release generation: derive `CHANGELOG.md` from merged PRs + all direct `main` commits. Entries: active `### Changes`/`### Fixes`, single-line, thank credited humans; never thank bots/forbidden handles: `@openclaw`, `@clawsweeper`, `@codex`, `@steipete`.

## Git

- Commit via `scripts/committer "<msg>" <file...>`; stage intended files only.
- Commits: conventional-ish, concise, grouped.
- No manual stash/autostash unless explicit. Branch switches ok when useful; no new worktrees unless requested.
- `main`: no merge commits; rebase on latest `origin/main` before push. After one green run plus clean rebase sanity, do not chase moving `main` with repeated full gates.
- User says `commit`: your changes only. `commit all`: all changes in grouped chunks. `push`: may `git pull --rebase` first.
- User says `ship it`: commit intended changes, pull --rebase, push.
- Do not delete/rename unexpected files; ask if blocking, else ignore.
- Bulk PR close/reopen >50: ask with count/scope.

<<<<<<< HEAD
- Vocabulary: "makeup" = "mac app".
- Rebrand/migration issues or legacy config/service warnings: run `openclaw doctor` (see `docs/gateway/doctor.md`).
- Use `$openclaw-parallels-smoke` at `.agents/skills/openclaw-parallels-smoke/SKILL.md` for Parallels smoke, rerun, upgrade, debug, and result-interpretation workflows across macOS, Windows, and Linux guests.
- For the macOS Discord roundtrip deep dive, use the narrower `.agents/skills/parallels-discord-roundtrip/SKILL.md` companion skill.
- Never edit `node_modules` (global/Homebrew/npm/git installs too). Updates overwrite. Skill notes go in `tools.md` or `AGENTS.md`.
- If you need local-only `.agents` ignores, use `.git/info/exclude` instead of repo `.gitignore`.
- When adding a new `AGENTS.md` anywhere in the repo, also add a `CLAUDE.md` symlink pointing to it (example: `ln -s AGENTS.md CLAUDE.md`).
- Signal: "update fly" => `fly ssh console -a flawd-bot -C "bash -lc 'cd /data/clawd/openclaw && git pull --rebase origin main'"` then `fly machines restart e825232f34d058 -a flawd-bot`.
- CLI progress: use `src/cli/progress.ts` (`osc-progress` + `@clack/prompts` spinner); don’t hand-roll spinners/bars.
- Status output: keep tables + ANSI-safe wrapping (`src/terminal/table.ts`); `status --all` = read-only/pasteable, `status --deep` = probes.
- Gateway currently runs only as the menubar app; there is no separate LaunchAgent/helper label installed. Restart via the OpenClaw Mac app or `scripts/restart-mac.sh`; to verify/kill use `launchctl print gui/$UID | grep openclaw` rather than assuming a fixed label. **When debugging on macOS, start/stop the gateway via the app, not ad-hoc tmux sessions; kill any temporary tunnels before handoff.**
- macOS logs: use `./scripts/clawlog.sh` to query unified logs for the OpenClaw subsystem; it supports follow/tail/category filters and expects passwordless sudo for `/usr/bin/log`.
- If shared guardrails are available locally, review them; otherwise follow this repo's guidance.
- SwiftUI state management (iOS/macOS): prefer the `Observation` framework (`@Observable`, `@Bindable`) over `ObservableObject`/`@StateObject`; don’t introduce new `ObservableObject` unless required for compatibility, and migrate existing usages when touching related code.
- Connection providers: when adding a new connection, update every UI surface and docs (macOS app, web UI, mobile if applicable, onboarding/overview docs) and add matching status + configuration forms so provider lists and settings stay in sync.
- Version locations: `package.json` (CLI), `apps/android/app/build.gradle.kts` (versionName/versionCode), `apps/ios/Sources/Info.plist` + `apps/ios/Tests/Info.plist` (CFBundleShortVersionString/CFBundleVersion), `apps/macos/Sources/OpenClaw/Resources/Info.plist` (CFBundleShortVersionString/CFBundleVersion), `docs/install/updating.md` (pinned npm version), and Peekaboo Xcode projects/Info.plists (MARKETING_VERSION/CURRENT_PROJECT_VERSION).
- "Bump version everywhere" means all version locations above **except** `appcast.xml` (only touch appcast when cutting a new macOS Sparkle release).
- **Restart apps:** “restart iOS/Android apps” means rebuild (recompile/install) and relaunch, not just kill/launch.
- **Device checks:** before testing, verify connected real devices (iOS/Android) before reaching for simulators/emulators.
- Mobile pairing: `ws://` (cleartext) is allowed for private LAN addresses (RFC 1918, link-local, mDNS `.local`) and loopback. Private LAN hosts typically lack PKI-backed identity, so requiring TLS there adds complexity without meaningful security gain. `wss://` is required for Tailscale and public endpoints.
- Security report scope: reports that treat cleartext `ws://` mobile pairing over private LAN as a vulnerability are out of scope unless they demonstrate a trust-boundary bypass beyond passive network observation on the same LAN.
- iOS Team ID lookup: `security find-identity -p codesigning -v` → use Apple Development (…) TEAMID. Fallback: `defaults read com.apple.dt.Xcode IDEProvisioningTeamIdentifiers`.
- A2UI bundle hash: `src/canvas-host/a2ui/.bundle.hash` is auto-generated; ignore unexpected changes, and only regenerate via `pnpm canvas:a2ui:bundle` (or `scripts/bundle-a2ui.sh`) when needed. Commit the hash as a separate commit.
- Release signing/notary credentials are managed outside the repo; maintainers keep that setup in the private [maintainer release docs](https://github.com/openclaw/maintainers/tree/main/release).
- Lobster palette: use the shared CLI palette in `src/terminal/palette.ts` (no hardcoded colors); apply palette to onboarding/config prompts and other TTY UI output as needed.
- When asked to open a “session” file, open the Pi session logs under `~/.openclaw/agents/<agentId>/sessions/*.jsonl` (use the `agent=<id>` value in the Runtime line of the system prompt; newest unless a specific ID is given), not the default `sessions.json`. If logs are needed from another machine, SSH via Tailscale and read the same path there.
- Do not rebuild the macOS app over SSH; rebuilds must be run directly on the Mac.
- Voice wake forwarding tips:
  - Command template should stay `openclaw-mac agent --message "${text}" --thinking low`; `VoiceWakeForwarder` already shell-escapes `${text}`. Don’t add extra quotes.
  - launchd PATH is minimal; ensure the app’s launch agent PATH includes standard system paths plus your pnpm bin (typically `$HOME/Library/pnpm`) so `pnpm`/`openclaw` binaries resolve when invoked via `openclaw-mac`.
=======
## Security / Release
>>>>>>> upstream/main

- Never commit real phone numbers, videos, credentials, live config.
- Secrets: channel/provider creds in `~/.openclaw/credentials/`; model auth profiles in `~/.openclaw/agents/<agentId>/agent/auth-profiles.json`.
- Dependency patches/overrides/vendor changes need explicit approval. `pnpm-workspace.yaml` patched dependencies use exact versions only.
- Release/package guards: no hard-coded retired-package denylists; use generic artifact/dependency checks or fix build source.
- Lockfiles/shrinkwrap are security surface: review `pnpm-lock.yaml`, `npm-shrinkwrap.json`, `package-lock.json`; root/plugin npm packages ship shrinkwrap, not package-lock.
- Carbon pins owner-only: do not change `@buape/carbon` unless Shadow (`@thewilloftheshadow`, verified by `gh`) asks.
- Releases/publish/version bumps need explicit approval. Use `$release-openclaw-maintainer`.
- Backport means apply to newest open `release/` branch unless user names another target.
- GHSA/advisories: `$openclaw-ghsa-maintainer` / `$security-triage`. Secret scanning: `$openclaw-secret-scanning-maintainer`.
- Beta tag/version match: `vYYYY.M.D-beta.N` -> npm `YYYY.M.D-beta.N --tag beta`.

<<<<<<< HEAD
- When working on a GitHub Issue or PR, print the full URL at the end of the task.
- When answering questions, respond with high-confidence answers only: verify in code; do not guess.
- Never update the Carbon dependency.
- Any dependency with `pnpm.patchedDependencies` must use an exact version (no `^`/`~`).
- Patching dependencies (pnpm patches, overrides, or vendored changes) requires explicit approval; do not do this by default.
- **Multi-agent safety:** do **not** create/apply/drop `git stash` entries unless explicitly requested (this includes `git pull --rebase --autostash`). Assume other agents may be working; keep unrelated WIP untouched and avoid cross-cutting state changes.
- **Multi-agent safety:** when the user says "push", you may `git pull --rebase` to integrate latest changes (never discard other agents' work). When the user says "commit", scope to your changes only. When the user says "commit all", commit everything in grouped chunks.
- **Multi-agent safety:** prefer grouped `commit` / `pull --rebase` / `push` cycles for related work instead of many tiny syncs.
- **Multi-agent safety:** do **not** create/remove/modify `git worktree` checkouts (or edit `.worktrees/*`) unless explicitly requested.
- **Multi-agent safety:** do **not** switch branches / check out a different branch unless explicitly requested.
- **Multi-agent safety:** running multiple agents is OK as long as each agent has its own session.
- **Multi-agent safety:** when you see unrecognized files, keep going; focus on your changes and commit only those.
- Lint/format churn:
  - If staged+unstaged diffs are formatting-only, auto-resolve without asking.
  - If commit/push already requested, auto-stage and include formatting-only follow-ups in the same commit (or a tiny follow-up commit if needed), no extra confirmation.
  - Only ask when changes are semantic (logic/data/behavior).
- **Multi-agent safety:** focus reports on your edits; avoid guard-rail disclaimers unless truly blocked; when multiple agents touch the same file, continue if safe; end with a brief “other files present” note only if relevant.
- Bug investigations: read source code of relevant npm dependencies and all related local code before concluding; aim for high-confidence root cause.
- Code style: add brief comments for tricky logic; keep files under ~500 LOC when feasible (split/refactor as needed).
- Tool schema guardrails (google-antigravity): avoid `Type.Union` in tool input schemas; no `anyOf`/`oneOf`/`allOf`. Use `stringEnum`/`optionalStringEnum` (Type.Unsafe enum) for string lists, and `Type.Optional(...)` instead of `... | null`. Keep top-level tool schema as `type: "object"` with `properties`.
- Tool schema guardrails: avoid raw `format` property names in tool schemas; some validators treat `format` as a reserved keyword and reject the schema.
- Never send streaming/partial replies to external messaging surfaces (WhatsApp, Telegram); only final replies should be delivered there. Streaming/tool events may still go to internal UIs/control channel.
- For manual `openclaw message send` messages that include `!`, use the heredoc pattern noted below to avoid the Bash tool’s escaping.
- Release guardrails: do not change version numbers without operator’s explicit consent; always ask permission before running any npm publish/release step.
- Beta release guardrail: when using a beta Git tag (for example `vYYYY.M.D-beta.N`), publish npm with a matching beta version suffix (for example `YYYY.M.D-beta.N`) rather than a plain version on `--tag beta`; otherwise the plain version name gets consumed/blocked.
=======
## Platform / Ops

- Before simulator/emulator testing, check real iOS/Android devices.
- "restart iOS/Android apps" = rebuild/reinstall/relaunch, not kill/launch.
- SwiftUI: Observation (`@Observable`, `@Bindable`) over new `ObservableObject`.
- Mac gateway: dev watch = `pnpm gateway:watch`; managed installs = `openclaw gateway restart/status --deep`; logs = `./scripts/clawlog.sh`. No launchd/ad-hoc tmux.
- Mac app permission testing: stable app path + real signing identity required. No `--no-sign`, `SIGN_IDENTITY=-`, or raw debug binary; TCC prompts/listing won't stick.
- Version bump surfaces live in `$release-openclaw-maintainer`.
- Parallels: `$openclaw-parallels-smoke`; Discord roundtrip: `$parallels-discord-roundtrip`.
- Crabbox/WebVNC human demos: keep remote desktop visible/windowed; no fullscreen remote browser unless video/capture-style output.
- Before sharing WebVNC links, use Crabbox screenshot first; verify real app/path works and target UI is not broken.
- ClawSweeper ops: `$clawsweeper`. Deployed hook sessions may post one concise `#clawsweeper` note only when surprising/actionable/risky; if using message tool, reply exactly `NO_REPLY`.
- Generated-media completions wake the requester agent first. Requester visible-reply config decides final text vs message tool; direct media send is fallback/recovery only.
- `message_tool_only`: normal agent final visible reply = current-source `message(action=send)` only. No `NO_REPLY` prompt/contract; no message call = no source reply. Plugin-owned bound-thread reply = plugin return value; no message tool needed. Never auto-publish private final.
- Memory wiki prompt digest stays tiny; prefer `wiki_search` / `wiki_get`; verify contact data before use; source-class provenance for generated people facts.
- Rebrand/migration/config warnings: run `openclaw doctor`.
- Never edit `node_modules`.
- Local-only `.agents` ignores: `.git/info/exclude`, not repo `.gitignore`.
- Provider tool schemas: prefer flat string enum helpers over `Type.Union([Type.Literal(...)])`; some providers reject `anyOf`.
- External messaging: no token-delta channel messages. Follow `docs/concepts/streaming.md`.
>>>>>>> upstream/main
