<<<<<<< HEAD
import crypto from "node:crypto";
import type { AgentToolResult } from "@mariozechner/pi-agent-core";
=======
/**
 * Nodes media action executor.
 *
 * Captures camera/photos/screen media from paired nodes and formats media-safe tool results.
 */
import crypto from "node:crypto";
import { imageMimeFromFormat } from "@openclaw/media-core/mime";
import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
>>>>>>> upstream/main
import {
  type CameraFacing,
  cameraTempPath,
  parseCameraClipPayload,
  parseCameraSnapPayload,
  writeCameraClipPayloadToFile,
  writeCameraPayloadToFile,
} from "../../cli/nodes-camera.js";
import {
  parseScreenRecordPayload,
  screenRecordTempPath,
  writeScreenRecordToFile,
} from "../../cli/nodes-screen.js";
import { parseDurationMs } from "../../cli/parse-duration.js";
<<<<<<< HEAD
import { imageMimeFromFormat } from "../../media/mime.js";
import type { ImageSanitizationLimits } from "../image-sanitization.js";
import { sanitizeToolResultImages } from "../tool-images.js";
=======
import type { ImageSanitizationLimits } from "../image-sanitization.js";
import type { AgentToolResult } from "../runtime/index.js";
import { sanitizeToolResultImages } from "../tool-images.js";
import {
  readFiniteNumberParam,
  readNonNegativeIntegerParam,
  readPositiveIntegerParam,
} from "./common.js";
>>>>>>> upstream/main
import type { GatewayCallOptions } from "./gateway.js";
import { callGatewayTool } from "./gateway.js";
import { resolveNode, resolveNodeId } from "./nodes-utils.js";

export const MEDIA_INVOKE_ACTIONS = {
  "camera.snap": "camera_snap",
  "camera.clip": "camera_clip",
  "photos.latest": "photos_latest",
  "screen.record": "screen_record",
<<<<<<< HEAD
} as const;

export type NodeMediaAction = "camera_snap" | "photos_latest" | "camera_clip" | "screen_record";
=======
  // file-transfer commands: redirect to dedicated tools for better result
  // formatting and media-store handling. The gateway still enforces the
  // underlying node-invoke path policy for raw callers.
  "file.fetch": "file_fetch",
  "dir.list": "dir_list",
  "dir.fetch": "dir_fetch",
  "file.write": "file_write",
} as const;

// Subset of MEDIA_INVOKE_ACTIONS where the dedicated tool is the preferred
// agent UX. Gateway node-invoke policy still protects raw node.invoke callers.
export const POLICY_REDIRECT_INVOKE_COMMANDS: ReadonlySet<string> = new Set([
  "file.fetch",
  "dir.list",
  "dir.fetch",
  "file.write",
]);

export type NodeMediaAction = "camera_snap" | "photos_latest" | "camera_clip" | "screen_record";
const MAX_RECORDING_DURATION_MS = 300_000;
>>>>>>> upstream/main

type ExecuteNodeMediaActionParams = {
  action: NodeMediaAction;
  params: Record<string, unknown>;
  gatewayOpts: GatewayCallOptions;
  modelHasVision?: boolean;
  imageSanitization: ImageSanitizationLimits;
};

export async function executeNodeMediaAction(
  input: ExecuteNodeMediaActionParams,
): Promise<AgentToolResult<unknown>> {
  switch (input.action) {
    case "camera_snap":
      return await executeCameraSnap(input);
    case "photos_latest":
      return await executePhotosLatest(input);
    case "camera_clip":
      return await executeCameraClip(input);
    case "screen_record":
      return await executeScreenRecord(input);
  }
<<<<<<< HEAD
=======
  throw new Error("Unsupported node media action");
>>>>>>> upstream/main
}

