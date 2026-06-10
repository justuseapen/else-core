<<<<<<< HEAD
export type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;

export type OutboundMediaAccess = {
  localRoots?: readonly string[];
  readFile?: OutboundMediaReadFile;
  /** Agent workspace directory for resolving relative MEDIA: paths. */
  workspaceDir?: string;
};

export type OutboundMediaLoadParams = {
  maxBytes?: number;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: OutboundMediaReadFile;
  optimizeImages?: boolean;
  /** Agent workspace directory for resolving relative MEDIA: paths. */
=======
/** Host callback used to read an already-authorized outbound media file. */
export type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;

/** Host-provided file access used when a runtime can read outbound media from local disk. */
export type OutboundMediaAccess = {
  localRoots?: readonly string[];
  readFile?: OutboundMediaReadFile;
  /** Agent workspace directory for resolving relative media paths. */
  workspaceDir?: string;
};

/** Legacy and current knobs accepted by outbound media loaders before normalization. */
export type OutboundMediaLoadParams = {
  maxBytes?: number;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[] | "any";
  mediaReadFile?: OutboundMediaReadFile;
  proxyUrl?: string;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  requestInit?: RequestInit;
  trustExplicitProxyDns?: boolean;
  optimizeImages?: boolean;
  /** Agent workspace directory for resolving relative media paths. */
>>>>>>> upstream/main
  workspaceDir?: string;
};

/** Normalized outbound media loader options consumed by fetch/local media helpers. */
export type OutboundMediaLoadOptions = {
  maxBytes?: number;
  localRoots?: readonly string[] | "any";
  readFile?: (filePath: string) => Promise<Buffer>;
<<<<<<< HEAD
  hostReadCapability?: boolean;
  optimizeImages?: boolean;
  /** Agent workspace directory for resolving relative MEDIA: paths. */
=======
  proxyUrl?: string;
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  requestInit?: RequestInit;
  trustExplicitProxyDns?: boolean;
  hostReadCapability?: boolean;
  optimizeImages?: boolean;
  /** Agent workspace directory for resolving relative media paths. */
>>>>>>> upstream/main
  workspaceDir?: string;
};

/** Normalizes empty root lists while preserving the explicit all-roots opt-in sentinel. */
export function resolveOutboundMediaLocalRoots(
  mediaLocalRoots?: readonly string[] | "any",
): readonly string[] | "any" | undefined {
  if (mediaLocalRoots === "any") {
    return mediaLocalRoots;
  }
  return mediaLocalRoots && mediaLocalRoots.length > 0 ? mediaLocalRoots : undefined;
}

<<<<<<< HEAD
=======
/** Collapses legacy read/root parameters into the current host media access shape. */
>>>>>>> upstream/main
export function resolveOutboundMediaAccess(
  params: {
    mediaAccess?: OutboundMediaAccess;
    mediaLocalRoots?: readonly string[];
    mediaReadFile?: OutboundMediaReadFile;
  } = {},
): OutboundMediaAccess | undefined {
<<<<<<< HEAD
  const localRoots = resolveOutboundMediaLocalRoots(
    params.mediaAccess?.localRoots ?? params.mediaLocalRoots,
  );
=======
  const resolvedLocalRoots = resolveOutboundMediaLocalRoots(
    params.mediaAccess?.localRoots ?? params.mediaLocalRoots,
  );
  const localRoots = resolvedLocalRoots === "any" ? undefined : resolvedLocalRoots;
>>>>>>> upstream/main
  const readFile = params.mediaAccess?.readFile ?? params.mediaReadFile;
  const workspaceDir = params.mediaAccess?.workspaceDir;
  if (!localRoots && !readFile && !workspaceDir) {
    return undefined;
  }
  return {
    ...(localRoots ? { localRoots } : {}),
    ...(readFile ? { readFile } : {}),
    ...(workspaceDir ? { workspaceDir } : {}),
  };
}

<<<<<<< HEAD
export function buildOutboundMediaLoadOptions(
  params: OutboundMediaLoadParams = {},
): OutboundMediaLoadOptions {
  const mediaAccess = resolveOutboundMediaAccess(params);
  const workspaceDir = mediaAccess?.workspaceDir ?? params.workspaceDir;
  if (mediaAccess?.readFile) {
    return {
      ...(params.maxBytes !== undefined ? { maxBytes: params.maxBytes } : {}),
      localRoots: "any",
      readFile: mediaAccess.readFile,
=======
/** Builds the canonical media load options shared by outbound attachment paths. */
export function buildOutboundMediaLoadOptions(
  params: OutboundMediaLoadParams = {},
): OutboundMediaLoadOptions {
  const explicitLocalRoots = resolveOutboundMediaLocalRoots(params.mediaLocalRoots);
  const mediaAccess = resolveOutboundMediaAccess({
    mediaAccess: params.mediaAccess,
    mediaLocalRoots: explicitLocalRoots === "any" ? undefined : explicitLocalRoots,
    mediaReadFile: params.mediaAccess?.readFile ? undefined : params.mediaReadFile,
  });
  const workspaceDir = mediaAccess?.workspaceDir ?? params.workspaceDir;
  const readFile = mediaAccess?.readFile ?? params.mediaReadFile;
  const localRoots = mediaAccess?.localRoots ?? explicitLocalRoots;
  if (readFile) {
    // Host reads must declare a root boundary so local file access cannot silently widen.
    if (!localRoots) {
      throw new Error(
        'Host media read requires explicit localRoots. Pass mediaAccess.localRoots or opt in with localRoots: "any".',
      );
    }
    return {
      ...(params.maxBytes !== undefined ? { maxBytes: params.maxBytes } : {}),
      localRoots,
      readFile,
      ...(params.fetchImpl ? { fetchImpl: params.fetchImpl } : {}),
      ...(params.proxyUrl ? { proxyUrl: params.proxyUrl } : {}),
      ...(params.requestInit ? { requestInit: params.requestInit } : {}),
      ...(params.trustExplicitProxyDns !== undefined
        ? { trustExplicitProxyDns: params.trustExplicitProxyDns }
        : {}),
>>>>>>> upstream/main
      hostReadCapability: true,
      ...(params.optimizeImages !== undefined ? { optimizeImages: params.optimizeImages } : {}),
      ...(workspaceDir ? { workspaceDir } : {}),
    };
  }
<<<<<<< HEAD
  const localRoots = mediaAccess?.localRoots;
=======
>>>>>>> upstream/main
  return {
    ...(params.maxBytes !== undefined ? { maxBytes: params.maxBytes } : {}),
    ...(localRoots ? { localRoots } : {}),
    ...(params.proxyUrl ? { proxyUrl: params.proxyUrl } : {}),
    ...(params.fetchImpl ? { fetchImpl: params.fetchImpl } : {}),
    ...(params.requestInit ? { requestInit: params.requestInit } : {}),
    ...(params.trustExplicitProxyDns !== undefined
      ? { trustExplicitProxyDns: params.trustExplicitProxyDns }
      : {}),
    ...(params.optimizeImages !== undefined ? { optimizeImages: params.optimizeImages } : {}),
    ...(workspaceDir ? { workspaceDir } : {}),
  };
}
