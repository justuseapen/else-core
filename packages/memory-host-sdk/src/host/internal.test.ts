// Memory Host SDK tests cover internal behavior.
import fsSync from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildFileEntry,
  buildMultimodalChunkForIndexing,
  chunkMarkdown,
<<<<<<< HEAD
=======
  ensureDir,
>>>>>>> upstream/main
  isMemoryPath,
  listMemoryFiles,
  normalizeExtraMemoryPaths,
  remapChunkLines,
} from "./internal.js";
import {
  DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES,
  type MemoryMultimodalSettings,
} from "./multimodal.js";

type FileEntry = NonNullable<Awaited<ReturnType<typeof buildFileEntry>>>;
type MultimodalIndexingChunk = NonNullable<
  Awaited<ReturnType<typeof buildMultimodalChunkForIndexing>>
>;

let sharedTempRoot = "";
let sharedTempId = 0;

beforeAll(() => {
  sharedTempRoot = fsSync.mkdtempSync(path.join(os.tmpdir(), "memory-host-sdk-package-tests-"));
});

afterAll(() => {
  if (sharedTempRoot) {
    fsSync.rmSync(sharedTempRoot, { recursive: true, force: true });
  }
});

afterEach(() => {
  vi.restoreAllMocks();
});

function setupTempDirLifecycle(prefix: string): () => string {
  let tmpDir = "";
  beforeEach(() => {
    tmpDir = path.join(sharedTempRoot, `${prefix}${sharedTempId++}`);
    fsSync.mkdirSync(tmpDir, { recursive: true });
  });
  return () => tmpDir;
}

function expectFileEntry(entry: Awaited<ReturnType<typeof buildFileEntry>>): FileEntry {
  if (!entry) {
    throw new Error("Expected file entry to be built");
  }
  return entry;
}

function expectMultimodalIndexingChunk(
  built: Awaited<ReturnType<typeof buildMultimodalChunkForIndexing>>,
): MultimodalIndexingChunk {
  if (!built) {
    throw new Error("Expected multimodal indexing chunk to be built");
  }
  return built;
}

function expectEmbeddingInput(
  chunk: MultimodalIndexingChunk["chunk"],
): NonNullable<MultimodalIndexingChunk["chunk"]["embeddingInput"]> {
  if (!chunk.embeddingInput) {
    throw new Error("Expected multimodal chunk embedding input");
  }
  return chunk.embeddingInput;
}

const multimodal: MemoryMultimodalSettings = {
  enabled: true,
  modalities: ["image", "audio"],
  maxFileBytes: DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES,
};

