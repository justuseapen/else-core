<<<<<<< HEAD
export function parseVideoGenerationModelRef(
  raw: string | undefined,
): { provider: string; model: string } | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }
  const slashIndex = trimmed.indexOf("/");
  if (slashIndex <= 0 || slashIndex === trimmed.length - 1) {
    return null;
  }
  return {
    provider: trimmed.slice(0, slashIndex).trim(),
    model: trimmed.slice(slashIndex + 1).trim(),
  };
=======
// Video model ref helpers parse provider-qualified video generation model ids.
import { parseGenerationModelRef } from "../../packages/media-generation-core/src/model-ref.js";

// Video model refs share the generic media-generation provider/model grammar:
// "provider/model" when explicit, otherwise null for default resolution.
export function parseVideoGenerationModelRef(
  raw: string | undefined,
): { provider: string; model: string } | null {
  return parseGenerationModelRef(raw);
>>>>>>> upstream/main
}
