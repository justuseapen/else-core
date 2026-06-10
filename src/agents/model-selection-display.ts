<<<<<<< HEAD
type ModelDisplaySelectionParams = {
  runtimeProvider?: string | null;
  runtimeModel?: string | null;
  overrideProvider?: string | null;
  overrideModel?: string | null;
  fallbackModel?: string | null;
};

export function resolveModelDisplayRef(params: ModelDisplaySelectionParams): string | undefined {
  const runtimeModel = params.runtimeModel?.trim();
  const runtimeProvider = params.runtimeProvider?.trim();
=======
/**
 * Formats selected model references for UI/session display.
 */
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";

/** Inputs used to choose the visible model ref/name for status surfaces. */
type ModelDisplaySelectionParams = {
  runtimeProvider?: unknown;
  runtimeModel?: unknown;
  overrideProvider?: unknown;
  overrideModel?: unknown;
  fallbackModel?: unknown;
};

/** Resolves the most specific provider/model ref for display. */
export function resolveModelDisplayRef(params: ModelDisplaySelectionParams): string | undefined {
  const runtimeModel = normalizeOptionalString(params.runtimeModel);
  const runtimeProvider = normalizeOptionalString(params.runtimeProvider);
>>>>>>> upstream/main
  if (runtimeModel) {
    if (runtimeModel.includes("/")) {
      return runtimeModel;
    }
    if (runtimeProvider) {
      return `${runtimeProvider}/${runtimeModel}`;
    }
    return runtimeModel;
  }
  if (runtimeProvider) {
    return runtimeProvider;
  }

<<<<<<< HEAD
  const overrideModel = params.overrideModel?.trim();
  const overrideProvider = params.overrideProvider?.trim();
=======
  const overrideModel = normalizeOptionalString(params.overrideModel);
  const overrideProvider = normalizeOptionalString(params.overrideProvider);
>>>>>>> upstream/main
  if (overrideModel) {
    if (overrideModel.includes("/")) {
      return overrideModel;
    }
    if (overrideProvider) {
      return `${overrideProvider}/${overrideModel}`;
    }
    return overrideModel;
  }
  if (overrideProvider) {
    return overrideProvider;
  }

<<<<<<< HEAD
  const fallbackModel = params.fallbackModel?.trim();
  return fallbackModel || undefined;
}

=======
  const fallbackModel = normalizeOptionalString(params.fallbackModel);
  return fallbackModel || undefined;
}

/** Resolves the model name shown in compact status output. */
>>>>>>> upstream/main
export function resolveModelDisplayName(params: ModelDisplaySelectionParams): string {
  const modelRef = resolveModelDisplayRef(params);
  if (!modelRef) {
    return "model n/a";
  }
  const slash = modelRef.lastIndexOf("/");
  if (slash >= 0 && slash < modelRef.length - 1) {
    return modelRef.slice(slash + 1);
  }
  return modelRef;
}

<<<<<<< HEAD
type SessionInfoModelSelectionParams = {
  currentProvider?: string | null;
  currentModel?: string | null;
  entryProvider?: string | null;
  entryModel?: string | null;
  overrideProvider?: string | null;
  overrideModel?: string | null;
};

=======
/** Inputs used to resolve model/provider values for session info. */
type SessionInfoModelSelectionParams = {
  currentProvider?: unknown;
  currentModel?: unknown;
  defaultProvider?: unknown;
  defaultModel?: unknown;
  entryProvider?: unknown;
  entryModel?: unknown;
  overrideProvider?: unknown;
  overrideModel?: unknown;
};

/** Resolves session-info model selection from entry, override, and fallback data. */
>>>>>>> upstream/main
export function resolveSessionInfoModelSelection(params: SessionInfoModelSelectionParams): {
  modelProvider?: string;
  model?: string;
} {
<<<<<<< HEAD
  if (params.entryProvider !== undefined || params.entryModel !== undefined) {
    return {
      modelProvider: params.entryProvider ?? params.currentProvider ?? undefined,
      model: params.entryModel ?? params.currentModel ?? undefined,
    };
  }

  const overrideModel = params.overrideModel?.trim();
  if (overrideModel) {
    const overrideProvider = params.overrideProvider?.trim();
    const currentProvider = params.currentProvider ?? undefined;
    return {
      modelProvider: overrideProvider || currentProvider,
=======
  const fallbackProvider =
    normalizeOptionalString(params.currentProvider) ??
    normalizeOptionalString(params.defaultProvider) ??
    undefined;
  const fallbackModel =
    normalizeOptionalString(params.currentModel) ??
    normalizeOptionalString(params.defaultModel) ??
    undefined;

  if (params.entryProvider !== undefined || params.entryModel !== undefined) {
    return {
      modelProvider: normalizeOptionalString(params.entryProvider) ?? fallbackProvider,
      model: normalizeOptionalString(params.entryModel) ?? fallbackModel,
    };
  }

  const overrideModel = normalizeOptionalString(params.overrideModel);
  if (overrideModel) {
    const overrideProvider = normalizeOptionalString(params.overrideProvider);
    return {
      modelProvider: overrideProvider || fallbackProvider,
>>>>>>> upstream/main
      model: overrideModel,
    };
  }

  return {
<<<<<<< HEAD
    modelProvider: params.currentProvider ?? undefined,
    model: params.currentModel ?? undefined,
=======
    modelProvider: fallbackProvider,
    model: fallbackModel,
>>>>>>> upstream/main
  };
}