describe("memory host SDK package internals", () => {
  const getTmpDir = setupTempDirLifecycle("memory-package-");

  it("propagates directory creation failures", () => {
    const mkdirError = new Error("disk full");
    const targetDir = path.join(getTmpDir(), "blocked");
    const mkdirSync = vi.spyOn(fsSync, "mkdirSync").mockImplementation(() => {
      throw mkdirError;
    });

    expect(() => ensureDir(targetDir)).toThrow(mkdirError);
    expect(mkdirSync).toHaveBeenCalledWith(targetDir, { recursive: true });
  });

  it("normalizes additional memory paths", () => {
    const workspaceDir = path.join(os.tmpdir(), "memory-test-workspace");
    const absPath = path.resolve(path.sep, "shared-notes");
    expect(
      normalizeExtraMemoryPaths(workspaceDir, [
        " notes ",
        "./notes",
        absPath,
        absPath,
        "~/shared-notes",
        "~",
        "",
      ]),
    ).toEqual([
      path.resolve(workspaceDir, "notes"),
      absPath,
      path.join(os.homedir(), "shared-notes"),
      os.homedir(),
    ]);
  });

  it("lists canonical markdown and enabled multimodal files", async () => {
    const tmpDir = getTmpDir();
    fsSync.writeFileSync(path.join(tmpDir, "MEMORY.md"), "# Default memory");
    fsSync.writeFileSync(path.join(tmpDir, "memory.md"), "# Legacy memory");
    const extraDir = path.join(tmpDir, "extra");
    fsSync.mkdirSync(extraDir, { recursive: true });
    fsSync.writeFileSync(path.join(extraDir, "note.md"), "# Note");
    fsSync.writeFileSync(path.join(extraDir, "diagram.png"), Buffer.from("png"));
    fsSync.writeFileSync(path.join(extraDir, "ignore.txt"), "ignored");

<<<<<<< HEAD
    const targetFile = path.join(tmpDir, "target.md");
    await fs.writeFile(targetFile, "# Target");
    const linkFile = path.join(extraDir, "linked.md");

    const targetDir = path.join(tmpDir, "target-dir");
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.join(targetDir, "nested.md"), "# Nested");
    const linkDir = path.join(tmpDir, "linked-dir");

    let symlinksOk = true;
    try {
      await fs.symlink(targetFile, linkFile, "file");
      await fs.symlink(targetDir, linkDir, "dir");
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "EPERM" || code === "EACCES") {
        symlinksOk = false;
      } else {
        throw err;
      }
    }

    const files = await listMemoryFiles(tmpDir, [extraDir, linkDir]);
    expect(files.some((file) => file.endsWith("note.md"))).toBe(true);
    if (symlinksOk) {
      expect(files.some((file) => file.endsWith("linked.md"))).toBe(false);
      expect(files.some((file) => file.endsWith("nested.md"))).toBe(false);
    }
  });

  it("dedupes overlapping extra paths that resolve to the same file", async () => {
    const tmpDir = getTmpDir();
    await fs.writeFile(path.join(tmpDir, "MEMORY.md"), "# Default memory");
    const files = await listMemoryFiles(tmpDir, [tmpDir, ".", path.join(tmpDir, "MEMORY.md")]);
    const memoryMatches = files.filter((file) => file.endsWith("MEMORY.md"));
    expect(memoryMatches).toHaveLength(1);
  });

  it("includes image and audio files from extra paths when multimodal is enabled", async () => {
    const tmpDir = getTmpDir();
    const extraDir = path.join(tmpDir, "media");
    await fs.mkdir(extraDir, { recursive: true });
    await fs.writeFile(path.join(extraDir, "diagram.png"), Buffer.from("png"));
    await fs.writeFile(path.join(extraDir, "note.wav"), Buffer.from("wav"));
    await fs.writeFile(path.join(extraDir, "ignore.bin"), Buffer.from("bin"));

    const files = await listMemoryFiles(tmpDir, [extraDir], multimodal);
    expect(files.some((file) => file.endsWith("diagram.png"))).toBe(true);
    expect(files.some((file) => file.endsWith("note.wav"))).toBe(true);
    expect(files.some((file) => file.endsWith("ignore.bin"))).toBe(false);
  });
});

describe("isMemoryPath", () => {
  it("allows explicit access to top-level dreams.md", () => {
    expect(isMemoryPath("dreams.md")).toBe(true);
  });
});

describe("buildFileEntry", () => {
  const getTmpDir = setupTempDirLifecycle("memory-build-entry-");
  const multimodal: MemoryMultimodalSettings = {
    enabled: true,
    modalities: ["image", "audio"],
    maxFileBytes: DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES,
  };

  it("returns null when the file disappears before reading", async () => {
    const tmpDir = getTmpDir();
    const target = path.join(tmpDir, "ghost.md");
    await fs.writeFile(target, "ghost", "utf-8");
    await fs.rm(target);
    const entry = await buildFileEntry(target, tmpDir);
    expect(entry).toBeNull();
  });

  it("returns metadata when the file exists", async () => {
    const tmpDir = getTmpDir();
    const target = path.join(tmpDir, "note.md");
    await fs.writeFile(target, "hello", "utf-8");
    const entry = await buildFileEntry(target, tmpDir);
    expect(entry).not.toBeNull();
    expect(entry?.path).toBe("note.md");
    expect(entry?.size).toBeGreaterThan(0);
  });

  it("returns multimodal metadata for eligible image files", async () => {
    const tmpDir = getTmpDir();
    const target = path.join(tmpDir, "diagram.png");
    await fs.writeFile(target, Buffer.from("png"));

    const entry = await buildFileEntry(target, tmpDir, multimodal);

    expect(entry).toMatchObject({
      path: "diagram.png",
      kind: "multimodal",
      modality: "image",
      mimeType: "image/png",
      contentText: "Image file: diagram.png",
    });
  });

  it("builds a multimodal chunk lazily for indexing", async () => {
    const tmpDir = getTmpDir();
    const target = path.join(tmpDir, "diagram.png");
    await fs.writeFile(target, Buffer.from("png"));

    const entry = await buildFileEntry(target, tmpDir, multimodal);
    const built = await buildMultimodalChunkForIndexing(entry!);

    expect(built?.chunk.embeddingInput?.parts).toEqual([
      { type: "text", text: "Image file: diagram.png" },
      expect.objectContaining({ type: "inline-data", mimeType: "image/png" }),
    ]);
    expect(built?.structuredInputBytes).toBeGreaterThan(0);
  });

  it("skips lazy multimodal indexing when the file grows after discovery", async () => {
    const tmpDir = getTmpDir();
    const target = path.join(tmpDir, "diagram.png");
    await fs.writeFile(target, Buffer.from("png"));

    const entry = await buildFileEntry(target, tmpDir, multimodal);
    await fs.writeFile(target, Buffer.alloc(entry!.size + 32, 1));

    await expect(buildMultimodalChunkForIndexing(entry!)).resolves.toBeNull();
  });

  it("skips lazy multimodal indexing when file bytes change after discovery", async () => {
    const tmpDir = getTmpDir();
    const target = path.join(tmpDir, "diagram.png");
    await fs.writeFile(target, Buffer.from("png"));

    const entry = await buildFileEntry(target, tmpDir, multimodal);
    await fs.writeFile(target, Buffer.from("gif"));

    await expect(buildMultimodalChunkForIndexing(entry!)).resolves.toBeNull();
  });
});