async function executeCameraSnap({
  params,
  gatewayOpts,
  modelHasVision,
  imageSanitization,
}: ExecuteNodeMediaActionParams): Promise<AgentToolResult<unknown>> {
  const node = requireString(params, "node");
  const resolvedNode = await resolveNode(gatewayOpts, node);
  const nodeId = resolvedNode.nodeId;
<<<<<<< HEAD
  const facingRaw = typeof params.facing === "string" ? params.facing.toLowerCase() : "front";
=======
  const facingRaw = normalizeLowercaseStringOrEmpty(params.facing) || "front";
>>>>>>> upstream/main
  const facings: CameraFacing[] =
    facingRaw === "both"
      ? ["front", "back"]
      : facingRaw === "front" || facingRaw === "back"
        ? [facingRaw]
        : (() => {
            throw new Error("invalid facing (front|back|both)");
          })();
<<<<<<< HEAD
  const maxWidth =
    typeof params.maxWidth === "number" && Number.isFinite(params.maxWidth)
      ? params.maxWidth
      : 1600;
  const quality =
    typeof params.quality === "number" && Number.isFinite(params.quality) ? params.quality : 0.95;
  const delayMs =
    typeof params.delayMs === "number" && Number.isFinite(params.delayMs)
      ? params.delayMs
      : undefined;
=======
  const maxWidth = readPositiveIntegerParam(params, "maxWidth") ?? 1600;
  const quality =
    readFiniteNumberParam(params, "quality", {
      min: 0,
      max: 1,
      message: "quality must be between 0 and 1",
    }) ?? 0.95;
  const delayMs = readNonNegativeIntegerParam(params, "delayMs");
>>>>>>> upstream/main
  const deviceId =
    typeof params.deviceId === "string" && params.deviceId.trim()
      ? params.deviceId.trim()
      : undefined;
  if (deviceId && facings.length > 1) {
    throw new Error("facing=both is not allowed when deviceId is set");
  }

  const content: AgentToolResult<unknown>["content"] = [];
  const details: Array<Record<string, unknown>> = [];

  for (const facing of facings) {
    const raw = await callGatewayTool<{ payload: unknown }>("node.invoke", gatewayOpts, {
      nodeId,
      command: "camera.snap",
      params: {
        facing,
        maxWidth,
        quality,
        format: "jpg",
        delayMs,
        deviceId,
      },
      idempotencyKey: crypto.randomUUID(),
    });
    const payload = parseCameraSnapPayload(raw?.payload);
<<<<<<< HEAD
    const normalizedFormat = payload.format.toLowerCase();
=======
    const normalizedFormat = normalizeLowercaseStringOrEmpty(payload.format);
>>>>>>> upstream/main
    if (normalizedFormat !== "jpg" && normalizedFormat !== "jpeg" && normalizedFormat !== "png") {
      throw new Error(`unsupported camera.snap format: ${payload.format}`);
    }

    const isJpeg = normalizedFormat === "jpg" || normalizedFormat === "jpeg";
    const filePath = cameraTempPath({
      kind: "snap",
      facing,
      ext: isJpeg ? "jpg" : "png",
    });
    await writeCameraPayloadToFile({
      filePath,
      payload,
      expectedHost: resolvedNode.remoteIp,
      invalidPayloadMessage: "invalid camera.snap payload",
    });
    if (modelHasVision && payload.base64) {
      content.push({
        type: "image",
        data: payload.base64,
        mimeType: imageMimeFromFormat(payload.format) ?? (isJpeg ? "image/jpeg" : "image/png"),
      });
    }
    details.push({
      facing,
      path: filePath,
      width: payload.width,
      height: payload.height,
    });
  }

  return await sanitizeToolResultImages(
    {
      content,
      details: {
        snaps: details,
        media: {
          mediaUrls: details
            .map((entry) => entry.path)
            .filter((path): path is string => typeof path === "string"),
        },
      },
    },
    "nodes:camera_snap",
    imageSanitization,
  );
}

