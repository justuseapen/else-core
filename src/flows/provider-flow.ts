<<<<<<< HEAD
import type { OpenClawConfig } from "../config/config.js";
import {
  resolveProviderModelPickerEntries,
  resolveProviderWizardOptions,
} from "../plugins/provider-wizard.js";
import { resolvePluginProviders } from "../plugins/providers.runtime.js";
import type { ProviderPlugin } from "../plugins/types.js";
=======
// Provider setup flow configures provider credentials, models, and defaults.
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { normalizePluginsConfig, resolveEffectiveEnableState } from "../plugins/config-state.js";
import * as providerAuthChoices from "../plugins/provider-auth-choices.js";
import * as providerInstallCatalog from "../plugins/provider-install-catalog.js";
>>>>>>> upstream/main
import type { FlowContribution, FlowOption } from "./types.js";
import { sortFlowContributionsByLabel } from "./types.js";

// Provider setup contributions from manifests and install catalogs.
type ProviderFlowScope = "text-inference" | "image-generation" | "music-generation";

const DEFAULT_PROVIDER_FLOW_SCOPE: ProviderFlowScope = "text-inference";

type ProviderSetupFlowOption = FlowOption & {
  onboardingScopes?: ProviderFlowScope[];
  onboardingFeatured?: boolean;
};

type ProviderSetupFlowContribution = FlowContribution & {
  kind: "provider";
  surface: "setup";
  providerId: string;
  pluginId?: string;
  option: ProviderSetupFlowOption;
  onboardingScopes?: ProviderFlowScope[];
<<<<<<< HEAD
  source: "runtime";
};

export type ProviderModelPickerFlowContribution = FlowContribution & {
  kind: "provider";
  surface: "model-picker";
  providerId: string;
  option: ProviderModelPickerFlowEntry;
  source: "runtime";
=======
  source: "manifest" | "install-catalog";
>>>>>>> upstream/main
};

function includesProviderFlowScope(
  scopes: readonly ProviderFlowScope[] | undefined,
  scope: ProviderFlowScope,
): boolean {
  // Missing scope means the historic text-inference onboarding surface only.
  return scopes ? scopes.includes(scope) : scope === DEFAULT_PROVIDER_FLOW_SCOPE;
}

function resolveInstallCatalogProviderSetupFlowContributions(params?: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
<<<<<<< HEAD
}): Map<string, string> {
  return new Map(
    resolvePluginProviders({
      config: params?.config,
      workspaceDir: params?.workspaceDir,
      env: params?.env,
      mode: "setup",
    })
      .filter((provider): provider is ProviderPlugin & { docsPath: string } =>
        Boolean(provider.docsPath?.trim()),
      )
      .map((provider) => [provider.id, provider.docsPath.trim()]),
  );
}

export function resolveProviderSetupFlowOptions(params?: {
=======
  scope?: ProviderFlowScope;
}): ProviderSetupFlowContribution[] {
  const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
  const normalizedPluginsConfig = normalizePluginsConfig(params?.config?.plugins);
  return providerInstallCatalog
    .resolveProviderInstallCatalogEntries({
      ...params,
      includeUntrustedWorkspacePlugins: false,
    })
    .filter(
      (entry) =>
        includesProviderFlowScope(entry.onboardingScopes, scope) &&
        resolveEffectiveEnableState({
          id: entry.pluginId,
          origin: entry.origin,
          config: normalizedPluginsConfig,
          rootConfig: params?.config,
          enabledByDefault: true,
        }).enabled,
    )
    .map((entry) => {
      const groupId = entry.groupId ?? entry.providerId;
      const groupLabel = entry.groupLabel ?? entry.label;
      return Object.assign(
        {
          id: `provider:setup:${entry.choiceId}`,
          kind: `provider` as const,
          surface: `setup` as const,
          providerId: entry.providerId,
          pluginId: entry.pluginId,
          option: {
            value: entry.choiceId,
            label: entry.choiceLabel,
            ...(entry.choiceHint ? { hint: entry.choiceHint } : {}),
            ...(entry.assistantPriority !== undefined
              ? { assistantPriority: entry.assistantPriority }
              : {}),
            ...(entry.assistantVisibility
              ? { assistantVisibility: entry.assistantVisibility }
              : {}),
            group: {
              id: groupId,
              label: groupLabel,
              ...(entry.groupHint ? { hint: entry.groupHint } : {}),
            },
          },
        },
        entry.onboardingScopes ? { onboardingScopes: [...entry.onboardingScopes] } : {},
        { source: `install-catalog` as const },
      );
    });
}