describe("chunkMarkdown", () => {
  it("splits overly long lines into max-sized chunks", () => {
    const chunkTokens = 400;
    const maxChars = chunkTokens * 4;
    const content = "a".repeat(maxChars * 3 + 25);
    const chunks = chunkMarkdown(content, { tokens: chunkTokens, overlap: 0 });
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.text.length).toBeLessThanOrEqual(maxChars);
    }
  });

  it("produces more chunks for CJK text than for equal-length ASCII text", () => {
    // CJK chars ≈ 1 token each; ASCII chars ≈ 0.25 tokens each.
    // For the same raw character count, CJK content should produce more chunks
    // because each character "weighs" ~4× more in token estimation.
    const chunkTokens = 50;

    // 400 ASCII chars → ~100 tokens → fits in ~2 chunks
    const asciiLines = Array.from({ length: 20 }, () => "a".repeat(20)).join("\n");
    const asciiChunks = chunkMarkdown(asciiLines, { tokens: chunkTokens, overlap: 0 });

    // 400 CJK chars → ~400 tokens → needs ~8 chunks
    const cjkLines = Array.from({ length: 20 }, () => "你".repeat(20)).join("\n");
    const cjkChunks = chunkMarkdown(cjkLines, { tokens: chunkTokens, overlap: 0 });

    expect(cjkChunks.length).toBeGreaterThan(asciiChunks.length);
  });

  it("respects token budget for Chinese text", () => {
    // With tokens=100, each CJK char ≈ 1 token, so chunks should hold ~100 CJK chars.
    const chunkTokens = 100;
    const lines: string[] = [];
    for (let i = 0; i < 50; i++) {
      lines.push("这是一个测试句子用来验证分块逻辑是否正确处理中文文本内容");
    }
    const content = lines.join("\n");
    const chunks = chunkMarkdown(content, { tokens: chunkTokens, overlap: 0 });

    expect(chunks.length).toBeGreaterThan(1);
    // Each chunk's CJK content should not vastly exceed the token budget.
    // With CJK-aware estimation, each char ≈ 1 token, so chunk text length
    // (in CJK chars) should be roughly <= tokens budget (with some tolerance
    // for line boundaries).
    for (const chunk of chunks) {
      // Count actual CJK characters in the chunk
      const cjkCount = (chunk.text.match(/[\u4e00-\u9fff]/g) ?? []).length;
      // Allow 2× tolerance for line-boundary rounding
      expect(cjkCount).toBeLessThanOrEqual(chunkTokens * 2);
    }
  });

  it("keeps English chunking behavior unchanged", () => {
    const chunkTokens = 100;
    const maxChars = chunkTokens * 4; // 400 chars
    const content = "hello world this is a test. ".repeat(50);
    const chunks = chunkMarkdown(content, { tokens: chunkTokens, overlap: 0 });
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.text.length).toBeLessThanOrEqual(maxChars);
    }
  });

  it("handles mixed CJK and ASCII content correctly", () => {
    const chunkTokens = 50;
    const lines: string[] = [];
    for (let i = 0; i < 30; i++) {
      lines.push(`Line ${i}: 这是中英文混合的测试内容 with some English text`);
    }
    const content = lines.join("\n");
    const chunks = chunkMarkdown(content, { tokens: chunkTokens, overlap: 0 });
    // Should produce multiple chunks and not crash
    expect(chunks.length).toBeGreaterThan(1);
    // Verify all content is preserved
    const reconstructed = chunks.map((c) => c.text).join("\n");
    // Due to overlap=0, the concatenated chunks should cover all lines
    expect(reconstructed).toContain("Line 0");
    expect(reconstructed).toContain("Line 29");
  });

  it("splits very long CJK lines into budget-sized segments", () => {
    // A single line of 2000 CJK characters (no newlines).
    // With tokens=200, each CJK char ≈ 1 token.
    const longCjkLine = "中".repeat(2000);
    const chunks = chunkMarkdown(longCjkLine, { tokens: 200, overlap: 0 });
    expect(chunks.length).toBeGreaterThanOrEqual(8);
    for (const chunk of chunks) {
      const cjkCount = (chunk.text.match(/[\u4E00-\u9FFF]/g) ?? []).length;
      expect(cjkCount).toBeLessThanOrEqual(200 * 2);
    }
  });
  it("does not break surrogate pairs when splitting long CJK lines", () => {
    // "𠀀" (U+20000) is a surrogate pair: 2 UTF-16 code units per character.
    // A line of 500 such characters = 1000 UTF-16 code units.
    // With tokens=99 (odd), the fine-split must not cut inside a pair.
    const surrogateChar = "\u{20000}"; // 𠀀
    const longLine = surrogateChar.repeat(500);
    const chunks = chunkMarkdown(longLine, { tokens: 99, overlap: 0 });
    for (const chunk of chunks) {
      // No chunk should contain the Unicode replacement character U+FFFD,
      // which would indicate a broken surrogate pair.
      expect(chunk.text).not.toContain("\uFFFD");
      // Every character in the chunk should be a valid string (no lone surrogates).
      for (let i = 0; i < chunk.text.length; i += 1) {
        const code = chunk.text.charCodeAt(i);
        if (code >= 0xd800 && code <= 0xdbff) {
          // High surrogate must be followed by a low surrogate
          const next = chunk.text.charCodeAt(i + 1);
          expect(next).toBeGreaterThanOrEqual(0xdc00);
          expect(next).toBeLessThanOrEqual(0xdfff);
        }
      }
    }
  });
  it("does not over-split long Latin lines (backward compat)", () => {
    // 2000 ASCII chars / 800 maxChars -> about 3 segments, not 10 tiny ones.
    const longLatinLine = "a".repeat(2000);
    const chunks = chunkMarkdown(longLatinLine, { tokens: 200, overlap: 0 });
    expect(chunks.length).toBeLessThanOrEqual(5);
  });
});