async function executePhotosLatest({
  params,
  gatewayOpts,
  modelHasVision,
  imageSanitization,
}: ExecuteNodeMediaActionParams): Promise<AgentToolResult<unknown>> {
  const node = requireString(params, "node");
  const resolvedNode = await resolveNode(gatewayOpts, node);
  const nodeId = resolvedNode.nodeId;
<<<<<<< HEAD
  const limitRaw =
    typeof params.limit === "number" && Number.isFinite(params.limit)
      ? Math.floor(params.limit)
      : DEFAULT_PHOTOS_LIMIT;
  const limit = Math.max(1, Math.min(limitRaw, MAX_PHOTOS_LIMIT));
  const maxWidth =
    typeof params.maxWidth === "number" && Number.isFinite(params.maxWidth)
      ? params.maxWidth
      : DEFAULT_PHOTOS_MAX_WIDTH;
  const quality =
    typeof params.quality === "number" && Number.isFinite(params.quality)
      ? params.quality
      : DEFAULT_PHOTOS_QUALITY;
=======
  const limit = Math.min(
    readPositiveIntegerParam(params, "limit") ?? DEFAULT_PHOTOS_LIMIT,
    MAX_PHOTOS_LIMIT,
  );
  const maxWidth = readPositiveIntegerParam(params, "maxWidth") ?? DEFAULT_PHOTOS_MAX_WIDTH;
  const quality =
    readFiniteNumberParam(params, "quality", {
      min: 0,
      max: 1,
      message: "quality must be between 0 and 1",
    }) ?? DEFAULT_PHOTOS_QUALITY;
>>>>>>> upstream/main
  const raw = await callGatewayTool<{ payload: unknown }>("node.invoke", gatewayOpts, {
    nodeId,
    command: "photos.latest",
    params: {
      limit,
      maxWidth,
      quality,
    },
    idempotencyKey: crypto.randomUUID(),
  });
  const payload =
    raw?.payload && typeof raw.payload === "object" && !Array.isArray(raw.payload)
      ? (raw.payload as Record<string, unknown>)
      : {};
  const photos = Array.isArray(payload.photos) ? payload.photos : [];

  if (photos.length === 0) {
    return await sanitizeToolResultImages(
      {
        content: [],
        details: [],
      },
      "nodes:photos_latest",
      imageSanitization,
    );
  }

  const content: AgentToolResult<unknown>["content"] = [];
  const details: Array<Record<string, unknown>> = [];

  for (const [index, photoRaw] of photos.entries()) {
    const photo = parseCameraSnapPayload(photoRaw);
<<<<<<< HEAD
    const normalizedFormat = photo.format.toLowerCase();
=======
    const normalizedFormat = normalizeLowercaseStringOrEmpty(photo.format);
>>>>>>> upstream/main
    if (normalizedFormat !== "jpg" && normalizedFormat !== "jpeg" && normalizedFormat !== "png") {
      throw new Error(`unsupported photos.latest format: ${photo.format}`);
    }
    const isJpeg = normalizedFormat === "jpg" || normalizedFormat === "jpeg";
    const filePath = cameraTempPath({
      kind: "snap",
      ext: isJpeg ? "jpg" : "png",
      id: crypto.randomUUID(),
    });
    await writeCameraPayloadToFile({
      filePath,
      payload: photo,
      expectedHost: resolvedNode.remoteIp,
      invalidPayloadMessage: "invalid photos.latest payload",
    });

    if (modelHasVision && photo.base64) {
      content.push({
        type: "image",
        data: photo.base64,
        mimeType: imageMimeFromFormat(photo.format) ?? (isJpeg ? "image/jpeg" : "image/png"),
      });
    }

    const createdAt =
      photoRaw && typeof photoRaw === "object" && !Array.isArray(photoRaw)
        ? (photoRaw as Record<string, unknown>).createdAt
        : undefined;
    details.push({
      index,
      path: filePath,
      width: photo.width,
      height: photo.height,
      ...(typeof createdAt === "string" ? { createdAt } : {}),
    });
  }

  return await sanitizeToolResultImages(
    {
      content,
      details: {
        photos: details,
        media: {
          mediaUrls: details
            .map((entry) => entry.path)
            .filter((path): path is string => typeof path === "string"),
        },
      },
    },
    "nodes:photos_latest",
    imageSanitization,
  );
}

