<<<<<<< HEAD
import { iterateBootstrapChannelPlugins } from "../channels/plugins/bootstrap-registry.js";
=======
/** Defines unsupported secret-ref surfaces and operator-facing policy messages. */
import { GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "../config/bundled-channel-config-metadata.generated.js";
>>>>>>> upstream/main
import { isRecord } from "../utils.js";

const CORE_UNSUPPORTED_SECRETREF_SURFACE_PATTERNS = [
  "commands.ownerDisplaySecret",
  "hooks.token",
  "hooks.gmail.pushToken",
  "hooks.mappings[].sessionKey",
  "auth-profiles.oauth.*",
] as const;

<<<<<<< HEAD
function collectChannelUnsupportedSecretRefSurfacePatterns(): string[] {
  const patterns: string[] = [];
  for (const plugin of iterateBootstrapChannelPlugins()) {
    patterns.push(...(plugin.secrets?.unsupportedSecretRefSurfacePatterns ?? []));
  }
  return patterns;
}

let cachedUnsupportedSecretRefSurfacePatterns: string[] | null = null;

export function getUnsupportedSecretRefSurfacePatterns(): string[] {
  cachedUnsupportedSecretRefSurfacePatterns ??= [
    ...CORE_UNSUPPORTED_SECRETREF_SURFACE_PATTERNS,
    ...collectChannelUnsupportedSecretRefSurfacePatterns(),
  ];
  return cachedUnsupportedSecretRefSurfacePatterns;
}

=======
const CORE_UNSUPPORTED_SECRETREF_CONFIG_CANDIDATE_PATTERNS = [
  "commands.ownerDisplaySecret",
  "hooks.token",
  "hooks.gmail.pushToken",
  "hooks.mappings[].sessionKey",
] as const;

type PatternToken =
  | { kind: "key"; key: string }
  | { kind: "array"; key: string }
  | { kind: "wildcard" };

const bundledChannelUnsupportedSecretRefSurfacePatterns = [
  ...new Set(
    GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.flatMap((entry) =>
      "unsupportedSecretRefSurfacePatterns" in entry
        ? (entry.unsupportedSecretRefSurfacePatterns ?? [])
        : [],
    ),
  ),
];

const unsupportedSecretRefSurfacePatterns = [
  ...CORE_UNSUPPORTED_SECRETREF_SURFACE_PATTERNS,
  ...bundledChannelUnsupportedSecretRefSurfacePatterns,
];

// Candidate scanning only sees openclaw.json; auth-profile-only surfaces are audited elsewhere.
const unsupportedSecretRefConfigCandidatePatterns = [
  ...CORE_UNSUPPORTED_SECRETREF_CONFIG_CANDIDATE_PATTERNS,
  ...bundledChannelUnsupportedSecretRefSurfacePatterns,
];

const parsedPatternCache = new Map<string, PatternToken[]>();

function parseUnsupportedSecretRefSurfacePattern(pattern: string): PatternToken[] {
  const cached = parsedPatternCache.get(pattern);
  if (cached) {
    return cached;
  }
  const parsed = pattern
    .split(".")
    .filter((segment) => segment.length > 0)
    .map<PatternToken>((segment) => {
      if (segment === "*") {
        return { kind: "wildcard" };
      }
      if (segment.endsWith("[]")) {
        return {
          kind: "array",
          key: segment.slice(0, -2),
        };
      }
      return {
        kind: "key",
        key: segment,
      };
    });
  parsedPatternCache.set(pattern, parsed);
  return parsed;
}

function collectPatternCandidates(params: {
  current: unknown;
  tokens: readonly PatternToken[];
  tokenIndex: number;
  pathSegments: string[];
  candidates: UnsupportedSecretRefConfigCandidate[];
}): void {
  if (params.tokenIndex >= params.tokens.length) {
    params.candidates.push({
      path: params.pathSegments.join("."),
      value: params.current,
    });
    return;
  }

  const token = params.tokens[params.tokenIndex];
  if (!token) {
    return;
  }

  if (token.kind === "wildcard") {
    if (Array.isArray(params.current)) {
      // Wildcards traverse both objects and arrays because plugin/channel configs use both
      // shapes for owner-defined maps.
      for (const [index, value] of params.current.entries()) {
        collectPatternCandidates({
          ...params,
          current: value,
          tokenIndex: params.tokenIndex + 1,
          pathSegments: [...params.pathSegments, String(index)],
        });
      }
      return;
    }
    if (!isRecord(params.current)) {
      return;
    }
    for (const [key, value] of Object.entries(params.current)) {
      collectPatternCandidates({
        ...params,
        current: value,
        tokenIndex: params.tokenIndex + 1,
        pathSegments: [...params.pathSegments, key],
      });
    }
    return;
  }

  if (!isRecord(params.current)) {
    return;
  }

  if (token.kind === "array") {
    if (!Object.hasOwn(params.current, token.key)) {
      return;
    }
    const value = params.current[token.key];
    if (!Array.isArray(value)) {
      return;
    }
    // Array tokens preserve the named field in the reported path, matching config dot-paths.
    for (const [index, entry] of value.entries()) {
      collectPatternCandidates({
        ...params,
        current: entry,
        tokenIndex: params.tokenIndex + 1,
        pathSegments: [...params.pathSegments, token.key, String(index)],
      });
    }
    return;
  }

  if (!Object.hasOwn(params.current, token.key)) {
    return;
  }
  collectPatternCandidates({
    ...params,
    current: params.current[token.key],
    tokenIndex: params.tokenIndex + 1,
    pathSegments: [...params.pathSegments, token.key],
  });
}

/**
 * Returns canonical config/auth-profile path patterns that do not support SecretRef values.
 */
export function getUnsupportedSecretRefSurfacePatterns(): string[] {
  return [...unsupportedSecretRefSurfacePatterns];
}

/**
 * Concrete unsupported config value discovered from an openclaw.json-like object.
 */
>>>>>>> upstream/main
export type UnsupportedSecretRefConfigCandidate = {
  path: string;
  value: unknown;
};

<<<<<<< HEAD
=======
/**
 * Finds configured openclaw.json values whose surfaces currently reject SecretRef objects.
 */
>>>>>>> upstream/main
export function collectUnsupportedSecretRefConfigCandidates(
  raw: unknown,
): UnsupportedSecretRefConfigCandidate[] {
  if (!isRecord(raw)) {
    return [];
  }

  const candidates: UnsupportedSecretRefConfigCandidate[] = [];
<<<<<<< HEAD

  const commands = isRecord(raw.commands) ? raw.commands : null;
  if (commands) {
    candidates.push({
      path: "commands.ownerDisplaySecret",
      value: commands.ownerDisplaySecret,
    });
  }

  const hooks = isRecord(raw.hooks) ? raw.hooks : null;
  if (hooks) {
    candidates.push({ path: "hooks.token", value: hooks.token });

    const gmail = isRecord(hooks.gmail) ? hooks.gmail : null;
    if (gmail) {
      candidates.push({
        path: "hooks.gmail.pushToken",
        value: gmail.pushToken,
      });
    }

    const mappings = hooks.mappings;
    if (Array.isArray(mappings)) {
      for (const [index, mapping] of mappings.entries()) {
        if (!isRecord(mapping)) {
          continue;
        }
        candidates.push({
          path: `hooks.mappings.${index}.sessionKey`,
          value: mapping.sessionKey,
        });
      }
    }
  }

  if (isRecord(raw.channels)) {
    for (const plugin of iterateBootstrapChannelPlugins()) {
      const channelCandidates = plugin.secrets?.collectUnsupportedSecretRefConfigCandidates?.(raw);
      if (!channelCandidates?.length) {
        continue;
      }
      candidates.push(...channelCandidates);
    }
  }

=======
  for (const pattern of unsupportedSecretRefConfigCandidatePatterns) {
    collectPatternCandidates({
      current: raw,
      tokens: parseUnsupportedSecretRefSurfacePattern(pattern),
      tokenIndex: 0,
      pathSegments: [],
      candidates,
    });
  }
>>>>>>> upstream/main
  return candidates;
}
