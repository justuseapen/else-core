<<<<<<< HEAD
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
=======
// Lobster plugin module implements lobster runner behavior.
import { readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
>>>>>>> upstream/main
import { createRequire } from "node:module";
import path from "node:path";
import { Readable, Writable } from "node:stream";
import { pathToFileURL } from "node:url";
<<<<<<< HEAD
=======
import { installLobsterAjvCompileCache } from "./lobster-ajv-cache.js";
>>>>>>> upstream/main

export type LobsterEnvelope =
  | {
      ok: true;
      status: "ok" | "needs_approval" | "cancelled";
      output: unknown[];
      requiresApproval: null | {
        type: "approval_request";
        prompt: string;
        items: unknown[];
        resumeToken?: string;
<<<<<<< HEAD
=======
        approvalId?: string;
>>>>>>> upstream/main
      };
    }
  | {
      ok: false;
      error: { type?: string; message: string };
    };

export type LobsterRunnerParams = {
  action: "run" | "resume";
  pipeline?: string;
  argsJson?: string;
  token?: string;
<<<<<<< HEAD
=======
  approvalId?: string;
>>>>>>> upstream/main
  approve?: boolean;
  cwd: string;
  timeoutMs: number;
  maxStdoutBytes: number;
};

export type LobsterRunner = {
  run: (params: LobsterRunnerParams) => Promise<LobsterEnvelope>;
};

type EmbeddedToolContext = {
  cwd?: string;
  env?: Record<string, string | undefined>;
  mode?: "tool" | "human" | "sdk";
  stdin?: NodeJS.ReadableStream;
  stdout?: NodeJS.WritableStream;
  stderr?: NodeJS.WritableStream;
  signal?: AbortSignal;
  registry?: unknown;
  llmAdapters?: Record<string, unknown>;
};

type EmbeddedToolEnvelope = {
  protocolVersion?: number;
  ok: boolean;
<<<<<<< HEAD
  status?: "ok" | "needs_approval" | "cancelled";
=======
  status?: "ok" | "needs_approval" | "needs_input" | "cancelled";
>>>>>>> upstream/main
  output?: unknown[];
  requiresApproval?: {
    type?: "approval_request";
    prompt: string;
    items: unknown[];
    preview?: string;
    resumeToken?: string;
<<<<<<< HEAD
=======
    approvalId?: string;
  } | null;
  requiresInput?: {
    prompt: string;
    schema?: unknown;
    items?: unknown[];
    resumeToken?: string;
    approvalId?: string;
>>>>>>> upstream/main
  } | null;
  error?: {
    type?: string;
    message: string;
  };
};

type EmbeddedToolRuntime = {
  runToolRequest: (params: {
    pipeline?: string;
    filePath?: string;
    args?: Record<string, unknown>;
    ctx?: EmbeddedToolContext;
  }) => Promise<EmbeddedToolEnvelope>;
  resumeToolRequest: (params: {
<<<<<<< HEAD
    token: string;
    approved: boolean;
=======
    token?: string;
    approvalId?: string;
    approved?: boolean;
    response?: unknown;
    cancel?: boolean;
>>>>>>> upstream/main
    ctx?: EmbeddedToolContext;
  }) => Promise<EmbeddedToolEnvelope>;
};

<<<<<<< HEAD
type ToolRuntimeDeps = {
  createDefaultRegistry: () => unknown;
  parsePipeline: (pipeline: string) => Array<{
    name: string;
    args: Record<string, unknown>;
    raw: string;
  }>;
  decodeResumeToken: (token: string) => {
    kind?: string;
    stateKey?: string;
    filePath?: string;
  };
  encodeToken: (payload: Record<string, unknown>) => string;
  runPipeline: (params: {
    pipeline: Array<{ name: string; args: Record<string, unknown>; raw: string }>;
    registry: unknown;
    input: AsyncIterable<unknown> | unknown[];
    stdin: NodeJS.ReadableStream;
    stdout: NodeJS.WritableStream;
    stderr: NodeJS.WritableStream;
    env: Record<string, string | undefined>;
    mode: "tool";
    cwd: string;
    llmAdapters?: Record<string, unknown>;
    signal?: AbortSignal;
  }) => Promise<{
    items: unknown[];
    halted?: boolean;
    haltedAt?: { index?: number };
  }>;
  runWorkflowFile: (params: {
    filePath: string;
    args?: Record<string, unknown>;
    ctx: EmbeddedToolContext;
    resume?: Record<string, unknown>;
    approved?: boolean;
  }) => Promise<{
    status: "ok" | "needs_approval" | "cancelled";
    output: unknown[];
    requiresApproval?: EmbeddedToolEnvelope["requiresApproval"];
  }>;
  readStateJson: (params: {
    env: Record<string, string | undefined>;
    key: string;
  }) => Promise<unknown>;
  writeStateJson: (params: {
    env: Record<string, string | undefined>;
    key: string;
    value: unknown;
  }) => Promise<void>;
  deleteStateJson: (params: {
    env: Record<string, string | undefined>;
    key: string;
  }) => Promise<void>;
};

type PipelineResumeState = {
  pipeline: Array<{ name: string; args: Record<string, unknown>; raw: string }>;
  resumeAtIndex: number;
  items: unknown[];
  prompt?: string;
  createdAt: string;
};

type LoadEmbeddedToolRuntime = () => Promise<EmbeddedToolRuntime>;

type ApprovalRequestItem = {
  type: "approval_request";
  prompt: string;
  items: unknown[];
  resumeToken?: string;
};

=======
type LoadEmbeddedToolRuntime = () => Promise<EmbeddedToolRuntime>;

type LoadEmbeddedToolRuntimeFromPackageOptions = {
  importModule?: (specifier: string) => Promise<Partial<EmbeddedToolRuntime>>;
  resolvePackageEntry?: (specifier: string) => string;
};

const lobsterRequire = createRequire(import.meta.url);

function toEmbeddedToolRuntime(
  moduleExports: Partial<EmbeddedToolRuntime>,
  source: string,
): EmbeddedToolRuntime {
  const { runToolRequest, resumeToolRequest } = moduleExports;
  if (typeof runToolRequest === "function" && typeof resumeToolRequest === "function") {
    return { runToolRequest, resumeToolRequest };
  }
  throw new Error(`${source} does not export Lobster embedded runtime functions`);
}

function findLobsterPackageRoot(resolvedEntryPath: string): string {
  let dir = path.dirname(resolvedEntryPath);
  while (true) {
    const packageJsonPath = path.join(dir, "package.json");
    try {
      const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { name?: string };
      if (parsed.name === "@clawdbot/lobster") {
        return dir;
      }
    } catch {
      // Keep walking until the installed package root is found.
    }

    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(`Could not locate @clawdbot/lobster package root from ${resolvedEntryPath}`);
    }
    dir = parent;
  }
}