function resolveManifestProviderSetupFlowContributions(params?: {
>>>>>>> upstream/main
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  scope?: ProviderFlowScope;
}): ProviderSetupFlowContribution[] {
  const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
  return providerAuthChoices
    .resolveManifestProviderAuthChoices({
      ...params,
      includeUntrustedWorkspacePlugins: false,
    })
    .filter((choice) => includesProviderFlowScope(choice.onboardingScopes, scope))
    .map((choice) => {
      const groupId = choice.groupId ?? choice.providerId;
      const groupLabel = choice.groupLabel ?? choice.choiceLabel;
      return Object.assign(
        {
          id: `provider:setup:${choice.choiceId}`,
          kind: `provider` as const,
          surface: `setup` as const,
          providerId: choice.providerId,
          pluginId: choice.pluginId,
          option: {
            value: choice.choiceId,
            label: choice.choiceLabel,
            ...(choice.choiceHint ? { hint: choice.choiceHint } : {}),
            ...(choice.assistantPriority !== undefined
              ? { assistantPriority: choice.assistantPriority }
              : {}),
            ...(choice.assistantVisibility
              ? { assistantVisibility: choice.assistantVisibility }
              : {}),
            ...(choice.onboardingFeatured ? { onboardingFeatured: true } : {}),
            group: {
              id: groupId,
              label: groupLabel,
              ...(choice.groupHint ? { hint: choice.groupHint } : {}),
            },
          },
        },
        choice.onboardingScopes ? { onboardingScopes: [...choice.onboardingScopes] } : {},
        { source: `manifest` as const },
      );
    });
}

export function resolveProviderSetupFlowContributions(params?: {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  scope?: ProviderFlowScope;
}): ProviderSetupFlowContribution[] {
  const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
<<<<<<< HEAD
  const docsByProvider = resolveProviderDocsById(params ?? {});
  return sortFlowContributionsByLabel(
    resolveProviderWizardOptions(params ?? {})
      .filter((option) => includesProviderFlowScope(option.onboardingScopes, scope))
      .map((option) => ({
        id: `provider:setup:${option.value}`,
        kind: "provider" as const,
        surface: "setup" as const,
        providerId: option.groupId,
        option: {
          value: option.value,
          label: option.label,
          ...(option.hint ? { hint: option.hint } : {}),
          ...(option.assistantPriority !== undefined
            ? { assistantPriority: option.assistantPriority }
            : {}),
          ...(option.assistantVisibility
            ? { assistantVisibility: option.assistantVisibility }
            : {}),
          group: {
            id: option.groupId,
            label: option.groupLabel,
            ...(option.groupHint ? { hint: option.groupHint } : {}),
          },
          ...(docsByProvider.get(option.groupId)
            ? { docs: { path: docsByProvider.get(option.groupId)! } }
            : {}),
        },
        ...(option.onboardingScopes ? { onboardingScopes: [...option.onboardingScopes] } : {}),
        source: "runtime" as const,
      })),
=======
  const manifestContributions = resolveManifestProviderSetupFlowContributions({
    ...params,
    scope,
  });
  const seenOptionValues = new Set(
    manifestContributions.map((contribution) => contribution.option.value),
>>>>>>> upstream/main
  );
  const installCatalogContributions = resolveInstallCatalogProviderSetupFlowContributions({
    ...params,
    scope,
  }).filter((contribution) => !seenOptionValues.has(contribution.option.value));
  return sortFlowContributionsByLabel([...manifestContributions, ...installCatalogContributions]);
}
