<<<<<<< HEAD
import fs from "node:fs/promises";
import path from "node:path";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
import { runExec } from "../process/exec.js";
=======
// Image operation helpers normalize image transforms and adapter calls.
import {
  createRastermill,
  isRastermillUnavailableError,
  RastermillError,
  RastermillUnavailableError,
  readImageProbeFromHeader as readRastermillImageProbeFromHeader,
  readImageMetadataFromHeader as readRastermillImageMetadataFromHeader,
  type ImageProbe,
  type ImageMetadata,
} from "rastermill";
import { resolveSystemBin } from "../infra/resolve-system-bin.js";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
>>>>>>> upstream/main

export type { ImageMetadata, ImageProbe };

/** OpenClaw-facing image backend availability error, preserving the failed operation and causes. */
export class ImageProcessorUnavailableError extends Error {
  readonly code = "IMAGE_PROCESSOR_UNAVAILABLE";
  readonly operation: string;
  readonly causes: unknown[];

  constructor(operation: string, message?: string, causes: unknown[] = []) {
    super(message ?? `Image processor unavailable for ${operation}`, {
      cause: causes.find((cause): cause is Error => cause instanceof Error),
    });
    this.name = "ImageProcessorUnavailableError";
    this.operation = operation;
    this.causes = causes;
  }
}

/** JPEG resize request passed through the media-runtime/plugin SDK surface. */
export type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
};

<<<<<<< HEAD
export const IMAGE_REDUCE_QUALITY_STEPS = [85, 75, 65, 55, 45, 35] as const;
export const MAX_IMAGE_INPUT_PIXELS = 25_000_000;
=======
/** PNG resize request passed through the media-runtime/plugin SDK surface. */
export type ResizeToPngParams = {
  buffer: Buffer;
  maxSide: number;
  compressionLevel?: number;
  withoutEnlargement?: boolean;
};
>>>>>>> upstream/main

/** Ordered JPEG quality ladder used when shrinking generated or attached images. */
export const IMAGE_REDUCE_QUALITY_STEPS = [85, 75, 65, 55, 45, 35] as const;
/** Shared input/output pixel cap for Rastermill-backed image operations. */
export const MAX_IMAGE_INPUT_PIXELS = 25_000_000;

/** Creates a Rastermill processor with OpenClaw temp-dir, pixel-limit, and command trust policy. */
export function createImageProcessor() {
  return createRastermill({
    execution: "auto",
    limits: {
      inputPixels: MAX_IMAGE_INPUT_PIXELS,
      outputPixels: MAX_IMAGE_INPUT_PIXELS,
    },
    temp: {
      rootDir: resolvePreferredOpenClawTmpDir(),
      prefix: "openclaw-img-",
    },
    commandResolver: (command) =>
      resolveSystemBin(command, { trust: command === "powershell" ? "strict" : "standard" }),
  });
}

/** Detects either OpenClaw's wrapper error or Rastermill's native unavailable error. */
export function isImageProcessorUnavailableError(err: unknown): boolean {
  return err instanceof ImageProcessorUnavailableError || isRastermillUnavailableError(err);
}

/** Builds a descending, de-duplicated max-side search grid for iterative image resizing. */
export function buildImageResizeSideGrid(maxSide: number, sideStart: number): number[] {
  return [sideStart, 1800, 1600, 1400, 1200, 1000, 800]
    .map((value) => Math.min(maxSide, value))
    .filter((value, idx, arr) => value > 0 && arr.indexOf(value) === idx)
    .toSorted((a, b) => b - a);
}

/** Reads dimensions from image header bytes without invoking a full image decode. */
export function readImageMetadataFromHeader(buffer: Buffer): ImageMetadata | null {
  return readRastermillImageMetadataFromHeader(buffer);
}

/** Reads image probe data from header bytes without invoking a full image decode. */
export function readImageProbeFromHeader(buffer: Buffer): ImageProbe | null {
  return readRastermillImageProbeFromHeader(buffer);
}

<<<<<<< HEAD
async function loadSharp(): Promise<(buffer: Buffer) => ReturnType<Sharp>> {
  const mod = (await import("sharp")) as unknown as { default?: Sharp };
  const sharp = mod.default ?? (mod as unknown as Sharp);
  return (buffer) =>
    sharp(buffer, {
      failOnError: false,
      limitInputPixels: MAX_IMAGE_INPUT_PIXELS,
    });
}

