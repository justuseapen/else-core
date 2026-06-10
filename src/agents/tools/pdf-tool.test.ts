// PDF tool tests cover model discovery, input validation, managed inbound refs,
// native document providers, extraction fallback, and model-facing schema.
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import * as pdfExtractModule from "../../media/pdf-extract.js";
import * as webMedia from "../../media/web-media.js";
<<<<<<< HEAD
import * as modelAuth from "../model-auth.js";
import { modelSupportsDocument } from "../model-catalog.js";
import * as modelsConfig from "../models-config.js";
import * as modelDiscovery from "../pi-model-discovery.js";
import * as pdfNativeProviders from "./pdf-native-providers.js";
import {
  coercePdfAssistantText,
  coercePdfModelConfig,
  parsePageRange,
  providerSupportsNativePdf,
  resolvePdfToolMaxTokens,
} from "./pdf-tool.helpers.js";

const completeMock = vi.hoisted(() => vi.fn());

vi.mock("@mariozechner/pi-ai", async () => {
  const actual = await vi.importActual<typeof import("@mariozechner/pi-ai")>("@mariozechner/pi-ai");
=======
import { withEnvAsync } from "../../test-utils/env.js";
import * as modelDiscovery from "../agent-model-discovery.js";
import type { AuthProfileStore } from "../auth-profiles/types.js";
import * as modelAuth from "../model-auth.js";
import * as modelsConfig from "../models-config.js";
import * as pdfNativeProviders from "./pdf-native-providers.js";
import * as pdfModelConfigModule from "./pdf-tool.model-config.js";
import { resetPdfToolAuthEnv, withTempPdfAgentDir } from "./pdf-tool.test-support.js";

const completeMock = vi.hoisted(() => vi.fn());

vi.mock("../../llm/stream.js", async () => {
  const actual = await vi.importActual<typeof import("../../llm/stream.js")>("../../llm/stream.js");
>>>>>>> upstream/main
  return {
    ...actual,
    complete: completeMock,
  };
});

type PdfToolModule = typeof import("./pdf-tool.js");
let createPdfTool: PdfToolModule["createPdfTool"];
<<<<<<< HEAD
let resolvePdfModelConfigForTool: PdfToolModule["resolvePdfModelConfigForTool"];

beforeAll(async () => {
  ({ createPdfTool, resolvePdfModelConfigForTool } = await import("./pdf-tool.js"));
});

async function withTempAgentDir<T>(run: (agentDir: string) => Promise<T>): Promise<T> {
  const agentDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-pdf-"));
  try {
    return await run(agentDir);
  } finally {
    await fs.rm(agentDir, { recursive: true, force: true });
=======
let PdfToolSchema: PdfToolModule["PdfToolSchema"];

async function loadCreatePdfTool() {
  if (!createPdfTool || !PdfToolSchema) {
    ({ createPdfTool, PdfToolSchema } = await import("./pdf-tool.js"));
>>>>>>> upstream/main
  }
  return createPdfTool;
}

const ANTHROPIC_PDF_MODEL = "anthropic/claude-opus-4-6";
const OPENAI_PDF_MODEL = "openai/gpt-5.4-mini";
<<<<<<< HEAD
const TEST_PDF_INPUT = { base64: "dGVzdA==", filename: "doc.pdf" } as const;
=======
const CODEX_PDF_MODEL = "openai/gpt-5.4";
>>>>>>> upstream/main
const FAKE_PDF_MEDIA = {
  kind: "document",
  buffer: Buffer.from("%PDF-1.4 fake"),
  contentType: "application/pdf",
  fileName: "doc.pdf",
} as const;

function requirePdfTool(
  tool: Awaited<ReturnType<typeof loadCreatePdfTool>> extends (...args: any[]) => infer R
    ? R
    : never,
) {
  expect(typeof tool?.execute).toBe("function");
  if (!tool) {
    throw new Error("expected pdf tool");
  }
  return tool;
}

type PdfToolInstance = ReturnType<typeof requirePdfTool>;

async function withConfiguredPdfTool(
  run: (tool: PdfToolInstance, agentDir: string) => Promise<void>,
) {
  await withTempPdfAgentDir(async (agentDir) => {
    const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
    const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));
    await run(tool, agentDir);
  });
}

function withPdfModel(primary: string): OpenClawConfig {
  return {
    agents: { defaults: { pdfModel: { primary } } },
  } as OpenClawConfig;
}

function withDefaultModel(primary: string): OpenClawConfig {
  return {
    agents: { defaults: { model: { primary } } },
  } as OpenClawConfig;
}

function expectFields(value: unknown, expected: Record<string, unknown>): void {
  if (!value || typeof value !== "object") {
    throw new Error("expected fields object");
  }
  const record = value as Record<string, unknown>;
  for (const [key, expectedValue] of Object.entries(expected)) {
    expect(record[key], key).toEqual(expectedValue);
  }
}

function firstMockCall(mock: { mock: { calls: unknown[][] } }, label: string): unknown[] {
  const call = mock.mock.calls.at(0);
  if (!call) {
    throw new Error(`expected ${label} to be called`);
  }
  return call;
}

function firstCompletionContext(): { systemPrompt?: string } | undefined {
  const [, context] = firstMockCall(completeMock, "complete") as [
    unknown,
    { systemPrompt?: string } | undefined,
  ];
  return context;
}

async function stubPdfToolInfra(
  agentDir: string,
  params?: {
    mockLoad?: boolean;
    provider?: string;
    input?: string[];
    api?: string;
    modelFound?: boolean;
  },
) {
<<<<<<< HEAD
  const loadSpy = vi.spyOn(webMedia, "loadWebMediaRaw").mockResolvedValue(FAKE_PDF_MEDIA as never);
=======
  // Keep PDF tool tests focused on orchestration; provider discovery, auth, and
  // remote media loading are replaced with narrow spies at the module boundary.
  const loadSpy = vi.spyOn(webMedia, "loadWebMediaRaw");
  if (params?.mockLoad !== false) {
    loadSpy.mockResolvedValue(FAKE_PDF_MEDIA as never);
  }
>>>>>>> upstream/main

  vi.spyOn(modelDiscovery, "discoverAuthStorage").mockReturnValue({
    setRuntimeApiKey: vi.fn(),
  } as never);
  const find =
    params?.modelFound === false
      ? () => null
      : () =>
          ({
            provider: params?.provider ?? "anthropic",
            api:
              params?.api ??
              (params?.provider === "openai"
                ? "openai-chatgpt-responses"
                : params?.provider === "openai"
                  ? "openai-responses"
                  : "anthropic-messages"),
            maxTokens: 8192,
            input: params?.input ?? ["text", "document"],
          }) as never;
  vi.spyOn(modelDiscovery, "discoverModels").mockReturnValue({ find } as never);

  vi.spyOn(modelsConfig, "ensureOpenClawModelsJson").mockResolvedValue({
    agentDir,
    wrote: false,
  });

<<<<<<< HEAD
  vi.spyOn(modelAuth, "getApiKeyForModel").mockResolvedValue({ apiKey: "test-key" } as never); // pragma: allowlist secret
=======
  vi.spyOn(modelAuth, "getApiKeyForModel").mockResolvedValue({ apiKey: "test-key" } as never);
>>>>>>> upstream/main
  vi.spyOn(modelAuth, "requireApiKey").mockReturnValue("test-key");

  return { loadSpy };
}

<<<<<<< HEAD
// ---------------------------------------------------------------------------
// parsePageRange tests
// ---------------------------------------------------------------------------

describe("parsePageRange", () => {
  it("parses a single page number", () => {
    expect(parsePageRange("3", 20)).toEqual([3]);
  });

  it("parses a page range", () => {
    expect(parsePageRange("1-5", 20)).toEqual([1, 2, 3, 4, 5]);
  });

  it("parses comma-separated pages and ranges", () => {
    expect(parsePageRange("1,3,5-7", 20)).toEqual([1, 3, 5, 6, 7]);
  });

  it("clamps to maxPages", () => {
    expect(parsePageRange("1-100", 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("deduplicates and sorts", () => {
    expect(parsePageRange("5,3,1,3,5", 20)).toEqual([1, 3, 5]);
  });

  it("throws on invalid page number", () => {
    expect(() => parsePageRange("abc", 20)).toThrow("Invalid page number");
  });

  it("throws on invalid range (start > end)", () => {
    expect(() => parsePageRange("5-3", 20)).toThrow("Invalid page range");
  });

  it("throws on zero page number", () => {
    expect(() => parsePageRange("0", 20)).toThrow("Invalid page number");
  });

  it("throws on negative page number", () => {
    expect(() => parsePageRange("-1", 20)).toThrow("Invalid page number");
  });

  it("handles empty parts gracefully", () => {
    expect(parsePageRange("1,,3", 20)).toEqual([1, 3]);
  });
});

// ---------------------------------------------------------------------------
// providerSupportsNativePdf tests
// ---------------------------------------------------------------------------

describe("providerSupportsNativePdf", () => {
  it("returns true for anthropic", () => {
    expect(providerSupportsNativePdf("anthropic")).toBe(true);
  });

  it("returns true for google", () => {
    expect(providerSupportsNativePdf("google")).toBe(true);
  });

  it("returns false for openai", () => {
    expect(providerSupportsNativePdf("openai")).toBe(false);
  });

  it("returns false for minimax", () => {
    expect(providerSupportsNativePdf("minimax")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(providerSupportsNativePdf("Anthropic")).toBe(true);
    expect(providerSupportsNativePdf("GOOGLE")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// PDF model config resolution
// ---------------------------------------------------------------------------

describe("resolvePdfModelConfigForTool", () => {
  const priorFetch = global.fetch;

  beforeEach(() => {
    resetAuthEnv();
    completeMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    global.fetch = priorFetch;
  });

  it("returns null without any auth", async () => {
    await withTempAgentDir(async (agentDir) => {
      const cfg: OpenClawConfig = {
        agents: { defaults: { model: { primary: "openai/gpt-5.4" } } },
      };
      expect(resolvePdfModelConfigForTool({ cfg, agentDir })).toBeNull();
    });
  });

  it("prefers explicit pdfModel config", async () => {
    await withTempAgentDir(async (agentDir) => {
      const cfg: OpenClawConfig = {
        agents: {
          defaults: {
            model: { primary: "openai/gpt-5.4" },
            pdfModel: { primary: "anthropic/claude-opus-4-6" },
          },
        },
      } as OpenClawConfig;
      expect(resolvePdfModelConfigForTool({ cfg, agentDir })).toEqual({
        primary: "anthropic/claude-opus-4-6",
      });
    });
  });

  it("falls back to imageModel config when no pdfModel set", async () => {
    await withTempAgentDir(async (agentDir) => {
      const cfg: OpenClawConfig = {
        agents: {
          defaults: {
            model: { primary: "openai/gpt-5.4" },
            imageModel: { primary: "openai/gpt-5.4-mini" },
          },
        },
      };
      expect(resolvePdfModelConfigForTool({ cfg, agentDir })).toEqual({
        primary: "openai/gpt-5.4-mini",
      });
    });
  });

  it("prefers anthropic when available for native PDF support", async () => {
    await withTempAgentDir(async (agentDir) => {
      vi.stubEnv("ANTHROPIC_API_KEY", "anthropic-test");
      vi.stubEnv("OPENAI_API_KEY", "openai-test");
      const cfg = withDefaultModel("openai/gpt-5.4");
      const config = resolvePdfModelConfigForTool({ cfg, agentDir });
      expect(config).not.toBeNull();
      // Should prefer anthropic for native PDF
      expect(config?.primary).toBe(ANTHROPIC_PDF_MODEL);
    });
  });

  it("uses anthropic primary when provider is anthropic", async () => {
    await withTempAgentDir(async (agentDir) => {
      vi.stubEnv("ANTHROPIC_API_KEY", "anthropic-test");
      const cfg = withDefaultModel(ANTHROPIC_PDF_MODEL);
      const config = resolvePdfModelConfigForTool({ cfg, agentDir });
      expect(config?.primary).toBe(ANTHROPIC_PDF_MODEL);
    });
  });
});

// ---------------------------------------------------------------------------
// createPdfTool
// ---------------------------------------------------------------------------
=======
async function withManagedInboundPdf(
  run: (params: { stateDir: string; mediaId: string; mediaPath: string }) => Promise<void>,
) {
  // Managed inbound PDFs live under state and may be addressed by claim-check
  // IDs or absolute paths even when workspace-only policy is active.
  const stateDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-pdf-managed-inbound-"));
  const inboundDir = path.join(stateDir, "media", "inbound");
  const mediaId = "claim-check-test.pdf";
  const mediaPath = path.join(inboundDir, mediaId);
  await fs.mkdir(inboundDir, { recursive: true });
  await fs.writeFile(mediaPath, FAKE_PDF_MEDIA.buffer);
  try {
    await withEnvAsync({ OPENCLAW_STATE_DIR: stateDir }, async () => {
      await run({ stateDir, mediaId, mediaPath });
    });
  } finally {
    await fs.rm(stateDir, { recursive: true, force: true });
  }
}
>>>>>>> upstream/main

describe("createPdfTool", () => {
  const priorFetch = global.fetch;

  beforeEach(() => {
<<<<<<< HEAD
    resetAuthEnv();
=======
    resetPdfToolAuthEnv();
>>>>>>> upstream/main
    completeMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = priorFetch;
  });

  it("returns null without agentDir and no explicit config", async () => {
    expect((await loadCreatePdfTool())()).toBeNull();
  });

  it("throws when agentDir missing but explicit config present", async () => {
    const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
    const createTool = await loadCreatePdfTool();
    expect(() => createTool({ config: cfg })).toThrow("requires agentDir");
  });

  it("creates tool when a PDF model is configured", async () => {
    await withConfiguredPdfTool(async (tool) => {
      expect(tool.name).toBe("pdf");
      expect(tool.label).toBe("PDF");
      expect(tool.description).toContain("Analyze PDFs");
    });
  });

  it("defers automatic model config resolution during registration (#76644)", async () => {
    const resolveSpy = vi.spyOn(pdfModelConfigModule, "resolvePdfModelConfigForTool");
    const cfg = withDefaultModel("openai/gpt-5.4");
    const authProfileStore = {
      version: 1,
      profiles: {
        "anthropic:default": {
          type: "api_key",
          provider: "anthropic",
          key: "test-key",
        },
      },
    } satisfies AuthProfileStore;
    const createTool = await loadCreatePdfTool();
    await withTempPdfAgentDir(async (agentDir) => {
      expect(
        createTool({
          config: cfg,
          agentDir,
          authProfileStore,
          deferAutoModelResolution: true,
        })?.name,
      ).toBe("pdf");
      expect(resolveSpy).not.toHaveBeenCalled();
    });
    resolveSpy.mockRestore();
  });

  it("keeps explicit model config resolution eager even when automatic resolution is deferred", async () => {
    const resolveSpy = vi.spyOn(pdfModelConfigModule, "resolvePdfModelConfigForTool");
    const createTool = await loadCreatePdfTool();
    await withTempPdfAgentDir(async (agentDir) => {
      expect(
        createTool({
          config: withPdfModel(ANTHROPIC_PDF_MODEL),
          agentDir,
          deferAutoModelResolution: true,
        })?.name,
      ).toBe("pdf");
      expect(resolveSpy).toHaveBeenCalledTimes(1);
    });
    resolveSpy.mockRestore();
  });

  it("resolves deferred model config on execution before loading PDFs", async () => {
    const resolveSpy = vi
      .spyOn(pdfModelConfigModule, "resolvePdfModelConfigForTool")
      .mockReturnValue(null);
    const loadSpy = vi.spyOn(webMedia, "loadWebMediaRaw");
    const createTool = await loadCreatePdfTool();
    const cfg = withDefaultModel("openai/gpt-5.4");
    await withTempPdfAgentDir(async (agentDir) => {
      const tool = requirePdfTool(
        createTool({
          config: cfg,
          agentDir,
          deferAutoModelResolution: true,
        }),
      );
      await expect(
        tool.execute("t1", {
          prompt: "summarize",
          pdf: "/tmp/doc.pdf",
        }),
      ).rejects.toThrow("No PDF model configured.");
    });
    expect(resolveSpy).toHaveBeenCalledTimes(1);
    expect(loadSpy).not.toHaveBeenCalled();
    resolveSpy.mockRestore();
  });

  it("rejects when no pdf input provided", async () => {
    await withConfiguredPdfTool(async (tool) => {
      await expect(tool.execute("t1", { prompt: "test" })).rejects.toThrow("pdf required");
    });
  });

  it("rejects too many PDFs", async () => {
    await withConfiguredPdfTool(async (tool) => {
      const manyPdfs = Array.from({ length: 15 }, (_, i) => `/tmp/doc${i}.pdf`);
      const result = await tool.execute("t1", { prompt: "test", pdfs: manyPdfs });
      expectFields(result.details, { error: "too_many_pdfs" });
    });
  });

  it("rejects invalid maxBytesMb before loading PDFs", async () => {
    await withConfiguredPdfTool(async (tool) => {
      const loadSpy = vi.spyOn(webMedia, "loadWebMediaRaw");

      await expect(
        tool.execute("t1", {
          prompt: "test",
          pdf: "/tmp/doc.pdf",
          maxBytesMb: 0,
        }),
      ).rejects.toThrow("maxBytesMb must be greater than 0");
      expect(loadSpy).not.toHaveBeenCalled();
    });
  });

  it("passes validated maxBytesMb to PDF loading", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      const { loadSpy } = await stubPdfToolInfra(agentDir, {
        provider: "anthropic",
        input: ["text", "document"],
      });
      vi.spyOn(pdfNativeProviders, "anthropicAnalyzePdf").mockResolvedValue("native summary");
      const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

      await tool.execute("t1", {
        prompt: "summarize",
        pdf: "/tmp/doc.pdf",
        maxBytesMb: "0.5",
      });

      const [, loadOptions] = firstMockCall(loadSpy, "loadWebMediaRaw");
      expectFields(loadOptions, { maxBytes: 524_288 });
    });
  });

  it("respects fsPolicy.workspaceOnly for non-sandbox pdf paths", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-pdf-ws-"));
      const outsideDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-pdf-out-"));
      try {
        const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
        const tool = requirePdfTool(
          (await loadCreatePdfTool())({
            config: cfg,
            agentDir,
            workspaceDir,
            fsPolicy: { workspaceOnly: true },
          }),
        );

        const outsidePdf = path.join(outsideDir, "secret.pdf");
        await fs.writeFile(outsidePdf, "%PDF-1.4 fake");

        await expect(tool.execute("t1", { prompt: "test", pdf: outsidePdf })).rejects.toThrow(
          /not under an allowed directory/i,
        );
      } finally {
        await fs.rm(workspaceDir, { recursive: true, force: true });
        await fs.rm(outsideDir, { recursive: true, force: true });
      }
    });
  });

  it("rejects unsupported scheme references", async () => {
    await withConfiguredPdfTool(async (tool) => {
      const result = await tool.execute("t1", {
        prompt: "test",
        pdf: "ftp://example.com/doc.pdf",
      });
      expectFields(result.details, { error: "unsupported_pdf_reference" });
    });
  });

  it("resolves media://inbound PDF refs", async () => {
    await withManagedInboundPdf(async ({ mediaId }) => {
      await withTempPdfAgentDir(async (agentDir) => {
        const { loadSpy } = await stubPdfToolInfra(agentDir, {
          mockLoad: false,
          provider: "anthropic",
          input: ["text", "document"],
        });
        vi.spyOn(pdfNativeProviders, "anthropicAnalyzePdf").mockResolvedValue("native summary");
        const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
        const tool = requirePdfTool(
          (await loadCreatePdfTool())({
            config: cfg,
            agentDir,
            fsPolicy: { workspaceOnly: true },
          }),
        );

        const result = await tool.execute("t1", {
          prompt: "summarize",
          pdf: `media://inbound/${mediaId}`,
        });

        const [loadRef, loadOptions] = firstMockCall(loadSpy, "loadWebMediaRaw");
        expect(loadRef).toBe(`media://inbound/${mediaId}`);
        expectFields(loadOptions, { localRoots: [] });
        expect(result.content).toEqual([{ type: "text", text: "native summary" }]);
        expectFields(result.details, {
          native: true,
          model: ANTHROPIC_PDF_MODEL,
        });
      });
    });
  });

  it("passes web_fetch SSRF policy when loading remote PDFs", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      const { loadSpy } = await stubPdfToolInfra(agentDir, {
        provider: "anthropic",
        input: ["text", "document"],
      });
      vi.spyOn(pdfNativeProviders, "anthropicAnalyzePdf").mockResolvedValue("native summary");
      const cfg: OpenClawConfig = {
        ...withPdfModel(ANTHROPIC_PDF_MODEL),
        tools: {
          web: {
            fetch: {
              ssrfPolicy: { allowRfc2544BenchmarkRange: true },
            },
          },
        },
      };
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

      await tool.execute("t1", {
        prompt: "summarize",
        pdf: "http://198.18.0.153/doc.pdf",
      });

      const [loadRef, loadOptions] = firstMockCall(loadSpy, "loadWebMediaRaw");
      expect(loadRef).toBe("http://198.18.0.153/doc.pdf");
      expectFields(loadOptions, {
        readIdleTimeoutMs: 120_000,
        ssrfPolicy: { allowRfc2544BenchmarkRange: true },
      });
    });
  });

  it("passes the shared remote read idle timeout when loading remote PDFs", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      const { loadSpy } = await stubPdfToolInfra(agentDir, {
        provider: "anthropic",
        input: ["text", "document"],
      });
      vi.spyOn(pdfNativeProviders, "anthropicAnalyzePdf").mockResolvedValue("native summary");
      const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

      await tool.execute("t1", {
        prompt: "summarize",
        pdf: "https://example.com/stalled.pdf",
      });

      const [loadRef, loadOptions] = firstMockCall(loadSpy, "loadWebMediaRaw");
      expect(loadRef).toBe("https://example.com/stalled.pdf");
      expectFields(loadOptions, {
        readIdleTimeoutMs: 120_000,
      });
    });
  });

  it("allows managed inbound absolute PDF paths when workspaceOnly is enabled", async () => {
    await withManagedInboundPdf(async ({ mediaPath }) => {
      await withTempPdfAgentDir(async (agentDir) => {
        const { loadSpy } = await stubPdfToolInfra(agentDir, {
          mockLoad: false,
          provider: "anthropic",
          input: ["text", "document"],
        });
        vi.spyOn(pdfNativeProviders, "anthropicAnalyzePdf").mockResolvedValue("native summary");
        const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
        const tool = requirePdfTool(
          (await loadCreatePdfTool())({
            config: cfg,
            agentDir,
            fsPolicy: { workspaceOnly: true },
          }),
        );

        await tool.execute("t1", {
          prompt: "summarize",
          pdf: mediaPath,
        });

        const [loadRef, loadOptions] = firstMockCall(loadSpy, "loadWebMediaRaw");
        expect(loadRef).toBe(mediaPath);
        expect(loadOptions).toBeTypeOf("object");
      });
    });
  });

  it("uses native PDF path without eager extraction", async () => {
    // Document-capable providers receive the PDF bytes directly; extraction is
    // reserved for text-only model paths.
    await withTempPdfAgentDir(async (agentDir) => {
      const workspaceDir = path.join(agentDir, "workspace");
      await stubPdfToolInfra(agentDir, { provider: "anthropic", input: ["text", "document"] });
<<<<<<< HEAD

      vi.spyOn(pdfNativeProviders, "anthropicAnalyzePdf").mockResolvedValue("native summary");

      const extractSpy = vi.spyOn(pdfExtractModule, "extractPdfContent");

=======
      vi.spyOn(pdfNativeProviders, "anthropicAnalyzePdf").mockResolvedValue("native summary");
      const extractSpy = vi.spyOn(pdfExtractModule, "extractPdfContent");
>>>>>>> upstream/main
      const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
      const tool = requirePdfTool(
        (await loadCreatePdfTool())({ config: cfg, agentDir, workspaceDir }),
      );

      const result = await tool.execute("t1", {
        prompt: "summarize",
        pdf: "/tmp/doc.pdf",
      });

      const ensureModelsJsonMock = vi.mocked(modelsConfig.ensureOpenClawModelsJson);
      const [modelsConfigArg, modelsAgentDir, modelsOptions] = firstMockCall(
        ensureModelsJsonMock,
        "ensureOpenClawModelsJson",
      );
      expectFields(
        (modelsConfigArg as { agents?: { defaults?: unknown } } | undefined)?.agents?.defaults,
        {
          pdfModel: { primary: ANTHROPIC_PDF_MODEL },
        },
      );
      expect(modelsAgentDir).toBe(agentDir);
      expect(modelsOptions).toEqual({ workspaceDir });
      expect(modelDiscovery.discoverModels).toHaveBeenCalledWith(expect.anything(), agentDir, {
        workspaceDir,
      });
      expect(extractSpy).not.toHaveBeenCalled();
      expect(result.content).toEqual([{ type: "text", text: "native summary" }]);
      expectFields(result.details, {
        native: true,
        model: ANTHROPIC_PDF_MODEL,
      });
    });
  });

  it("rejects pages parameter for native PDF providers", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      await stubPdfToolInfra(agentDir, { provider: "anthropic", input: ["text", "document"] });
      const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

      await expect(
        tool.execute("t1", {
          prompt: "summarize",
          pdf: "/tmp/doc.pdf",
          pages: "1-2",
        }),
      ).rejects.toThrow("pages is not supported with native PDF providers");
    });
  });

  it("rejects password parameter for native PDF providers", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      await stubPdfToolInfra(agentDir, { provider: "anthropic", input: ["text", "document"] });
      const cfg = withPdfModel(ANTHROPIC_PDF_MODEL);
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

<<<<<<< HEAD
=======
      await expect(
        tool.execute("t1", {
          prompt: "summarize",
          pdf: "/tmp/doc.pdf",
          password: "secret",
        }),
      ).rejects.toThrow("password is not supported with native PDF providers");
    });
  });

  it("uses extraction fallback for non-native models", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      await stubPdfToolInfra(agentDir, {
        provider: "openai",
        api: "openai-responses",
        input: ["text"],
      });
>>>>>>> upstream/main
      const extractSpy = vi.spyOn(pdfExtractModule, "extractPdfContent").mockResolvedValue({
        text: "Extracted content",
        images: [],
      });
      completeMock.mockResolvedValue({
        role: "assistant",
        stopReason: "stop",
        content: [{ type: "text", text: "fallback summary" }],
      } as never);

      const cfg = withPdfModel(OPENAI_PDF_MODEL);
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

      const result = await tool.execute("t1", {
        prompt: "summarize",
        pdf: "/tmp/doc.pdf",
      });

      expect(extractSpy).toHaveBeenCalledTimes(1);
      expect(result.content).toEqual([{ type: "text", text: "fallback summary" }]);
      expectFields(result.details, {
        native: false,
        model: OPENAI_PDF_MODEL,
      });
      expect(firstCompletionContext()?.systemPrompt).toBeUndefined();
    });
  });

  it("passes password to PDF extraction fallback", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      await stubPdfToolInfra(agentDir, { provider: "openai", input: ["text"] });
      const extractSpy = vi.spyOn(pdfExtractModule, "extractPdfContent").mockResolvedValue({
        text: "Encrypted content",
        images: [],
      });
      completeMock.mockResolvedValue({
        role: "assistant",
        stopReason: "stop",
        content: [{ type: "text", text: "fallback summary" }],
      } as never);

      const cfg = withPdfModel(OPENAI_PDF_MODEL);
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

      await tool.execute("t1", {
        prompt: "summarize",
        pdf: "/tmp/doc.pdf",
        password: "secret",
      });

      expect(extractSpy).toHaveBeenCalledWith(expect.objectContaining({ password: "secret" }));
    });
  });

  it("preserves PDF password whitespace before extraction fallback", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      await stubPdfToolInfra(agentDir, { provider: "openai", input: ["text"] });
      const extractSpy = vi.spyOn(pdfExtractModule, "extractPdfContent").mockResolvedValue({
        text: "Plain content",
        images: [],
      });
      completeMock.mockResolvedValue({
        role: "assistant",
        stopReason: "stop",
        content: [{ type: "text", text: "fallback summary" }],
      } as never);

      const cfg = withPdfModel(OPENAI_PDF_MODEL);
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

      await tool.execute("t1", {
        prompt: "summarize",
        pdf: "/tmp/doc.pdf",
        password: " secret ",
      });

      expect(extractSpy).toHaveBeenCalledWith(expect.objectContaining({ password: " secret " }));
    });
  });

  it("adds Codex instructions for PDF extraction fallback requests", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      await stubPdfToolInfra(agentDir, {
        provider: "openai",
        api: "openai-chatgpt-responses",
        input: ["text", "image"],
      });

      vi.spyOn(pdfExtractModule, "extractPdfContent").mockResolvedValue({
        text: "Extracted content",
        images: [],
      });

      completeMock.mockResolvedValue({
        role: "assistant",
        stopReason: "stop",
        content: [{ type: "text", text: "codex summary" }],
      } as never);

      const cfg = withPdfModel(CODEX_PDF_MODEL);
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

      const result = await tool.execute("t1", {
        prompt: "summarize",
        pdf: "/tmp/doc.pdf",
      });

      expect(result.content).toEqual([{ type: "text", text: "codex summary" }]);
      expectFields(result.details, {
        native: false,
        model: CODEX_PDF_MODEL,
      });
      expect(completeMock).toHaveBeenCalledTimes(1);
      expect(firstCompletionContext()?.systemPrompt).toContain("Analyze the provided PDF content");
    });
  });

  it("adds Codex instructions when extraction has images but the model only accepts text", async () => {
    await withTempPdfAgentDir(async (agentDir) => {
      await stubPdfToolInfra(agentDir, {
        provider: "openai",
        api: "openai-chatgpt-responses",
        input: ["text"],
      });

      vi.spyOn(pdfExtractModule, "extractPdfContent").mockResolvedValue({
        text: "Extracted content",
        images: [{ type: "image", data: "base64img", mimeType: "image/png" }],
      });

      completeMock.mockResolvedValue({
        role: "assistant",
        stopReason: "stop",
        content: [{ type: "text", text: "codex summary" }],
      } as never);

      const cfg = withPdfModel(CODEX_PDF_MODEL);
      const tool = requirePdfTool((await loadCreatePdfTool())({ config: cfg, agentDir }));

      const result = await tool.execute("t1", {
        prompt: "summarize",
        pdf: "/tmp/doc.pdf",
      });

      expect(result.content).toEqual([{ type: "text", text: "codex summary" }]);
      expectFields(result.details, {
        native: false,
        model: CODEX_PDF_MODEL,
      });
      expect(completeMock).toHaveBeenCalledTimes(1);
      expect(firstCompletionContext()?.systemPrompt).toContain("Analyze the provided PDF content");
    });
  });

  it("tool parameters have correct schema shape", async () => {
    await loadCreatePdfTool();
    const schema = PdfToolSchema;
    expect(schema.type).toBe("object");
    expect(schema).toHaveProperty("properties");
    const props = schema.properties as Record<string, { type?: string }>;
    expect(props).toHaveProperty("prompt");
    expect(props).toHaveProperty("pdf");
    expect(props).toHaveProperty("pdfs");
    expect(props).toHaveProperty("pages");
    expect(props).toHaveProperty("password");
    expect(props).toHaveProperty("model");
    expect(props).toHaveProperty("maxBytesMb");
    expect(PdfToolSchema.properties.maxBytesMb).toMatchObject({
      type: "number",
      exclusiveMinimum: 0,
    });
  });
});
<<<<<<< HEAD

