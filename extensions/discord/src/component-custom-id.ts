<<<<<<< HEAD
import { parseCustomId, type ComponentParserResult } from "@buape/carbon";

export const DISCORD_COMPONENT_CUSTOM_ID_KEY = "occomp";
export const DISCORD_MODAL_CUSTOM_ID_KEY = "ocmodal";
=======
// Discord plugin module implements component custom id behavior.
import { parseCustomId, type ComponentParserResult } from "./internal/discord.js";

export const DISCORD_COMPONENT_CUSTOM_ID_KEY = "occomp";
export const DISCORD_MODAL_CUSTOM_ID_KEY = "ocmodal";
const ENCODED_CUSTOM_ID_VERSION = "1";

function encodeCustomIdValue(value: string): string {
  return value.replace(/%/g, "%25").replace(/;/g, "%3B");
}

function needsCustomIdEncoding(value: string): boolean {
  return /[%;]/.test(value);
}

function decodeCustomIdValue(value: string): string {
  return value.replace(/%(25|3B)/gi, (match) => (match.toLowerCase() === "%25" ? "%" : ";"));
}

function decodeParsedCustomIdData(
  data: ComponentParserResult["data"],
): ComponentParserResult["data"] {
  if (data.e !== ENCODED_CUSTOM_ID_VERSION) {
    return data;
  }
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "string" ? decodeCustomIdValue(value) : value,
    ]),
  ) as ComponentParserResult["data"];
}
>>>>>>> upstream/main

export function buildDiscordComponentCustomId(params: {
  componentId: string;
  modalId?: string;
}): string {
<<<<<<< HEAD
  const base = `${DISCORD_COMPONENT_CUSTOM_ID_KEY}:cid=${params.componentId}`;
  return params.modalId ? `${base};mid=${params.modalId}` : base;
}

export function buildDiscordModalCustomId(modalId: string): string {
  return `${DISCORD_MODAL_CUSTOM_ID_KEY}:mid=${modalId}`;
=======
  const encoded =
    needsCustomIdEncoding(params.componentId) || needsCustomIdEncoding(params.modalId ?? "");
  const componentId = encoded ? encodeCustomIdValue(params.componentId) : params.componentId;
  const base = encoded
    ? `${DISCORD_COMPONENT_CUSTOM_ID_KEY}:e=${ENCODED_CUSTOM_ID_VERSION};cid=${componentId}`
    : `${DISCORD_COMPONENT_CUSTOM_ID_KEY}:cid=${componentId}`;
  const modalId = params.modalId;
  if (!modalId) {
    return base;
  }
  return `${base};mid=${encoded ? encodeCustomIdValue(modalId) : modalId}`;
}

export function buildDiscordModalCustomId(modalId: string): string {
  return needsCustomIdEncoding(modalId)
    ? `${DISCORD_MODAL_CUSTOM_ID_KEY}:e=${ENCODED_CUSTOM_ID_VERSION};mid=${encodeCustomIdValue(modalId)}`
    : `${DISCORD_MODAL_CUSTOM_ID_KEY}:mid=${modalId}`;
>>>>>>> upstream/main
}

export function parseDiscordComponentCustomId(
  id: string,
): { componentId: string; modalId?: string } | null {
  const parsed = parseCustomId(id);
  if (parsed.key !== DISCORD_COMPONENT_CUSTOM_ID_KEY) {
    return null;
  }
<<<<<<< HEAD
  const componentId = parsed.data.cid;
  if (typeof componentId !== "string" || !componentId.trim()) {
    return null;
  }
  const modalId = parsed.data.mid;
=======
  const data = decodeParsedCustomIdData(parsed.data);
  const componentId = data.cid;
  if (typeof componentId !== "string" || !componentId.trim()) {
    return null;
  }
  const modalId = data.mid;
>>>>>>> upstream/main
  return {
    componentId,
    modalId: typeof modalId === "string" && modalId.trim() ? modalId : undefined,
  };
}

export function parseDiscordModalCustomId(id: string): string | null {
  const parsed = parseCustomId(id);
  if (parsed.key !== DISCORD_MODAL_CUSTOM_ID_KEY) {
    return null;
  }
<<<<<<< HEAD
  const modalId = parsed.data.mid;
=======
  const data = decodeParsedCustomIdData(parsed.data);
  const modalId = data.mid;
>>>>>>> upstream/main
  if (typeof modalId !== "string" || !modalId.trim()) {
    return null;
  }
  return modalId;
}

function isDiscordComponentWildcardRegistrationId(id: string): boolean {
  return /^__openclaw_discord_component_[a-z_]+_wildcard__$/.test(id);
}

<<<<<<< HEAD
export function parseDiscordComponentCustomIdForCarbon(id: string): ComponentParserResult {
=======
export function parseDiscordComponentCustomIdForInteraction(id: string): ComponentParserResult {
>>>>>>> upstream/main
  if (id === "*" || isDiscordComponentWildcardRegistrationId(id)) {
    return { key: "*", data: {} };
  }
  const parsed = parseCustomId(id);
  if (parsed.key !== DISCORD_COMPONENT_CUSTOM_ID_KEY) {
    return parsed;
  }
<<<<<<< HEAD
  return { key: "*", data: parsed.data };
}

export function parseDiscordModalCustomIdForCarbon(id: string): ComponentParserResult {
=======
  return { key: "*", data: decodeParsedCustomIdData(parsed.data) };
}

export function parseDiscordModalCustomIdForInteraction(id: string): ComponentParserResult {
>>>>>>> upstream/main
  if (id === "*" || isDiscordComponentWildcardRegistrationId(id)) {
    return { key: "*", data: {} };
  }
  const parsed = parseCustomId(id);
  if (parsed.key !== DISCORD_MODAL_CUSTOM_ID_KEY) {
    return parsed;
  }
<<<<<<< HEAD
  return { key: "*", data: parsed.data };
=======
  return { key: "*", data: decodeParsedCustomIdData(parsed.data) };
>>>>>>> upstream/main
}