function isPositiveImageDimension(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function buildImageMetadata(width: number, height: number): ImageMetadata | null {
  if (!isPositiveImageDimension(width) || !isPositiveImageDimension(height)) {
    return null;
  }
  return { width, height };
}

function readPngMetadata(buffer: Buffer): ImageMetadata | null {
  if (buffer.length < 24) {
    return null;
  }
  if (
    buffer[0] !== 0x89 ||
    buffer[1] !== 0x50 ||
    buffer[2] !== 0x4e ||
    buffer[3] !== 0x47 ||
    buffer[4] !== 0x0d ||
    buffer[5] !== 0x0a ||
    buffer[6] !== 0x1a ||
    buffer[7] !== 0x0a ||
    buffer.toString("ascii", 12, 16) !== "IHDR"
  ) {
    return null;
  }
  return buildImageMetadata(buffer.readUInt32BE(16), buffer.readUInt32BE(20));
}

function readGifMetadata(buffer: Buffer): ImageMetadata | null {
  if (buffer.length < 10) {
    return null;
  }
  const signature = buffer.toString("ascii", 0, 6);
  if (signature !== "GIF87a" && signature !== "GIF89a") {
    return null;
  }
  return buildImageMetadata(buffer.readUInt16LE(6), buffer.readUInt16LE(8));
}

function readWebpMetadata(buffer: Buffer): ImageMetadata | null {
  if (
    buffer.length < 30 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    return null;
  }
  const chunkType = buffer.toString("ascii", 12, 16);
  if (chunkType === "VP8X") {
    if (buffer.length < 30) {
      return null;
    }
    return buildImageMetadata(1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3));
  }
  if (chunkType === "VP8 ") {
    if (buffer.length < 30) {
      return null;
    }
    return buildImageMetadata(buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff);
  }
  if (chunkType === "VP8L") {
    if (buffer.length < 25 || buffer[20] !== 0x2f) {
      return null;
    }
    const bits = buffer[21] | (buffer[22] << 8) | (buffer[23] << 16) | (buffer[24] << 24);
    return buildImageMetadata((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1);
  }
  return null;
}

function readJpegMetadata(buffer: Buffer): ImageMetadata | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;
  while (offset + 8 < buffer.length) {
    while (offset < buffer.length && buffer[offset] === 0xff) {
      offset++;
    }
    if (offset >= buffer.length) {
      return null;
    }

    const marker = buffer[offset];
    offset++;
    if (marker === 0xd8 || marker === 0xd9) {
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      continue;
    }
    if (offset + 1 >= buffer.length) {
      return null;
    }

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) {
      return null;
    }

    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isStartOfFrame) {
      if (segmentLength < 7 || offset + 6 >= buffer.length) {
        return null;
      }
      return buildImageMetadata(buffer.readUInt16BE(offset + 5), buffer.readUInt16BE(offset + 3));
    }

    offset += segmentLength;
  }

  return null;
}

function readImageMetadataFromHeader(buffer: Buffer): ImageMetadata | null {
  return (
    readPngMetadata(buffer) ??
    readGifMetadata(buffer) ??
    readWebpMetadata(buffer) ??
    readJpegMetadata(buffer)
  );
}

function countImagePixels(meta: ImageMetadata): number | null {
  const pixels = meta.width * meta.height;
  return Number.isSafeInteger(pixels) ? pixels : null;
}

function exceedsImagePixelLimit(meta: ImageMetadata): boolean {
  return meta.width > Math.floor(MAX_IMAGE_INPUT_PIXELS / meta.height);
}

function createImagePixelLimitError(meta: ImageMetadata): Error {
  const pixelCount = countImagePixels(meta);
  const detail =
    pixelCount === null
      ? `${meta.width}x${meta.height}`
      : `${meta.width}x${meta.height} (${pixelCount} pixels)`;
  return new Error(
    `Image dimensions exceed the ${MAX_IMAGE_INPUT_PIXELS.toLocaleString("en-US")} pixel input limit: ${detail}`,
  );
}

function validateImagePixelLimit(meta: ImageMetadata): ImageMetadata {
  if (exceedsImagePixelLimit(meta)) {
    throw createImagePixelLimitError(meta);
  }
  return meta;
}

async function readImageMetadataForLimit(buffer: Buffer): Promise<ImageMetadata | null> {
  return readImageMetadataFromHeader(buffer);
}

