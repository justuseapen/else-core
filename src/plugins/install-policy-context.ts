<<<<<<< HEAD
=======
// Builds install policy context for plugin install checks.
>>>>>>> upstream/main
import type {
  PluginHookBeforeInstallBuiltinScan,
  PluginHookBeforeInstallContext,
  PluginHookBeforeInstallEvent,
  PluginHookBeforeInstallPlugin,
  PluginHookBeforeInstallRequest,
  PluginHookBeforeInstallSkill,
  PluginInstallSourcePathKind,
  PluginInstallTargetType,
} from "./types.js";

/**
 * Centralized builder for the public before_install hook contract.
 *
 * Keep all payload shaping here so partner feedback lands in one place instead
 * of drifting across individual install codepaths.
 */
export type BeforeInstallHookPayloadParams = {
  targetType: PluginInstallTargetType;
  targetName: string;
  origin?: string;
  sourcePath: string;
  sourcePathKind: PluginInstallSourcePathKind;
  request: PluginHookBeforeInstallRequest;
<<<<<<< HEAD
  builtinScan: PluginHookBeforeInstallBuiltinScan;
=======
  builtinScan?: PluginHookBeforeInstallBuiltinScan;
>>>>>>> upstream/main
  skill?: PluginHookBeforeInstallSkill;
  plugin?: PluginHookBeforeInstallPlugin;
};

<<<<<<< HEAD
=======
function emptyBuiltinScan(): PluginHookBeforeInstallBuiltinScan {
  return {
    status: "ok",
    scannedFiles: 0,
    critical: 0,
    warn: 0,
    info: 0,
    findings: [],
  };
}

>>>>>>> upstream/main
export function createBeforeInstallHookPayload(params: BeforeInstallHookPayloadParams): {
  ctx: PluginHookBeforeInstallContext;
  event: PluginHookBeforeInstallEvent;
} {
  const event: PluginHookBeforeInstallEvent = {
    targetType: params.targetType,
    targetName: params.targetName,
    sourcePath: params.sourcePath,
    sourcePathKind: params.sourcePathKind,
    ...(params.origin ? { origin: params.origin } : {}),
    request: params.request,
<<<<<<< HEAD
    builtinScan: params.builtinScan,
=======
    builtinScan: params.builtinScan ?? emptyBuiltinScan(),
>>>>>>> upstream/main
    ...(params.skill ? { skill: params.skill } : {}),
    ...(params.plugin ? { plugin: params.plugin } : {}),
  };

  const ctx: PluginHookBeforeInstallContext = {
    targetType: params.targetType,
    requestKind: params.request.kind,
    ...(params.origin ? { origin: params.origin } : {}),
  };

  return { event, ctx };
}