// ---------------------------------------------------------------------------
// Native provider detection
// ---------------------------------------------------------------------------

describe("native PDF provider API calls", () => {
  const priorFetch = global.fetch;
  const mockFetchResponse = (response: unknown) => {
    const fetchMock = vi.fn().mockResolvedValue(response);
    global.fetch = Object.assign(fetchMock, { preconnect: vi.fn() }) as typeof global.fetch;
    return fetchMock;
  };

  afterEach(() => {
    global.fetch = priorFetch;
  });

  it("anthropicAnalyzePdf sends correct request shape", async () => {
    const fetchMock = mockFetchResponse({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: "Analysis of PDF" }],
      }),
    });

    const result = await pdfNativeProviders.anthropicAnalyzePdf({
      ...makeAnthropicAnalyzeParams({
        modelId: "claude-opus-4-6",
        prompt: "Summarize this document",
        maxTokens: 4096,
      }),
    });

    expect(result).toBe("Analysis of PDF");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1/messages");
    const body = JSON.parse(opts.body);
    expect(body.model).toBe("claude-opus-4-6");
    expect(body.messages[0].content).toHaveLength(2);
    expect(body.messages[0].content[0].type).toBe("document");
    expect(body.messages[0].content[0].source.media_type).toBe("application/pdf");
    expect(body.messages[0].content[1].type).toBe("text");
  });

  it("anthropicAnalyzePdf throws on API error", async () => {
    mockFetchResponse({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: async () => "invalid request",
    });

    await expect(
      pdfNativeProviders.anthropicAnalyzePdf(makeAnthropicAnalyzeParams()),
    ).rejects.toThrow("Anthropic PDF request failed");
  });

  it("anthropicAnalyzePdf throws when response has no text", async () => {
    mockFetchResponse({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: "   " }],
      }),
    });

    await expect(
      pdfNativeProviders.anthropicAnalyzePdf(makeAnthropicAnalyzeParams()),
    ).rejects.toThrow("Anthropic PDF returned no text");
  });

  it("geminiAnalyzePdf sends correct request shape", async () => {
    const fetchMock = mockFetchResponse({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: { parts: [{ text: "Gemini PDF analysis" }] },
          },
        ],
      }),
    });

    const result = await pdfNativeProviders.geminiAnalyzePdf({
      ...makeGeminiAnalyzeParams({
        modelId: "gemini-2.5-pro",
        prompt: "Summarize this",
      }),
    });

    expect(result).toBe("Gemini PDF analysis");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toContain("generateContent");
    expect(url).toContain("gemini-2.5-pro");
    const body = JSON.parse(opts.body);
    expect(body.contents[0].parts).toHaveLength(2);
    expect(body.contents[0].parts[0].inline_data.mime_type).toBe("application/pdf");
    expect(body.contents[0].parts[1].text).toBe("Summarize this");
  });

  it("geminiAnalyzePdf throws on API error", async () => {
    mockFetchResponse({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: async () => "server error",
    });

    await expect(pdfNativeProviders.geminiAnalyzePdf(makeGeminiAnalyzeParams())).rejects.toThrow(
      "Gemini PDF request failed",
    );
  });

  it("geminiAnalyzePdf throws when no candidates returned", async () => {
    mockFetchResponse({
      ok: true,
      json: async () => ({ candidates: [] }),
    });

    await expect(pdfNativeProviders.geminiAnalyzePdf(makeGeminiAnalyzeParams())).rejects.toThrow(
      "Gemini PDF returned no candidates",
    );
  });

  it("anthropicAnalyzePdf supports multiple PDFs", async () => {
    const fetchMock = mockFetchResponse({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: "Multi-doc analysis" }],
      }),
    });

    await pdfNativeProviders.anthropicAnalyzePdf({
      ...makeAnthropicAnalyzeParams({
        modelId: "claude-opus-4-6",
        prompt: "Compare these documents",
        pdfs: [
          { base64: "cGRmMQ==", filename: "doc1.pdf" },
          { base64: "cGRmMg==", filename: "doc2.pdf" },
        ],
      }),
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    // 2 document blocks + 1 text block
    expect(body.messages[0].content).toHaveLength(3);
    expect(body.messages[0].content[0].type).toBe("document");
    expect(body.messages[0].content[1].type).toBe("document");
    expect(body.messages[0].content[2].type).toBe("text");
  });

  it("anthropicAnalyzePdf uses custom base URL", async () => {
    const fetchMock = mockFetchResponse({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: "ok" }],
      }),
    });

    await pdfNativeProviders.anthropicAnalyzePdf({
      ...makeAnthropicAnalyzeParams({ baseUrl: "https://custom.example.com" }),
    });

    expect(fetchMock.mock.calls[0][0]).toContain("https://custom.example.com/v1/messages");
  });

  it("anthropicAnalyzePdf requires apiKey", async () => {
    await expect(
      pdfNativeProviders.anthropicAnalyzePdf(makeAnthropicAnalyzeParams({ apiKey: "" })),
    ).rejects.toThrow("apiKey required");
  });

  it("geminiAnalyzePdf requires apiKey", async () => {
    await expect(
      pdfNativeProviders.geminiAnalyzePdf(makeGeminiAnalyzeParams({ apiKey: "" })),
    ).rejects.toThrow("apiKey required");
  });

  it("geminiAnalyzePdf does not duplicate /v1beta when baseUrl already includes it", async () => {
    const fetchMock = mockFetchResponse({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "ok" }] } }],
      }),
    });

    await pdfNativeProviders.geminiAnalyzePdf(
      makeGeminiAnalyzeParams({
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      }),
    );

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("/v1beta/models/");
    expect(url).not.toContain("/v1beta/v1beta");
  });

  it("geminiAnalyzePdf normalizes bare Google API hosts to a single /v1beta root", async () => {
    const fetchMock = mockFetchResponse({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: "ok" }] } }],
      }),
    });

    await pdfNativeProviders.geminiAnalyzePdf(
      makeGeminiAnalyzeParams({
        baseUrl: "https://generativelanguage.googleapis.com",
      }),
    );

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("https://generativelanguage.googleapis.com/v1beta/models/");
    expect(url).not.toContain("/v1beta/v1beta");
  });
});