>>>>>>> upstream/main
function normalizeForCwdSandbox(p: string): string {
  const normalized = path.normalize(p);
  return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}

export function resolveLobsterCwd(cwdRaw: unknown): string {
  if (typeof cwdRaw !== "string" || !cwdRaw.trim()) {
    return process.cwd();
  }
  const cwd = cwdRaw.trim();
  if (path.isAbsolute(cwd)) {
    throw new Error("cwd must be a relative path");
  }
  const base = process.cwd();
  const resolved = path.resolve(base, cwd);

  const rel = path.relative(normalizeForCwdSandbox(base), normalizeForCwdSandbox(resolved));
  if (rel === "" || rel === ".") {
    return resolved;
  }
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("cwd must stay within the gateway working directory");
  }
  return resolved;
}

function createLimitedSink(maxBytes: number, label: "stdout" | "stderr") {
  let bytes = 0;
  return new Writable({
    write(chunk, _encoding, callback) {
      bytes += Buffer.byteLength(String(chunk), "utf8");
      if (bytes > maxBytes) {
        callback(new Error(`lobster ${label} exceeded maxStdoutBytes`));
        return;
      }
      callback();
    },
  });
}

function normalizeEnvelope(envelope: EmbeddedToolEnvelope): LobsterEnvelope {
  if (envelope.ok) {
<<<<<<< HEAD
=======
    if (envelope.status === "needs_input") {
      return {
        ok: false,
        error: {
          type: "unsupported_status",
          message: "Lobster input requests are not supported by the OpenClaw Lobster tool yet",
        },
      };
    }
>>>>>>> upstream/main
    return {
      ok: true,
      status: envelope.status ?? "ok",
      output: Array.isArray(envelope.output) ? envelope.output : [],
      requiresApproval: envelope.requiresApproval
        ? {
            type: "approval_request",
            prompt: envelope.requiresApproval.prompt,
            items: envelope.requiresApproval.items,
            ...(envelope.requiresApproval.resumeToken
              ? { resumeToken: envelope.requiresApproval.resumeToken }
              : {}),
<<<<<<< HEAD
=======
            ...(envelope.requiresApproval.approvalId
              ? { approvalId: envelope.requiresApproval.approvalId }
              : {}),
>>>>>>> upstream/main
          }
        : null,
    };
  }
  return {
    ok: false,
    error: {
      type: envelope.error?.type,
      message: envelope.error?.message ?? "lobster runtime failed",
    },
  };
}