async function assertImagePixelLimit(buffer: Buffer): Promise<void> {
  const meta = await readImageMetadataForLimit(buffer);
  if (!meta) {
    if (prefersSips()) {
      throw new Error("Unable to determine image dimensions; refusing to process");
    }
    return;
  }
  validateImagePixelLimit(meta);
}

/**
 * Reads EXIF orientation from JPEG buffer.
 * Returns orientation value 1-8, or null if not found/not JPEG.
 *
 * EXIF orientation values:
 * 1 = Normal, 2 = Flip H, 3 = Rotate 180, 4 = Flip V,
 * 5 = Rotate 270 CW + Flip H, 6 = Rotate 90 CW, 7 = Rotate 90 CW + Flip H, 8 = Rotate 270 CW
 */
function readJpegExifOrientation(buffer: Buffer): number | null {
  // Check JPEG magic bytes
  if (buffer.length < 2 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;
  while (offset < buffer.length - 4) {
    // Look for marker
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = buffer[offset + 1];
    // Skip padding FF bytes
    if (marker === 0xff) {
      offset++;
      continue;
    }

    // APP1 marker (EXIF)
    if (marker === 0xe1) {
      const exifStart = offset + 4;

      // Check for "Exif\0\0" header
      if (
        buffer.length > exifStart + 6 &&
        buffer.toString("ascii", exifStart, exifStart + 4) === "Exif" &&
        buffer[exifStart + 4] === 0 &&
        buffer[exifStart + 5] === 0
      ) {
        const tiffStart = exifStart + 6;
        if (buffer.length < tiffStart + 8) {
          return null;
        }

        // Check byte order (II = little-endian, MM = big-endian)
        const byteOrder = buffer.toString("ascii", tiffStart, tiffStart + 2);
        const isLittleEndian = byteOrder === "II";

        const readU16 = (pos: number) =>
          isLittleEndian ? buffer.readUInt16LE(pos) : buffer.readUInt16BE(pos);
        const readU32 = (pos: number) =>
          isLittleEndian ? buffer.readUInt32LE(pos) : buffer.readUInt32BE(pos);

        // Read IFD0 offset
        const ifd0Offset = readU32(tiffStart + 4);
        const ifd0Start = tiffStart + ifd0Offset;
        if (buffer.length < ifd0Start + 2) {
          return null;
        }

        const numEntries = readU16(ifd0Start);
        for (let i = 0; i < numEntries; i++) {
          const entryOffset = ifd0Start + 2 + i * 12;
          if (buffer.length < entryOffset + 12) {
            break;
          }

          const tag = readU16(entryOffset);
          // Orientation tag = 0x0112
          if (tag === 0x0112) {
            const value = readU16(entryOffset + 8);
            return value >= 1 && value <= 8 ? value : null;
          }
        }
      }
      return null;
    }

    // Skip other segments
    if (marker >= 0xe0 && marker <= 0xef) {
      const segmentLength = buffer.readUInt16BE(offset + 2);
      offset += 2 + segmentLength;
      continue;
    }

    // SOF, SOS, or other marker - stop searching
    if (marker === 0xc0 || marker === 0xda) {
      break;
    }

    offset++;
  }

  return null;
}

async function withTempDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-img-"));
  try {
    return await fn(dir);
  } finally {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

async function sipsMetadataFromBuffer(buffer: Buffer): Promise<ImageMetadata | null> {
  return await withTempDir(async (dir) => {
    const input = path.join(dir, "in.img");
    await fs.writeFile(input, buffer);
    const { stdout } = await runExec(
      "/usr/bin/sips",
      ["-g", "pixelWidth", "-g", "pixelHeight", input],
      {
        timeoutMs: 10_000,
        maxBuffer: 512 * 1024,
      },
    );
    const w = stdout.match(/pixelWidth:\s*([0-9]+)/);
    const h = stdout.match(/pixelHeight:\s*([0-9]+)/);
    if (!w?.[1] || !h?.[1]) {
      return null;
    }
    const width = Number.parseInt(w[1], 10);
    const height = Number.parseInt(h[1], 10);
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      return null;
    }
    if (width <= 0 || height <= 0) {
      return null;
    }
    return { width, height };
  });
}

async function sipsResizeToJpeg(params: {
  buffer: Buffer;
  maxSide: number;
  quality: number;
}): Promise<Buffer> {
  return await withTempDir(async (dir) => {
    const input = path.join(dir, "in.img");
    const output = path.join(dir, "out.jpg");
    await fs.writeFile(input, params.buffer);
    await runExec(
      "/usr/bin/sips",
      [
        "-Z",
        String(Math.max(1, Math.round(params.maxSide))),
        "-s",
        "format",
        "jpeg",
        "-s",
        "formatOptions",
        String(Math.max(1, Math.min(100, Math.round(params.quality)))),
        input,
        "--out",
        output,
      ],
      { timeoutMs: 20_000, maxBuffer: 1024 * 1024 },
    );
    return await fs.readFile(output);
  });
}

async function sipsConvertToJpeg(buffer: Buffer): Promise<Buffer> {
  return await withTempDir(async (dir) => {
    const input = path.join(dir, "in.heic");
    const output = path.join(dir, "out.jpg");
    await fs.writeFile(input, buffer);
    await runExec("/usr/bin/sips", ["-s", "format", "jpeg", input, "--out", output], {
      timeoutMs: 20_000,
      maxBuffer: 1024 * 1024,
    });
    return await fs.readFile(output);
  });
=======
function wrapRastermillUnavailable(operation: string, error: unknown): never {
  if (error instanceof RastermillUnavailableError) {
    throw new ImageProcessorUnavailableError(operation, error.message, error.causes);
  }
  throw error;
>>>>>>> upstream/main
}

/** Fully probes image dimensions through Rastermill when header-only metadata is insufficient. */
export async function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null> {
<<<<<<< HEAD
  const metadataForLimit = await readImageMetadataForLimit(buffer).catch(() => null);
  if (metadataForLimit) {
    try {
      return validateImagePixelLimit(metadataForLimit);
    } catch {
      return null;
    }
  }

  if (prefersSips()) {
    return await sipsMetadataFromBuffer(buffer).catch(() => null);
  }

  try {
    const sharp = await loadSharp();
    const meta = await sharp(buffer).metadata();
    const width = Number(meta.width ?? 0);
    const height = Number(meta.height ?? 0);
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      return null;
    }
    if (width <= 0 || height <= 0) {
      return null;
    }
    return validateImagePixelLimit({ width, height });
  } catch {
    return null;
  }
=======
  const info = await createImageProcessor().probe(buffer);
  return info ? { width: info.width, height: info.height } : null;
>>>>>>> upstream/main
}

/** Normalizes EXIF orientation when possible while leaving bytes unchanged if the backend is unavailable. */
export async function normalizeExifOrientation(buffer: Buffer): Promise<Buffer> {
<<<<<<< HEAD
  await assertImagePixelLimit(buffer);

  if (prefersSips()) {
    try {
      const orientation = readJpegExifOrientation(buffer);
      if (!orientation || orientation === 1) {
        return buffer; // No rotation needed
      }
      return await sipsApplyOrientation(buffer, orientation);
    } catch {
      return buffer;
    }
  }

  try {
    const sharp = await loadSharp();
    // .rotate() with no args auto-rotates based on EXIF orientation
    return await sharp(buffer).rotate().toBuffer();
  } catch {
    // Sharp not available or failed - return original buffer
    return buffer;
  }
}

export async function resizeToJpeg(params: {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
}): Promise<Buffer> {
  await assertImagePixelLimit(params.buffer);

  if (prefersSips()) {
    // Normalize EXIF orientation BEFORE resizing (sips resize doesn't auto-rotate)
    const normalized = await normalizeExifOrientationSips(params.buffer);

    // Avoid enlarging by checking dimensions first (sips has no withoutEnlargement flag).
    if (params.withoutEnlargement !== false) {
      const meta = await getImageMetadata(normalized);
      if (meta) {
        const maxDim = Math.max(meta.width, meta.height);
        if (maxDim > 0 && maxDim <= params.maxSide) {
          return await sipsResizeToJpeg({
            buffer: normalized,
            maxSide: maxDim,
            quality: params.quality,
          });
        }
      }
=======
  try {
    const rastermill = createImageProcessor();
    const info = await rastermill.probe(buffer);
    if (!info) {
      return (await rastermill.encode(buffer, { format: "jpeg", autoOrient: true })).data;
    }
    if (!info?.orientation || info.orientation === 1) {
      return buffer;
    }
    return (await rastermill.encode(buffer, { format: "jpeg", autoOrient: true })).data;
  } catch (error) {
    if (isImageProcessorUnavailableError(error)) {
      return buffer;
>>>>>>> upstream/main
    }
    throw error;
  }
}

/** Resizes or encodes image bytes as JPEG through the shared image processor. */
export async function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer> {
  try {
    return (
      await createImageProcessor().encode(params.buffer, {
        format: "jpeg",
        resize: {
          maxSide: params.maxSide,
          enlarge: params.withoutEnlargement === false,
        },
        quality: params.quality,
      })
    ).data;
  } catch (error) {
    return wrapRastermillUnavailable("resizeToJpeg", error);
  }
}

/** Converts HEIC/HEIF-like image bytes into JPEG through the shared image processor. */
export async function convertHeicToJpeg(buffer: Buffer): Promise<Buffer> {
<<<<<<< HEAD
  await assertImagePixelLimit(buffer);

  if (prefersSips()) {
    return await sipsConvertToJpeg(buffer);
=======
  try {
    return (await createImageProcessor().encode(buffer, { format: "jpeg" })).data;
  } catch (error) {
    return wrapRastermillUnavailable("convertHeicToJpeg", error);
>>>>>>> upstream/main
  }
}

/** Detects alpha support using a full transparency probe, falling back to trusted header metadata. */
export async function hasAlphaChannel(buffer: Buffer): Promise<boolean> {
  await assertImagePixelLimit(buffer);

  try {
    return (await createImageProcessor().transparency(buffer)).hasAlphaChannel;
  } catch (error) {
    // Some callers only need the header-declared alpha bit; keep that usable when decode fails.
    const headerHasAlpha = readRastermillImageProbeFromHeader(buffer)?.hasAlpha === true;
    if (isRastermillUnavailableError(error)) {
      return headerHasAlpha;
    }
    if (
      error instanceof RastermillError &&
      error.code === "RASTERMILL_UNDECODABLE" &&
      readRastermillImageProbeFromHeader(buffer)
    ) {
      return headerHasAlpha;
    }
    throw error;
  }
}

<<<<<<< HEAD
/**
 * Resizes an image to PNG format, preserving alpha channel (transparency).
 * Falls back to sharp only (no sips fallback for PNG with alpha).
 */
export async function resizeToPng(params: {
  buffer: Buffer;
  maxSide: number;
  compressionLevel?: number;
  withoutEnlargement?: boolean;
}): Promise<Buffer> {
  await assertImagePixelLimit(params.buffer);

  const sharp = await loadSharp();
  // Compression level 6 is a good balance (0=fastest, 9=smallest)
  const compressionLevel = params.compressionLevel ?? 6;

  return await sharp(params.buffer)
    .rotate() // Auto-rotate based on EXIF if present
    .resize({
      width: params.maxSide,
      height: params.maxSide,
      fit: "inside",
      withoutEnlargement: params.withoutEnlargement !== false,
    })
    .png({ compressionLevel })
    .toBuffer();
=======
/** Resizes or encodes image bytes as PNG through the shared image processor. */
export async function resizeToPng(params: ResizeToPngParams): Promise<Buffer> {
  try {
    return (
      await createImageProcessor().encode(params.buffer, {
        format: "png",
        resize: {
          maxSide: params.maxSide,
          enlarge: params.withoutEnlargement === false,
        },
        ...(params.compressionLevel === undefined
          ? {}
          : { compressionLevel: params.compressionLevel }),
      })
    ).data;
  } catch (error) {
    return wrapRastermillUnavailable("resizeToPng", error);
  }
>>>>>>> upstream/main
}

/** Optimizes PNG bytes under a target size and returns the chosen search parameters. */
export async function optimizeImageToPng(
  buffer: Buffer,
  maxBytes: number,
  options?: { sides?: readonly number[] },
): Promise<{
  buffer: Buffer;
  optimizedSize: number;
  resizeSide: number;
  compressionLevel: number;
}> {
  let out;
  try {
    out = await createImageProcessor().encode(buffer, {
      format: "png",
      maxBytes,
      search: options?.sides === undefined ? {} : { maxSide: options.sides },
    });
  } catch (error) {
    wrapRastermillUnavailable("optimizeImageToPng", error);
  }
  return {
    buffer: out.data,
    optimizedSize: out.bytes,
    resizeSide: out.chosen.maxSide ?? out.width,
    compressionLevel: out.chosen.compressionLevel ?? 6,
  };
}