// ---------------------------------------------------------------------------
// PDF tool helpers
// ---------------------------------------------------------------------------

describe("pdf-tool.helpers", () => {
  it("resolvePdfToolMaxTokens respects model limit", () => {
    expect(resolvePdfToolMaxTokens(2048, 4096)).toBe(2048);
    expect(resolvePdfToolMaxTokens(8192, 4096)).toBe(4096);
    expect(resolvePdfToolMaxTokens(undefined, 4096)).toBe(4096);
  });

  it("coercePdfModelConfig reads primary and fallbacks", () => {
    const cfg: OpenClawConfig = {
      agents: {
        defaults: {
          pdfModel: {
            primary: "anthropic/claude-opus-4-6",
            fallbacks: ["google/gemini-2.5-pro"],
          },
        },
      },
    };
    expect(coercePdfModelConfig(cfg)).toEqual({
      primary: "anthropic/claude-opus-4-6",
      fallbacks: ["google/gemini-2.5-pro"],
    });
  });

  it("coercePdfAssistantText returns trimmed text", () => {
    const text = coercePdfAssistantText({
      provider: "anthropic",
      model: "claude-opus-4-6",
      message: {
        role: "assistant",
        stopReason: "stop",
        content: [{ type: "text", text: "  summary  " }],
      } as never,
    });
    expect(text).toBe("summary");
  });

  it("coercePdfAssistantText throws clear error for failed model output", () => {
    expect(() =>
      coercePdfAssistantText({
        provider: "google",
        model: "gemini-2.5-pro",
        message: {
          role: "assistant",
          stopReason: "error",
          errorMessage: "bad request",
          content: [],
        } as never,
      }),
    ).toThrow("PDF model failed (google/gemini-2.5-pro): bad request");
  });
});

// ---------------------------------------------------------------------------
// Model catalog document support
// ---------------------------------------------------------------------------

describe("model catalog document support", () => {
  it("modelSupportsDocument returns true when input includes document", () => {
    expect(
      modelSupportsDocument({
        id: "test",
        name: "test",
        provider: "test",
        input: ["text", "document"],
      }),
    ).toBe(true);
  });

  it("modelSupportsDocument returns false when input lacks document", () => {
    expect(
      modelSupportsDocument({
        id: "test",
        name: "test",
        provider: "test",
        input: ["text", "image"],
      }),
    ).toBe(false);
  });

  it("modelSupportsDocument returns false for undefined entry", () => {
    expect(modelSupportsDocument(undefined)).toBe(false);
  });
});
=======
>>>>>>> upstream/main