async function executeCameraClip({
  params,
  gatewayOpts,
}: ExecuteNodeMediaActionParams): Promise<AgentToolResult<unknown>> {
  const node = requireString(params, "node");
  const resolvedNode = await resolveNode(gatewayOpts, node);
  const nodeId = resolvedNode.nodeId;
<<<<<<< HEAD
  const facing = typeof params.facing === "string" ? params.facing.toLowerCase() : "front";
  if (facing !== "front" && facing !== "back") {
    throw new Error("invalid facing (front|back)");
  }
  const durationMs =
    typeof params.durationMs === "number" && Number.isFinite(params.durationMs)
      ? params.durationMs
      : typeof params.duration === "string"
        ? parseDurationMs(params.duration)
        : 3000;
=======
  const facing = normalizeLowercaseStringOrEmpty(params.facing) || "front";
  if (facing !== "front" && facing !== "back") {
    throw new Error("invalid facing (front|back)");
  }
  const durationMs = Math.min(
    readPositiveIntegerParam(params, "durationMs") ??
      (typeof params.duration === "string" ? parseDurationMs(params.duration) : 3000),
    MAX_RECORDING_DURATION_MS,
  );
>>>>>>> upstream/main
  const includeAudio = typeof params.includeAudio === "boolean" ? params.includeAudio : true;
  const deviceId =
    typeof params.deviceId === "string" && params.deviceId.trim()
      ? params.deviceId.trim()
      : undefined;
  const raw = await callGatewayTool<{ payload: unknown }>("node.invoke", gatewayOpts, {
    nodeId,
    command: "camera.clip",
    params: {
      facing,
      durationMs,
      includeAudio,
      format: "mp4",
      deviceId,
    },
    idempotencyKey: crypto.randomUUID(),
  });
  const payload = parseCameraClipPayload(raw?.payload);
  const filePath = await writeCameraClipPayloadToFile({
    payload,
    facing,
    expectedHost: resolvedNode.remoteIp,
  });
  return {
    content: [{ type: "text", text: `FILE:${filePath}` }],
    details: {
      facing,
      path: filePath,
      durationMs: payload.durationMs,
      hasAudio: payload.hasAudio,
    },
  };
}

async function executeScreenRecord({
  params,
  gatewayOpts,
}: ExecuteNodeMediaActionParams): Promise<AgentToolResult<unknown>> {
  const node = requireString(params, "node");
  const nodeId = await resolveNodeId(gatewayOpts, node);
  const durationMs = Math.min(
<<<<<<< HEAD
    typeof params.durationMs === "number" && Number.isFinite(params.durationMs)
      ? params.durationMs
      : typeof params.duration === "string"
        ? parseDurationMs(params.duration)
        : 10_000,
    300_000,
  );
  const fps = typeof params.fps === "number" && Number.isFinite(params.fps) ? params.fps : 10;
  const screenIndex =
    typeof params.screenIndex === "number" && Number.isFinite(params.screenIndex)
      ? params.screenIndex
      : 0;
=======
    readPositiveIntegerParam(params, "durationMs") ??
      (typeof params.duration === "string" ? parseDurationMs(params.duration) : 10_000),
    MAX_RECORDING_DURATION_MS,
  );
  const fps =
    readFiniteNumberParam(params, "fps", {
      min: 0,
      minExclusive: true,
      message: "fps must be greater than 0",
    }) ?? 10;
  const screenIndex = readNonNegativeIntegerParam(params, "screenIndex") ?? 0;
>>>>>>> upstream/main
  const includeAudio = typeof params.includeAudio === "boolean" ? params.includeAudio : true;
  const raw = await callGatewayTool<{ payload: unknown }>("node.invoke", gatewayOpts, {
    nodeId,
    command: "screen.record",
    params: {
      durationMs,
      screenIndex,
      fps,
      format: "mp4",
      includeAudio,
    },
    idempotencyKey: crypto.randomUUID(),
  });
  const payload = parseScreenRecordPayload(raw?.payload);
  const filePath =
    typeof params.outPath === "string" && params.outPath.trim()
      ? params.outPath.trim()
      : screenRecordTempPath({ ext: payload.format || "mp4" });
  const written = await writeScreenRecordToFile(filePath, payload.base64);
  return {
    content: [{ type: "text", text: `FILE:${written.path}` }],
    details: {
      path: written.path,
      durationMs: payload.durationMs,
      fps: payload.fps,
      screenIndex: payload.screenIndex,
      hasAudio: payload.hasAudio,
    },
  };
}

function requireString(params: Record<string, unknown>, key: string): string {
  const raw = params[key];
  if (typeof raw !== "string" || raw.trim().length === 0) {
    throw new Error(`${key} required`);
  }
  return raw.trim();
}

const DEFAULT_PHOTOS_LIMIT = 1;
const MAX_PHOTOS_LIMIT = 20;
const DEFAULT_PHOTOS_MAX_WIDTH = 1600;
const DEFAULT_PHOTOS_QUALITY = 0.85;