describe("remapChunkLines", () => {
  it("remaps chunk line numbers using a lineMap", () => {
    // Simulate 5 content lines that came from JSONL lines [4, 6, 7, 10, 13] (1-indexed)
    const lineMap = [4, 6, 7, 10, 13];

    // Create chunks from content that has 5 lines
    const content = "User: Hello\nAssistant: Hi\nUser: Question\nAssistant: Answer\nUser: Thanks";
    const chunks = chunkMarkdown(content, { tokens: 400, overlap: 0 });
    expect(chunks.length).toBeGreaterThan(0);

    // Before remapping, startLine/endLine reference content line numbers (1-indexed)
    expect(chunks[0].startLine).toBe(1);

    // Remap
    remapChunkLines(chunks, lineMap);

    // After remapping, line numbers should reference original JSONL lines
    // Content line 1 → JSONL line 4, content line 5 → JSONL line 13
    expect(chunks[0].startLine).toBe(4);
    const lastChunk = chunks[chunks.length - 1];
    expect(lastChunk.endLine).toBe(13);
  });

  it("preserves original line numbers when lineMap is undefined", () => {
    const content = "Line one\nLine two\nLine three";
    const chunks = chunkMarkdown(content, { tokens: 400, overlap: 0 });
    const originalStart = chunks[0].startLine;
    const originalEnd = chunks[chunks.length - 1].endLine;

    remapChunkLines(chunks, undefined);

    expect(chunks[0].startLine).toBe(originalStart);
    expect(chunks[chunks.length - 1].endLine).toBe(originalEnd);
  });

  it("handles multi-chunk content with correct remapping", () => {
    // Use small chunk size to force multiple chunks
    // lineMap: 10 content lines from JSONL lines [2, 5, 8, 11, 14, 17, 20, 23, 26, 29]
    const lineMap = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29];
    const contentLines = lineMap.map((_, i) =>
      i % 2 === 0 ? `User: Message ${i}` : `Assistant: Reply ${i}`,
=======
    const files = await listMemoryFiles(
      tmpDir,
      [path.join(tmpDir, "memory.md"), extraDir],
      multimodal,
>>>>>>> upstream/main
    );

    expect(files.map((file) => path.relative(tmpDir, file)).toSorted()).toEqual([
      "MEMORY.md",
      path.join("extra", "diagram.png"),
      path.join("extra", "note.md"),
    ]);
  });

  it("allows top-level dreams path casing variants", () => {
    expect(isMemoryPath("dreams.md")).toBe(true);
    expect(isMemoryPath("DREAMS.md")).toBe(true);
  });

  it("builds markdown and multimodal file entries", async () => {
    const tmpDir = getTmpDir();
    const notePath = path.join(tmpDir, "note.md");
    const imagePath = path.join(tmpDir, "diagram.png");
    fsSync.writeFileSync(notePath, "hello", "utf-8");
    fsSync.writeFileSync(imagePath, Buffer.from("png"));

    const note = await buildFileEntry(notePath, tmpDir);
    const image = await buildFileEntry(imagePath, tmpDir, multimodal);

    const noteEntry = expectFileEntry(note);
    expect(noteEntry.path).toBe("note.md");
    expect(noteEntry.kind).toBe("markdown");
    const imageEntry = expectFileEntry(image);
    expect(imageEntry.path).toBe("diagram.png");
    expect(imageEntry.kind).toBe("multimodal");
    expect(imageEntry.modality).toBe("image");
    expect(imageEntry.mimeType).toBe("image/png");
    expect(imageEntry.contentText).toBe("Image file: diagram.png");
  });

  it("retries transient markdown reads while building file entries", async () => {
    const tmpDir = getTmpDir();
    const notePath = path.join(tmpDir, "note.md");
    fsSync.writeFileSync(notePath, "hello", "utf-8");

    const realOpen = fs.open;
    let attempts = 0;
    const openSpy = vi
      .spyOn(fs, "open")
      .mockImplementation(async (...args: Parameters<typeof realOpen>) => {
        const [target, flags, mode] = args;
        if (typeof target === "string" && path.resolve(target) === notePath && attempts++ === 0) {
          const err = new Error(
            "Unknown system error -11: Unknown system error -11, open",
          ) as NodeJS.ErrnoException;
          err.code = "UNKNOWN";
          err.errno = -11;
          throw err;
        }
        return await realOpen(target, flags, mode);
      });

    try {
      const entry = expectFileEntry(await buildFileEntry(notePath, tmpDir));
      expect(entry.path).toBe("note.md");
      expect(entry.kind).toBe("markdown");
      expect(attempts).toBe(2);
    } finally {
      openSpy.mockRestore();
    }
  });

  it("builds multimodal chunks lazily and rejects changed files", async () => {
    const tmpDir = getTmpDir();
    const imagePath = path.join(tmpDir, "diagram.png");
    fsSync.writeFileSync(imagePath, Buffer.from("png"));

    const entry = expectFileEntry(await buildFileEntry(imagePath, tmpDir, multimodal));
    const built = expectMultimodalIndexingChunk(await buildMultimodalChunkForIndexing(entry));
    const parts = expectEmbeddingInput(built.chunk).parts ?? [];
    expect(parts[0]).toEqual({ type: "text", text: "Image file: diagram.png" });
    const inlinePart = parts[1];
    if (inlinePart?.type !== "inline-data") {
      throw new Error("Expected multimodal inline-data embedding part");
    }
    expect(inlinePart.mimeType).toBe("image/png");

    fsSync.writeFileSync(imagePath, Buffer.alloc(entry.size + 32, 1));
    await expect(buildMultimodalChunkForIndexing(entry)).resolves.toBeNull();
  });

  it("chunks mixed text and preserves surrogate pairs", () => {
    const mixed = Array.from(
      { length: 30 },
      (_, index) => `Line ${index}: 这是中英文混合的测试内容 with English`,
    ).join("\n");
    const mixedChunks = chunkMarkdown(mixed, { tokens: 50, overlap: 0 });
    expect(mixedChunks.length).toBeGreaterThan(1);
    expect(mixedChunks.map((chunk) => chunk.text).join("\n")).toContain("Line 29");

    const surrogateChar = "\u{20000}";
    const surrogateChunks = chunkMarkdown(surrogateChar.repeat(120), {
      tokens: 31,
      overlap: 0,
    });
    for (const chunk of surrogateChunks) {
      expect(chunk.text).not.toContain("\uFFFD");
    }
  });

  it("remaps chunk lines using JSONL source line maps", () => {
    const lineMap = [4, 6, 7, 10, 13];
    const chunks = chunkMarkdown(
      "User: Hello\nAssistant: Hi\nUser: Question\nAssistant: Answer\nUser: Thanks",
      { tokens: 400, overlap: 0 },
    );

    remapChunkLines(chunks, lineMap);

    expect(chunks[0].startLine).toBe(4);
    expect(chunks[chunks.length - 1].endLine).toBe(13);
  });
});