function throwOnErrorEnvelope(envelope: LobsterEnvelope): Extract<LobsterEnvelope, { ok: true }> {
  if (envelope.ok) {
    return envelope;
  }
  throw new Error(envelope.error.message);
}

<<<<<<< HEAD
function asApprovalRequestItem(item: unknown): ApprovalRequestItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }
  const candidate = item as Partial<ApprovalRequestItem>;
  if (candidate.type !== "approval_request") {
    return null;
  }
  if (typeof candidate.prompt !== "string" || !Array.isArray(candidate.items)) {
    return null;
  }
  return candidate as ApprovalRequestItem;
}

async function resolveWorkflowFile(candidate: string, cwd: string) {
  const { stat } = await import("node:fs/promises");
=======
async function resolveWorkflowFile(candidate: string, cwd: string) {
>>>>>>> upstream/main
  const resolved = path.isAbsolute(candidate) ? candidate : path.resolve(cwd, candidate);
  const fileStat = await stat(resolved);
  if (!fileStat.isFile()) {
    throw new Error("Workflow path is not a file");
  }
  const ext = path.extname(resolved).toLowerCase();
  if (![".lobster", ".yaml", ".yml", ".json"].includes(ext)) {
    throw new Error("Workflow file must end in .lobster, .yaml, .yml, or .json");
  }
  return resolved;
}

async function detectWorkflowFile(candidate: string, cwd: string) {
  const trimmed = candidate.trim();
  if (!trimmed || trimmed.includes("|")) {
    return null;
  }
  try {
    return await resolveWorkflowFile(trimmed, cwd);
  } catch {
    return null;
  }
}

function parseWorkflowArgs(argsJson: string) {
  return JSON.parse(argsJson) as Record<string, unknown>;
}

function createEmbeddedToolContext(
  params: LobsterRunnerParams,
  signal?: AbortSignal,
): EmbeddedToolContext {
  const env = { ...process.env } as Record<string, string | undefined>;
  return {
    cwd: params.cwd,
    env,
    mode: "tool",
    stdin: Readable.from([]),
    stdout: createLimitedSink(Math.max(1024, params.maxStdoutBytes), "stdout"),
    stderr: createLimitedSink(Math.max(1024, params.maxStdoutBytes), "stderr"),
    signal,
  };
}

async function withTimeout<T>(
  timeoutMs: number,
  fn: (signal?: AbortSignal) => Promise<T>,
): Promise<T> {
  const timeout = Math.max(200, timeoutMs);
  const controller = new AbortController();
  return await new Promise<T>((resolve, reject) => {
    const onTimeout = () => {
      const error = new Error("lobster runtime timed out");
      controller.abort(error);
      reject(error);
    };

    const timer = setTimeout(onTimeout, timeout);
    void fn(controller.signal).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
<<<<<<< HEAD
      (error) => {
        clearTimeout(timer);
        reject(error);
=======
      (error: unknown) => {
        clearTimeout(timer);
        reject(toLintErrorObject(error, "Non-Error rejection"));
>>>>>>> upstream/main
      },
    );
  });
}

<<<<<<< HEAD
function createFallbackEmbeddedToolRuntime(deps: ToolRuntimeDeps): EmbeddedToolRuntime {
  const createToolContext = (ctx: EmbeddedToolContext = {}) => ({
    cwd: ctx.cwd ?? process.cwd(),
    env: { ...process.env, ...ctx.env },
    mode: "tool" as const,
    stdin: ctx.stdin ?? Readable.from([]),
    stdout: ctx.stdout ?? createLimitedSink(512_000, "stdout"),
    stderr: ctx.stderr ?? createLimitedSink(512_000, "stderr"),
    signal: ctx.signal,
    registry: ctx.registry ?? deps.createDefaultRegistry(),
    llmAdapters: ctx.llmAdapters,
  });

  const okEnvelope = (
    status: "ok" | "needs_approval" | "cancelled",
    output: unknown[],
    requiresApproval: EmbeddedToolEnvelope["requiresApproval"],
  ): EmbeddedToolEnvelope => ({
    protocolVersion: 1,
    ok: true,
    status,
    output,
    requiresApproval,
  });

  const errorEnvelope = (type: string, message: string): EmbeddedToolEnvelope => ({
    protocolVersion: 1,
    ok: false,
    error: { type, message },
  });

  const streamFromItems = (items: unknown[]) =>
    (async function* () {
      for (const item of items) {
        yield item;
      }
    })();

  const savePipelineResumeState = async (
    env: Record<string, string | undefined>,
    state: PipelineResumeState,
  ) => {
    const stateKey = `pipeline_resume_${randomUUID()}`;
    await deps.writeStateJson({ env, key: stateKey, value: state });
    return stateKey;
  };

  const loadPipelineResumeState = async (
    env: Record<string, string | undefined>,
    stateKey: string,
  ) => {
    const stored = await deps.readStateJson({ env, key: stateKey });
    if (!stored || typeof stored !== "object") {
      throw new Error("Pipeline resume state not found");
    }
    const data = stored as Partial<PipelineResumeState>;
    if (!Array.isArray(data.pipeline)) {
      throw new Error("Invalid pipeline resume state");
    }
    if (typeof data.resumeAtIndex !== "number") {
      throw new Error("Invalid pipeline resume state");
    }
    if (!Array.isArray(data.items)) {
      throw new Error("Invalid pipeline resume state");
    }
    return data as PipelineResumeState;
  };

  return {
    async runToolRequest({ pipeline, filePath, args, ctx = {} }) {
      const runtime = createToolContext(ctx);
      const hasPipeline = typeof pipeline === "string" && pipeline.trim().length > 0;
      const hasFile = typeof filePath === "string" && filePath.trim().length > 0;

      if (!hasPipeline && !hasFile) {
        return errorEnvelope("parse_error", "run requires either pipeline or filePath");
      }
      if (hasPipeline && hasFile) {
        return errorEnvelope("parse_error", "run accepts either pipeline or filePath, not both");
      }

      if (hasFile) {
        try {
          const output = await deps.runWorkflowFile({
            filePath: filePath!,
            args,
            ctx: runtime,
          });

          if (output.status === "needs_approval") {
            return okEnvelope("needs_approval", [], output.requiresApproval ?? null);
          }
          if (output.status === "cancelled") {
            return okEnvelope("cancelled", [], null);
          }
          return okEnvelope("ok", output.output, null);
        } catch (error) {
          return errorEnvelope(
            "runtime_error",
            error instanceof Error ? error.message : String(error),
          );
        }
      }

      let parsed;
      try {
        parsed = deps.parsePipeline(String(pipeline));
      } catch (error) {
        return errorEnvelope("parse_error", error instanceof Error ? error.message : String(error));
      }

      try {
        const output = await deps.runPipeline({
          pipeline: parsed,
          registry: runtime.registry,
          input: [],
          stdin: runtime.stdin!,
          stdout: runtime.stdout!,
          stderr: runtime.stderr!,
          env: runtime.env,
          mode: "tool",
          cwd: runtime.cwd,
          llmAdapters: runtime.llmAdapters,
          signal: runtime.signal,
        });

        const approval =
          output.halted && output.items.length === 1
            ? asApprovalRequestItem(output.items[0])
            : null;

        if (approval) {
          const stateKey = await savePipelineResumeState(runtime.env, {
            pipeline: parsed,
            resumeAtIndex: (output.haltedAt?.index ?? -1) + 1,
            items: approval.items,
            prompt: approval.prompt,
            createdAt: new Date().toISOString(),
          });

          const resumeToken = deps.encodeToken({
            protocolVersion: 1,
            v: 1,
            kind: "pipeline-resume",
            stateKey,
          });

          return okEnvelope("needs_approval", [], {
            type: "approval_request",
            prompt: approval.prompt,
            items: approval.items,
            resumeToken,
          });
        }

        return okEnvelope("ok", output.items, null);
      } catch (error) {
        return errorEnvelope(
          "runtime_error",
          error instanceof Error ? error.message : String(error),
        );
      }
    },

    async resumeToolRequest({ token, approved, ctx = {} }) {
      const runtime = createToolContext(ctx);
      let payload: { kind?: string; stateKey?: string; filePath?: string };

      try {
        payload = deps.decodeResumeToken(token);
      } catch (error) {
        return errorEnvelope("parse_error", error instanceof Error ? error.message : String(error));
      }

      if (!approved) {
        if (payload.kind === "workflow-file" && payload.stateKey) {
          await deps.deleteStateJson({ env: runtime.env, key: payload.stateKey });
        }
        if (payload.kind === "pipeline-resume" && payload.stateKey) {
          await deps.deleteStateJson({ env: runtime.env, key: payload.stateKey });
        }
        return okEnvelope("cancelled", [], null);
      }

      if (payload.kind === "workflow-file" && payload.filePath) {
        try {
          const output = await deps.runWorkflowFile({
            filePath: payload.filePath,
            ctx: runtime,
            resume: payload as Record<string, unknown>,
            approved: true,
          });

          if (output.status === "needs_approval") {
            return okEnvelope("needs_approval", [], output.requiresApproval ?? null);
          }
          if (output.status === "cancelled") {
            return okEnvelope("cancelled", [], null);
          }
          return okEnvelope("ok", output.output, null);
        } catch (error) {
          return errorEnvelope(
            "runtime_error",
            error instanceof Error ? error.message : String(error),
          );
        }
      }

      try {
        const resumeState = await loadPipelineResumeState(runtime.env, payload.stateKey ?? "");
        const remaining = resumeState.pipeline.slice(resumeState.resumeAtIndex);

        const output = await deps.runPipeline({
          pipeline: remaining,
          registry: runtime.registry,
          input: streamFromItems(resumeState.items),
          stdin: runtime.stdin!,
          stdout: runtime.stdout!,
          stderr: runtime.stderr!,
          env: runtime.env,
          mode: "tool",
          cwd: runtime.cwd,
          llmAdapters: runtime.llmAdapters,
          signal: runtime.signal,
        });

        const approval =
          output.halted && output.items.length === 1
            ? asApprovalRequestItem(output.items[0])
            : null;

        if (approval) {
          const nextStateKey = await savePipelineResumeState(runtime.env, {
            pipeline: remaining,
            resumeAtIndex: (output.haltedAt?.index ?? -1) + 1,
            items: approval.items,
            prompt: approval.prompt,
            createdAt: new Date().toISOString(),
          });
          if (payload.stateKey) {
            await deps.deleteStateJson({ env: runtime.env, key: payload.stateKey });
          }

          const resumeToken = deps.encodeToken({
            protocolVersion: 1,
            v: 1,
            kind: "pipeline-resume",
            stateKey: nextStateKey,
          });

          return okEnvelope("needs_approval", [], {
            type: "approval_request",
            prompt: approval.prompt,
            items: approval.items,
            resumeToken,
          });
        }

        if (payload.stateKey) {
          await deps.deleteStateJson({ env: runtime.env, key: payload.stateKey });
        }
        return okEnvelope("ok", output.items, null);
      } catch (error) {
        return errorEnvelope(
          "runtime_error",
          error instanceof Error ? error.message : String(error),
        );
      }
    },
  };
}

async function importInstalledLobsterModule<T>(
  lobsterRoot: string,
  relativePath: string,
): Promise<T> {
  const target = path.join(lobsterRoot, relativePath);
  return (await import(pathToFileURL(target).href)) as T;
}

function resolveInstalledLobsterRoot() {
  const require = createRequire(import.meta.url);
  const sdkEntry = require.resolve("@clawdbot/lobster");
  let currentDir = path.dirname(sdkEntry);

  while (true) {
    const packageJsonPath = path.join(currentDir, "package.json");
    if (existsSync(packageJsonPath)) {
      return currentDir;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      throw new Error("Unable to resolve the installed @clawdbot/lobster package root");
    }
    currentDir = parentDir;
  }
}

async function loadEmbeddedToolRuntimeFromPackage(): Promise<EmbeddedToolRuntime> {
  const lobsterRoot = resolveInstalledLobsterRoot();
  const coreIndexPath = path.join(lobsterRoot, "dist/src/core/index.js");

  try {
    const core = await import(pathToFileURL(coreIndexPath).href);
    if (typeof core.runToolRequest === "function" && typeof core.resumeToolRequest === "function") {
      return {
        runToolRequest: core.runToolRequest as EmbeddedToolRuntime["runToolRequest"],
        resumeToolRequest: core.resumeToolRequest as EmbeddedToolRuntime["resumeToolRequest"],
      };
    }
  } catch {
    // The current published npm package does not export/ship ./core yet.
  }

  const [
    registryModule,
    parserModule,
    resumeModule,
    tokenModule,
    runtimeModule,
    workflowModule,
    storeModule,
  ] = await Promise.all([
    importInstalledLobsterModule<{
      createDefaultRegistry: ToolRuntimeDeps["createDefaultRegistry"];
    }>(lobsterRoot, "dist/src/commands/registry.js"),
    importInstalledLobsterModule<{ parsePipeline: ToolRuntimeDeps["parsePipeline"] }>(
      lobsterRoot,
      "dist/src/parser.js",
    ),
    importInstalledLobsterModule<{ decodeResumeToken: ToolRuntimeDeps["decodeResumeToken"] }>(
      lobsterRoot,
      "dist/src/resume.js",
    ),
    importInstalledLobsterModule<{ encodeToken: ToolRuntimeDeps["encodeToken"] }>(
      lobsterRoot,
      "dist/src/token.js",
    ),
    importInstalledLobsterModule<{ runPipeline: ToolRuntimeDeps["runPipeline"] }>(
      lobsterRoot,
      "dist/src/runtime.js",
    ),
    importInstalledLobsterModule<{ runWorkflowFile: ToolRuntimeDeps["runWorkflowFile"] }>(
      lobsterRoot,
      "dist/src/workflows/file.js",
    ),
    importInstalledLobsterModule<{
      readStateJson: ToolRuntimeDeps["readStateJson"];
      writeStateJson: ToolRuntimeDeps["writeStateJson"];
      deleteStateJson: ToolRuntimeDeps["deleteStateJson"];
    }>(lobsterRoot, "dist/src/state/store.js"),
  ]);

  return createFallbackEmbeddedToolRuntime({
    createDefaultRegistry: registryModule.createDefaultRegistry,
    parsePipeline: parserModule.parsePipeline,
    decodeResumeToken: resumeModule.decodeResumeToken,
    encodeToken: tokenModule.encodeToken,
    runPipeline: runtimeModule.runPipeline,
    runWorkflowFile: workflowModule.runWorkflowFile,
    readStateJson: storeModule.readStateJson,
    writeStateJson: storeModule.writeStateJson,
    deleteStateJson: storeModule.deleteStateJson,
=======
export async function loadEmbeddedToolRuntimeFromPackage(
  options: LoadEmbeddedToolRuntimeFromPackageOptions = {},
): Promise<EmbeddedToolRuntime> {
  const importModule =
    options.importModule ??
    (async (specifier: string) => (await import(specifier)) as Partial<EmbeddedToolRuntime>);
  const resolvePackageEntry =
    options.resolvePackageEntry ?? ((specifier: string) => lobsterRequire.resolve(specifier));
  const packageEntryPath = resolvePackageEntry("@clawdbot/lobster");
  await installLobsterAjvCompileCache(packageEntryPath);

  let coreLoadError: unknown;
  try {
    const coreSpecifier = ["@clawdbot", "lobster", "core"].join("/");
    return toEmbeddedToolRuntime(await importModule(coreSpecifier), "@clawdbot/lobster/core");
  } catch (error) {
    coreLoadError = error;
  }

  let fallbackLoadError: unknown;
  try {
    const packageRoot = findLobsterPackageRoot(packageEntryPath);
    const coreRuntimeUrl = pathToFileURL(path.join(packageRoot, "dist/src/core/index.js")).href;
    return toEmbeddedToolRuntime(await importModule(coreRuntimeUrl), coreRuntimeUrl);
  } catch (error) {
    fallbackLoadError = error;
  }

  throw new Error("Failed to load the Lobster embedded runtime", {
    cause: new AggregateError(
      [coreLoadError, fallbackLoadError],
      "Both Lobster embedded runtime load paths failed",
    ),
>>>>>>> upstream/main
  });
}

export function createEmbeddedLobsterRunner(options?: {
  loadRuntime?: LoadEmbeddedToolRuntime;
}): LobsterRunner {
  const loadRuntime = options?.loadRuntime ?? loadEmbeddedToolRuntimeFromPackage;
  let runtimePromise: Promise<EmbeddedToolRuntime> | undefined;
<<<<<<< HEAD

  const getRuntime = () => {
    runtimePromise ??= loadRuntime().catch((error) => {
      runtimePromise = undefined;
      throw error;
    });
    return runtimePromise;
  };

  return {
    async run(params) {
      const runtime = await getRuntime();
=======
  return {
    async run(params) {
      runtimePromise ??= loadRuntime();
      const runtime = await runtimePromise;
>>>>>>> upstream/main
      return await withTimeout(params.timeoutMs, async (signal) => {
        const ctx = createEmbeddedToolContext(params, signal);

        if (params.action === "run") {
          const pipeline = params.pipeline?.trim() ?? "";
          if (!pipeline) {
            throw new Error("pipeline required");
          }

          const filePath = await detectWorkflowFile(pipeline, params.cwd);
          if (filePath) {
            const parsedArgsJson = params.argsJson?.trim() ?? "";
            let args: Record<string, unknown> | undefined;
            if (parsedArgsJson) {
              try {
                args = parseWorkflowArgs(parsedArgsJson);
              } catch {
                throw new Error("run --args-json must be valid JSON");
              }
            }
            return throwOnErrorEnvelope(
              normalizeEnvelope(await runtime.runToolRequest({ filePath, args, ctx })),
            );
          }

          return throwOnErrorEnvelope(
            normalizeEnvelope(await runtime.runToolRequest({ pipeline, ctx })),
          );
        }

        const token = params.token?.trim() ?? "";
<<<<<<< HEAD
        if (!token) {
          throw new Error("token required");
=======
        const approvalId = params.approvalId?.trim() ?? "";
        if (!token && !approvalId) {
          throw new Error("token or approvalId required");
>>>>>>> upstream/main
        }
        if (typeof params.approve !== "boolean") {
          throw new Error("approve required");
        }

        return throwOnErrorEnvelope(
          normalizeEnvelope(
            await runtime.resumeToolRequest({
<<<<<<< HEAD
              token,
=======
              ...(token ? { token } : {}),
              ...(approvalId ? { approvalId } : {}),
>>>>>>> upstream/main
              approved: params.approve,
              ctx,
            }),
          ),
        );
      });
    },
  };
}
<<<<<<< HEAD
=======

function toLintErrorObject(value: unknown, fallbackMessage: string): Error {
  if (value instanceof Error) {
    return value;
  }
  if (typeof value === "string") {
    return new Error(value);
  }
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function") {
    Object.assign(error, value);
  }
  return error;
}
>>>>>>> upstream/main
