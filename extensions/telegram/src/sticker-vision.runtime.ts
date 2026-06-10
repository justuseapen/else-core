<<<<<<< HEAD
=======
// Telegram plugin module implements sticker vision behavior.
>>>>>>> upstream/main
import {
  findModelInCatalog,
  loadModelCatalog,
  modelSupportsVision,
  resolveDefaultModelForAgent,
} from "openclaw/plugin-sdk/agent-runtime";
<<<<<<< HEAD
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-runtime";
=======
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
>>>>>>> upstream/main

export async function resolveStickerVisionSupportRuntime(params: {
  cfg: OpenClawConfig;
  agentId?: string;
}): Promise<boolean> {
  const catalog = await loadModelCatalog({ config: params.cfg });
  const defaultModel = resolveDefaultModelForAgent({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  const entry = findModelInCatalog(catalog, defaultModel.provider, defaultModel.model);
  if (!entry) {
    return false;
  }
  return modelSupportsVision(entry);
}
