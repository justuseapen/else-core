<<<<<<< HEAD
import fs from "node:fs";
import { resolveOAuthPath } from "../../config/paths.js";
import { coerceSecretRef } from "../../config/types.secrets.js";
import { withFileLock } from "../../infra/file-lock.js";
import { loadJsonFile, saveJsonFile } from "../../infra/json-file.js";
import { AUTH_STORE_LOCK_OPTIONS, AUTH_STORE_VERSION, log } from "./constants.js";
import { ensureAuthStoreFile, resolveAuthStorePath, resolveLegacyAuthStorePath } from "./paths.js";
import type {
  AuthProfileCredential,
  AuthProfileStore,
  OAuthCredentials,
  ProfileUsageStats,
} from "./types.js";
=======
/**
 * Auth profile store orchestration.
 * Merges persisted stores, runtime snapshots, inherited main-agent OAuth
 * profiles, and external CLI overlays while keeping save paths local.
 */
import { isDeepStrictEqual } from "node:util";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { asDateTimestampMs } from "../../shared/number-coercion.js";
import type { OpenClawAgentDatabase } from "../../state/openclaw-agent-db.js";
import { isRecord } from "../../utils.js";
import { cloneAuthProfileStore } from "./clone.js";
import { AUTH_STORE_VERSION, log } from "./constants.js";
import {
  listRuntimeExternalAuthProfiles,
  overlayExternalAuthProfiles,
  syncPersistedExternalCliAuthProfiles,
} from "./external-auth.js";
import type { ExternalCliAuthDiscovery } from "./external-cli-discovery.js";
import {
  isSafeToAdoptMainStoreOAuthIdentity,
  shouldPersistRuntimeExternalOAuthProfile,
  type RuntimeExternalOAuthProfile,
} from "./oauth-shared.js";
import { resolveAuthStorePath } from "./paths.js";
import {
  buildPersistedAuthProfileSecretsStore,
  loadPersistedAuthProfileStore,
  mergeAuthProfileStores,
  mergeOAuthFileIntoStore,
} from "./persisted.js";
import {
  clearRuntimeAuthProfileStoreSnapshots as clearRuntimeAuthProfileStoreSnapshotsImpl,
  getRuntimeAuthProfileStoreSnapshot as getRuntimeAuthProfileStoreSnapshotImpl,
  hasRuntimeAuthProfileStoreSnapshot,
  replaceRuntimeAuthProfileStoreSnapshots as replaceRuntimeAuthProfileStoreSnapshotsImpl,
  setRuntimeAuthProfileStoreSnapshot,
} from "./runtime-snapshots.js";
import {
  readPersistedAuthProfileStoreRaw,
  writePersistedAuthProfileStateRaw,
  runAuthProfileWriteTransaction,
  writePersistedAuthProfileStoreRaw,
} from "./sqlite.js";
import {
  buildPersistedAuthProfileState,
  loadPersistedAuthProfileState,
  savePersistedAuthProfileState,
} from "./state.js";
import type { AuthProfileStore } from "./types.js";
>>>>>>> upstream/main

type LoadAuthProfileStoreOptions = {
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  database?: OpenClawAgentDatabase;
  externalCli?: ExternalCliAuthDiscovery;
  readOnly?: boolean;
  syncExternalCli?: boolean;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
};

type SaveAuthProfileStoreOptions = {
  filterExternalAuthProfiles?: boolean;
  preserveOrderProfileIds?: Iterable<string>;
  preserveStateProfileIds?: Iterable<string>;
  pruneOrderProfileIds?: Iterable<string>;
  syncExternalCli?: boolean;
};

<<<<<<< HEAD
const runtimeAuthStoreSnapshots = new Map<string, AuthProfileStore>();
const loadedAuthStoreCache = new Map<
  string,
  { mtimeMs: number | null; syncedAtMs: number; store: AuthProfileStore }
>();
const AUTH_STORE_CACHE_TTL_MS = 15 * 60 * 1000;
=======
const INLINE_OAUTH_TOKEN_FIELDS = ["access", "refresh", "idToken"] as const;
>>>>>>> upstream/main

function hasInlineOAuthTokenMaterial(credential: Record<string, unknown>): boolean {
  return INLINE_OAUTH_TOKEN_FIELDS.some((field) => credential[field] !== undefined);
}

function hasChangedInlineOAuthTokenMaterial(params: {
  credential: Record<string, unknown>;
  existingCredential: Record<string, unknown>;
}): boolean {
  return INLINE_OAUTH_TOKEN_FIELDS.some((field) => {
    if (params.credential[field] === undefined) {
      return false;
    }
    return !isDeepStrictEqual(params.credential[field], params.existingCredential[field]);
  });
}

function preserveLegacyOAuthRefsOnSave(params: {
  payload: ReturnType<typeof buildPersistedAuthProfileSecretsStore>;
  existingRaw: unknown;
}): ReturnType<typeof buildPersistedAuthProfileSecretsStore> {
  if (!isRecord(params.existingRaw) || !isRecord(params.existingRaw.profiles)) {
    return params.payload;
  }
  let nextProfiles: typeof params.payload.profiles | undefined;
  for (const [profileId, credential] of Object.entries(
    params.payload.profiles as Record<string, unknown>,
  )) {
    if (!isRecord(credential) || credential.oauthRef !== undefined || credential.type !== "oauth") {
      continue;
    }
    const existingCredential = params.existingRaw.profiles[profileId];
    if (
      !isRecord(existingCredential) ||
      existingCredential.oauthRef === undefined ||
      existingCredential.type !== "oauth"
    ) {
      continue;
    }
    if (
      hasInlineOAuthTokenMaterial(credential) &&
      hasChangedInlineOAuthTokenMaterial({ credential, existingCredential })
    ) {
      continue;
    }
    // Preserve legacy oauthRef ownership when current save data did not replace
    // inline OAuth material; otherwise older credential references would be lost.
    nextProfiles ??= { ...params.payload.profiles };
    nextProfiles[profileId] = {
      ...credential,
      oauthRef: existingCredential.oauthRef,
    } as unknown as (typeof nextProfiles)[string];
  }
  return nextProfiles ? { ...params.payload, profiles: nextProfiles } : params.payload;
}

type ResolvedExternalCliOverlayOptions = {
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
};

type ExternalCliSyncResult = {
  store: AuthProfileStore;
  cacheable: boolean;
};

function resolvePersistedLoadOptions(
  options: Pick<LoadAuthProfileStoreOptions, "allowKeychainPrompt" | "database"> | undefined,
): { allowKeychainPrompt?: boolean; database?: OpenClawAgentDatabase } {
  return {
    ...(options?.allowKeychainPrompt !== undefined
      ? { allowKeychainPrompt: options.allowKeychainPrompt }
      : {}),
    ...(options?.database ? { database: options.database } : {}),
  };
}

function isInheritedMainOAuthCredential(params: {
  agentDir?: string;
  profileId: string;
  credential: AuthProfileStore["profiles"][string];
}): boolean {
  if (!params.agentDir || params.credential.type !== "oauth") {
    return false;
  }
  const authPath = resolveAuthStorePath(params.agentDir);
  const mainAuthPath = resolveAuthStorePath();
  if (authPath === mainAuthPath) {
    return false;
  }

  const localStore = loadPersistedAuthProfileStore(params.agentDir);
  if (localStore?.profiles[params.profileId]) {
    return false;
  }

  // Local agent stores can inherit main OAuth credentials. Do not persist the
  // inherited copy unless the local store actually owns or improves it.
  const mainCredential = loadPersistedAuthProfileStore()?.profiles[params.profileId];
  return (
    mainCredential?.type === "oauth" &&
    (isDeepStrictEqual(mainCredential, params.credential) ||
      shouldUseMainOwnerForLocalOAuthCredential({
        local: params.credential,
        main: mainCredential,
      }))
  );
}

function shouldUseMainOwnerForLocalOAuthCredential(params: {
  local: AuthProfileStore["profiles"][string];
  main: AuthProfileStore["profiles"][string] | undefined;
}): boolean {
  if (params.local.type !== "oauth" || params.main?.type !== "oauth") {
    return false;
  }
  if (!isSafeToAdoptMainStoreOAuthIdentity(params.local, params.main)) {
    return false;
  }
  if (isDeepStrictEqual(params.local, params.main)) {
    return true;
  }
  const mainExpires = asDateTimestampMs(params.main.expires);
  if (mainExpires === undefined) {
    return false;
  }
  const localExpires = asDateTimestampMs(params.local.expires);
  return localExpires === undefined || mainExpires >= localExpires;
}

function resolveRuntimeAuthProfileStore(
  agentDir?: string,
  options?: Pick<LoadAuthProfileStoreOptions, "allowKeychainPrompt">,
): AuthProfileStore | null {
  const mainKey = resolveAuthStorePath(undefined);
  const requestedKey = resolveAuthStorePath(agentDir);
  const mainStore = getRuntimeAuthProfileStoreSnapshotImpl(undefined);
  const requestedStore = getRuntimeAuthProfileStoreSnapshotImpl(agentDir);

  if (!agentDir || requestedKey === mainKey) {
    if (!mainStore) {
      return null;
    }
    return mainStore;
  }

  if (mainStore && requestedStore) {
    return mergeAuthProfileStores(mainStore, requestedStore, {
      preserveBaseRuntimeExternalProfiles: true,
    });
  }
  if (requestedStore) {
    const persistedMainStore = loadAuthProfileStoreForAgent(undefined, {
      readOnly: true,
      syncExternalCli: false,
      ...resolvePersistedLoadOptions(options),
    });
    return mergeAuthProfileStores(persistedMainStore, requestedStore, {
      preserveBaseRuntimeExternalProfiles: true,
    });
  }
  if (mainStore) {
    return mainStore;
  }

  return null;
}

function resolveExternalCliOverlayOptions(
  options: LoadAuthProfileStoreOptions | undefined,
): ResolvedExternalCliOverlayOptions {
  const discovery = options?.externalCli;
  if (!discovery) {
    return {
      ...(options?.allowKeychainPrompt !== undefined
        ? { allowKeychainPrompt: options.allowKeychainPrompt }
        : {}),
      ...(options?.config ? { config: options.config } : {}),
      ...(options?.externalCliProviderIds
        ? { externalCliProviderIds: options.externalCliProviderIds }
        : {}),
      ...(options?.externalCliProfileIds
        ? { externalCliProfileIds: options.externalCliProfileIds }
        : {}),
    };
  }
  if (discovery.mode === "none") {
    const config = discovery.config ?? options?.config;
    return {
      allowKeychainPrompt: false,
      ...(config ? { config } : {}),
      externalCliProviderIds: [],
      externalCliProfileIds: [],
    };
  }
  if (discovery.mode === "existing") {
    const allowKeychainPrompt = discovery.allowKeychainPrompt ?? options?.allowKeychainPrompt;
    const config = discovery.config ?? options?.config;
    return {
      ...(allowKeychainPrompt !== undefined ? { allowKeychainPrompt } : {}),
      ...(config ? { config } : {}),
    };
  }
  const allowKeychainPrompt = discovery.allowKeychainPrompt ?? options?.allowKeychainPrompt;
  const config = discovery.config ?? options?.config;
  return {
    ...(allowKeychainPrompt !== undefined ? { allowKeychainPrompt } : {}),
    ...(config ? { config } : {}),
    ...(discovery.providerIds ? { externalCliProviderIds: discovery.providerIds } : {}),
    ...(discovery.profileIds ? { externalCliProfileIds: discovery.profileIds } : {}),
  };
}

function hasScopedExternalCliOverlay(options: ResolvedExternalCliOverlayOptions): boolean {
  return (
    options.externalCliProviderIds !== undefined || options.externalCliProfileIds !== undefined
  );
}

function maybeSyncPersistedExternalCliAuthProfiles(params: {
  store: AuthProfileStore;
  agentDir?: string;
  options?: LoadAuthProfileStoreOptions;
}): ExternalCliSyncResult {
  if (
    params.options?.readOnly === true ||
    params.options?.syncExternalCli === false ||
    process.env.OPENCLAW_AUTH_STORE_READONLY === "1"
  ) {
    return { store: params.store, cacheable: true };
  }
  const synced = syncPersistedExternalCliAuthProfiles(params.store, {
    agentDir: params.agentDir,
    ...resolveExternalCliOverlayOptions(params.options),
  });
  if (synced === params.store) {
    return { store: params.store, cacheable: true };
  }
  const changedProfiles = Object.entries(synced.profiles).filter(([profileId, credential]) => {
    const previous = params.store.profiles[profileId];
    return !isDeepStrictEqual(previous, credential);
  });
  if (changedProfiles.length === 0) {
    return { store: synced, cacheable: true };
  }

  try {
    // External CLI sync writes only profiles that still match the loaded
    // baseline, avoiding overwrite of concurrent local auth changes.
    return runAuthProfileWriteTransaction(params.agentDir, (database) => {
      const latestStore = loadPersistedAuthProfileStore(params.agentDir, {
        ...resolvePersistedLoadOptions(params.options),
        database,
      }) ?? {
        version: AUTH_STORE_VERSION,
        profiles: {},
      };
      let changed = false;
      for (const [profileId, credential] of changedProfiles) {
        const previous = params.store.profiles[profileId];
        const latest = latestStore.profiles[profileId];
        if (!isDeepStrictEqual(latest, previous)) {
          log.debug("skipped persisted external cli auth sync for concurrently changed profile", {
            profileId,
          });
          continue;
        }
        latestStore.profiles[profileId] = credential;
        changed = true;
      }
      if (changed) {
        saveAuthProfileStore(
          latestStore,
          params.agentDir,
          {
            filterExternalAuthProfiles: false,
          },
          database,
        );
      }
      return { store: latestStore, cacheable: true };
    });
  } catch (err) {
    log.warn("skipped persisted external cli auth sync because auth store write failed", {
      err,
    });
    return { store: params.store, cacheable: false };
  }
}

function shouldKeepProfileInLocalStore(params: {
  store: AuthProfileStore;
  profileId: string;
  credential: AuthProfileStore["profiles"][string];
  agentDir?: string;
  options?: SaveAuthProfileStoreOptions;
  externalProfiles: () => RuntimeExternalOAuthProfile[];
}): boolean {
  if (params.credential.type !== "oauth") {
    return true;
  }
<<<<<<< HEAD
  if (Date.now() - cached.syncedAtMs >= AUTH_STORE_CACHE_TTL_MS) {
    return null;
=======
  if (
    isInheritedMainOAuthCredential({
      agentDir: params.agentDir,
      profileId: params.profileId,
      credential: params.credential,
    })
  ) {
    return false;
>>>>>>> upstream/main
  }
  if (params.options?.filterExternalAuthProfiles === false) {
    return true;
  }
  if (params.store.runtimeExternalProfileIds?.includes(params.profileId)) {
    // Runtime external profiles are normally overlays. Persist only when they
    // have explicit local state or differ from the runtime snapshot.
    const persistedCredential = loadPersistedAuthProfileStore(params.agentDir)?.profiles[
      params.profileId
    ];
    if (persistedCredential) {
      return shouldPersistRuntimeExternalOAuthProfile({
        profileId: params.profileId,
        credential: params.credential,
        profiles: params.externalProfiles(),
      });
    }
    const runtimeCredential = getRuntimeAuthProfileStoreSnapshot(params.agentDir)?.profiles[
      params.profileId
    ];
    if (!runtimeCredential || isDeepStrictEqual(runtimeCredential, params.credential)) {
      return false;
    }
  }
  return shouldPersistRuntimeExternalOAuthProfile({
    profileId: params.profileId,
    credential: params.credential,
    profiles: params.externalProfiles(),
  });
}

<<<<<<< HEAD
function normalizeSecretBackedField(params: {
  entry: Record<string, unknown>;
  valueField: "key" | "token";
  refField: "keyRef" | "tokenRef";
}): void {
  const value = params.entry[params.valueField];
  if (value == null || typeof value === "string") {
    return;
  }
  const ref = coerceSecretRef(value);
  if (ref && !coerceSecretRef(params.entry[params.refField])) {
    params.entry[params.refField] = ref;
  }
  delete params.entry[params.valueField];
}

=======
function pruneAuthProfileStoreReferences(
  store: AuthProfileStore,
  keptProfileIds: Set<string>,
  keptOrderProfileIds = keptProfileIds,
): void {
  store.order = store.order
    ? Object.fromEntries(
        Object.entries(store.order)
          .map(([provider, profileIds]) => [
            provider,
            profileIds.filter((profileId) => keptOrderProfileIds.has(profileId)),
          ])
          .filter(([, profileIds]) => profileIds.length > 0),
      )
    : undefined;
  store.lastGood = store.lastGood
    ? Object.fromEntries(
        Object.entries(store.lastGood).filter(([, profileId]) => keptProfileIds.has(profileId)),
      )
    : undefined;
  store.usageStats = store.usageStats
    ? Object.fromEntries(
        Object.entries(store.usageStats).filter(([profileId]) => keptProfileIds.has(profileId)),
      )
    : undefined;
  store.runtimeExternalProfileIds = store.runtimeExternalProfileIds
    ?.filter((profileId) => keptProfileIds.has(profileId))
    .toSorted();
  if (
    store.runtimeExternalProfileIds?.length === 0 &&
    store.runtimeExternalProfileIdsAuthoritative !== true
  ) {
    store.runtimeExternalProfileIds = undefined;
  }
  if (store.runtimeExternalProfileIdsAuthoritative === true) {
    store.runtimeExternalProfileIds ??= [];
  }
}

function buildLocalAuthProfileStoreForSave(params: {
  store: AuthProfileStore;
  agentDir?: string;
  options?: SaveAuthProfileStoreOptions;
}): AuthProfileStore {
  const localStore = cloneAuthProfileStore(params.store);
  let externalProfiles: RuntimeExternalOAuthProfile[] | undefined;
  const getExternalProfiles = (): RuntimeExternalOAuthProfile[] =>
    (externalProfiles ??= listRuntimeExternalAuthProfiles({
      store: params.store,
      agentDir: params.agentDir,
    }));
  localStore.profiles = Object.fromEntries(
    Object.entries(localStore.profiles).filter(([profileId, credential]) =>
      shouldKeepProfileInLocalStore({
        store: params.store,
        profileId,
        credential,
        agentDir: params.agentDir,
        options: params.options,
        externalProfiles: getExternalProfiles,
      }),
    ),
  );
  const keptProfileIds = new Set(Object.keys(localStore.profiles));
  const keptOrderProfileIds = new Set(keptProfileIds);
  for (const profileId of params.options?.preserveStateProfileIds ?? []) {
    const normalizedProfileId = profileId.trim();
    if (normalizedProfileId) {
      keptProfileIds.add(normalizedProfileId);
      keptOrderProfileIds.add(normalizedProfileId);
    }
  }
  for (const profileIds of Object.values(
    loadPersistedAuthProfileState(params.agentDir).order ?? {},
  )) {
    for (const profileId of profileIds) {
      keptOrderProfileIds.add(profileId);
    }
  }
  for (const profileId of params.options?.preserveOrderProfileIds ?? []) {
    const normalizedProfileId = profileId.trim();
    if (normalizedProfileId) {
      keptOrderProfileIds.add(normalizedProfileId);
    }
  }
  const prunedOrderProfileIds = new Set<string>();
  for (const profileId of params.options?.pruneOrderProfileIds ?? []) {
    const normalizedProfileId = profileId.trim();
    if (normalizedProfileId) {
      prunedOrderProfileIds.add(normalizedProfileId);
    }
  }
  for (const profileId of prunedOrderProfileIds) {
    keptOrderProfileIds.delete(profileId);
  }
  pruneAuthProfileStoreReferences(localStore, keptProfileIds, keptOrderProfileIds);
  if (params.options?.filterExternalAuthProfiles !== false) {
    localStore.runtimeExternalProfileIds = undefined;
    localStore.runtimeExternalProfileIdsAuthoritative = undefined;
  }
  return localStore;
}

function buildAuthProfileStoreWithoutExternalProfiles(params: {
  store: AuthProfileStore;
  agentDir?: string;
  options?: Pick<LoadAuthProfileStoreOptions, "allowKeychainPrompt">;
}): AuthProfileStore {
  const runtimeExternalProfileIds = new Set(params.store.runtimeExternalProfileIds ?? []);
  const localStore = cloneAuthProfileStore(params.store);
  if (runtimeExternalProfileIds.size === 0) {
    localStore.runtimeExternalProfileIds = undefined;
    localStore.runtimeExternalProfileIdsAuthoritative = undefined;
    return localStore;
  }
  for (const profileId of runtimeExternalProfileIds) {
    delete localStore.profiles[profileId];
  }
  const keptProfileIds = new Set(Object.keys(localStore.profiles));
  pruneAuthProfileStoreReferences(localStore, keptProfileIds);
  localStore.runtimeExternalProfileIds = undefined;
  localStore.runtimeExternalProfileIdsAuthoritative = undefined;
  const persistedStore = loadAuthProfileStoreWithoutExternalProfiles(
    params.agentDir,
    params.options,
  );
  return mergeAuthProfileStores(persistedStore, localStore);
}

function buildRuntimeAuthProfileStoreForSave(params: {
  store: AuthProfileStore;
  agentDir?: string;
  options?: SaveAuthProfileStoreOptions;
}): AuthProfileStore {
  return buildLocalAuthProfileStoreForSave({
    ...params,
    options: {
      ...params.options,
      filterExternalAuthProfiles: false,
    },
  });
}

function setRuntimeExternalProfileMetadata(params: {
  store: AuthProfileStore;
  profileIds: ReadonlySet<string>;
  authoritative: boolean;
}): void {
  const profileIds = [...params.profileIds].toSorted();
  params.store.runtimeExternalProfileIds =
    profileIds.length > 0 || params.authoritative ? profileIds : undefined;
  params.store.runtimeExternalProfileIdsAuthoritative = params.authoritative ? true : undefined;
}

function mergeRuntimeExternalProfileReferences(params: {
  next: AuthProfileStore;
  existing: AuthProfileStore;
}): AuthProfileStore {
  const runtimeExternalProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
  if (params.next.runtimeExternalProfileIdsAuthoritative === true) {
    return params.next;
  }
  if (runtimeExternalProfileIds.size === 0) {
    return params.next;
  }
  const merged = cloneAuthProfileStore(params.next);
  const mergedRuntimeExternalProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
  const backfilledRuntimeExternalProfileIds = new Set<string>();
  for (const profileId of runtimeExternalProfileIds) {
    const existingCredential = params.existing.profiles[profileId];
    const nextCredential = merged.profiles[profileId];
    if (nextCredential) {
      if (
        mergedRuntimeExternalProfileIds.has(profileId) ||
        (existingCredential && isDeepStrictEqual(nextCredential, existingCredential))
      ) {
        mergedRuntimeExternalProfileIds.add(profileId);
      }
      continue;
    }
    if (!existingCredential) {
      continue;
    }
    merged.profiles[profileId] = existingCredential;
    mergedRuntimeExternalProfileIds.add(profileId);
    backfilledRuntimeExternalProfileIds.add(profileId);
    if (params.existing.usageStats?.[profileId]) {
      merged.usageStats = {
        ...merged.usageStats,
        [profileId]: params.existing.usageStats[profileId],
      };
    }
  }
  for (const [provider, profileIds] of Object.entries(params.existing.order ?? {})) {
    const externalProfileIds = profileIds.filter((profileId) =>
      backfilledRuntimeExternalProfileIds.has(profileId),
    );
    if (externalProfileIds.length === 0) {
      continue;
    }
    if (merged.order?.[provider]) {
      continue;
    }
    const existingOrder = merged.order?.[provider] ?? [];
    merged.order = {
      ...merged.order,
      [provider]: [
        ...externalProfileIds,
        ...existingOrder.filter((profileId) => !externalProfileIds.includes(profileId)),
      ],
    };
  }
  for (const [provider, profileId] of Object.entries(params.existing.lastGood ?? {})) {
    if (!backfilledRuntimeExternalProfileIds.has(profileId) || merged.lastGood?.[provider]) {
      continue;
    }
    merged.lastGood = {
      ...merged.lastGood,
      [provider]: profileId,
    };
  }
  setRuntimeExternalProfileMetadata({
    store: merged,
    profileIds: mergedRuntimeExternalProfileIds,
    authoritative: params.existing.runtimeExternalProfileIdsAuthoritative === true,
  });
  return merged;
}

function mergeRuntimeExternalProfileState(params: {
  next: AuthProfileStore;
  existing: AuthProfileStore;
}): AuthProfileStore {
  const existingRuntimeProfileIds = new Set(params.existing.runtimeExternalProfileIds ?? []);
  if (existingRuntimeProfileIds.size === 0) {
    return params.next;
  }
  const merged = cloneAuthProfileStore(params.next);
  const mergedRuntimeProfileIds = new Set(merged.runtimeExternalProfileIds ?? []);
  const activeRuntimeProfileIds = new Set<string>();
  const nextRuntimeProfileIdsAuthoritative =
    params.next.runtimeExternalProfileIdsAuthoritative === true;
  for (const profileId of existingRuntimeProfileIds) {
    if (nextRuntimeProfileIdsAuthoritative && !mergedRuntimeProfileIds.has(profileId)) {
      continue;
    }
    const existingCredential = params.existing.profiles[profileId];
    if (!existingCredential) {
      continue;
    }
    const nextCredential = merged.profiles[profileId];
    if (nextCredential) {
      if (
        mergedRuntimeProfileIds.has(profileId) ||
        isDeepStrictEqual(nextCredential, existingCredential)
      ) {
        mergedRuntimeProfileIds.add(profileId);
        activeRuntimeProfileIds.add(profileId);
      }
      continue;
    }
    merged.profiles[profileId] = existingCredential;
    mergedRuntimeProfileIds.add(profileId);
    activeRuntimeProfileIds.add(profileId);
  }
  if (activeRuntimeProfileIds.size === 0) {
    return params.next;
  }
  for (const profileId of activeRuntimeProfileIds) {
    if (params.existing.usageStats?.[profileId]) {
      merged.usageStats = {
        ...merged.usageStats,
        [profileId]: params.existing.usageStats[profileId],
      };
    }
  }
  for (const [provider, profileIds] of Object.entries(params.existing.order ?? {})) {
    const externalProfileIds = profileIds.filter((profileId) =>
      activeRuntimeProfileIds.has(profileId),
    );
    if (externalProfileIds.length === 0 || merged.order?.[provider]) {
      continue;
    }
    merged.order = {
      ...merged.order,
      [provider]: externalProfileIds,
    };
  }
  for (const [provider, profileId] of Object.entries(params.existing.lastGood ?? {})) {
    if (!activeRuntimeProfileIds.has(profileId) || merged.lastGood?.[provider]) {
      continue;
    }
    merged.lastGood = {
      ...merged.lastGood,
      [provider]: profileId,
    };
  }
  setRuntimeExternalProfileMetadata({
    store: merged,
    profileIds: mergedRuntimeProfileIds,
    authoritative: params.existing.runtimeExternalProfileIdsAuthoritative === true,
  });
  return merged;
}

/** Apply an auth store update inside the SQLite write lock. */
>>>>>>> upstream/main
export async function updateAuthProfileStoreWithLock(params: {
  agentDir?: string;
  saveOptions?: SaveAuthProfileStoreOptions;
  updater: (store: AuthProfileStore) => boolean;
}): Promise<AuthProfileStore | null> {
  try {
    return runAuthProfileWriteTransaction(params.agentDir, (database) => {
      const store = loadAuthProfileStoreForAgent(params.agentDir, {
        database,
        readOnly: true,
        syncExternalCli: false,
      });
      const shouldSave = params.updater(store);
      if (shouldSave) {
        saveAuthProfileStore(store, params.agentDir, params.saveOptions, database);
      }
      return store;
    });
  } catch {
    return null;
  }
}

<<<<<<< HEAD
/**
 * Normalise a raw auth-profiles.json credential entry.
 *
 * The official format uses `type` and (for api_key credentials) `key`.
 * A common mistake — caused by the similarity with the `openclaw.json`
 * `auth.profiles` section which uses `mode` — is to write `mode` instead of
 * `type` and `apiKey` instead of `key`.  Accept both spellings so users don't
 * silently lose their credentials.
 */
function normalizeRawCredentialEntry(raw: Record<string, unknown>): Partial<AuthProfileCredential> {
  const entry = { ...raw } as Record<string, unknown>;
  // mode → type alias (openclaw.json uses "mode"; auth-profiles.json uses "type")
  if (!("type" in entry) && typeof entry["mode"] === "string") {
    entry["type"] = entry["mode"];
  }
  // apiKey → key alias for ApiKeyCredential
  if (!("key" in entry) && typeof entry["apiKey"] === "string") {
    entry["key"] = entry["apiKey"];
  }
  // Ensure `key` is a string.  Users sometimes write a SecretRef object into
  // the `key` field instead of `keyRef`.  When that happens every downstream
  // consumer that calls `cred.key?.trim()` throws a TypeError because the
  // value is truthy (an object) but has no `.trim()` method.  Migrate the
  // misplaced ref to `keyRef` so the secret-resolution pipeline can pick it
  // up, and clear the invalid `key` so callers never see a non-string value.
  normalizeSecretBackedField({ entry, valueField: "key", refField: "keyRef" });
  // Same treatment for `token` on TokenCredential entries.
  normalizeSecretBackedField({ entry, valueField: "token", refField: "tokenRef" });
  return entry as Partial<AuthProfileCredential>;
}

function parseCredentialEntry(
  raw: unknown,
  fallbackProvider?: string,
): { ok: true; credential: AuthProfileCredential } | { ok: false; reason: CredentialRejectReason } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, reason: "non_object" };
  }
  const typed = normalizeRawCredentialEntry(raw as Record<string, unknown>);
  if (!AUTH_PROFILE_TYPES.has(typed.type as AuthProfileCredential["type"])) {
    return { ok: false, reason: "invalid_type" };
  }
  const provider = typed.provider ?? fallbackProvider;
  if (typeof provider !== "string" || provider.trim().length === 0) {
    return { ok: false, reason: "missing_provider" };
  }
  return {
    ok: true,
    credential: {
      ...typed,
      provider,
    } as AuthProfileCredential,
  };
}

function warnRejectedCredentialEntries(source: string, rejected: RejectedCredentialEntry[]): void {
  if (rejected.length === 0) {
    return;
  }
  const reasons = rejected.reduce(
    (acc, current) => {
      acc[current.reason] = (acc[current.reason] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<CredentialRejectReason, number>>,
  );
  log.warn("ignored invalid auth profile entries during store load", {
    source,
    dropped: rejected.length,
    reasons,
    keys: rejected.slice(0, 10).map((entry) => entry.key),
  });
}

function coerceLegacyStore(raw: unknown): LegacyAuthStore | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const record = raw as Record<string, unknown>;
  if ("profiles" in record) {
    return null;
  }
  const entries: LegacyAuthStore = {};
  const rejected: RejectedCredentialEntry[] = [];
  for (const [key, value] of Object.entries(record)) {
    const parsed = parseCredentialEntry(value, key);
    if (!parsed.ok) {
      rejected.push({ key, reason: parsed.reason });
      continue;
    }
    entries[key] = parsed.credential;
  }
  warnRejectedCredentialEntries("auth.json", rejected);
  return Object.keys(entries).length > 0 ? entries : null;
}

function coerceAuthStore(raw: unknown): AuthProfileStore | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const record = raw as Record<string, unknown>;
  if (!record.profiles || typeof record.profiles !== "object") {
    return null;
  }
  const profiles = record.profiles as Record<string, unknown>;
  const normalized: Record<string, AuthProfileCredential> = {};
  const rejected: RejectedCredentialEntry[] = [];
  for (const [key, value] of Object.entries(profiles)) {
    const parsed = parseCredentialEntry(value);
    if (!parsed.ok) {
      rejected.push({ key, reason: parsed.reason });
      continue;
    }
    normalized[key] = parsed.credential;
  }
  warnRejectedCredentialEntries("auth-profiles.json", rejected);
  const order =
    record.order && typeof record.order === "object"
      ? Object.entries(record.order as Record<string, unknown>).reduce(
          (acc, [provider, value]) => {
            if (!Array.isArray(value)) {
              return acc;
            }
            const list = value
              .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
              .filter(Boolean);
            if (list.length === 0) {
              return acc;
            }
            acc[provider] = list;
            return acc;
          },
          {} as Record<string, string[]>,
        )
      : undefined;
  return {
    version: Number(record.version ?? AUTH_STORE_VERSION),
    profiles: normalized,
    order,
    lastGood:
      record.lastGood && typeof record.lastGood === "object"
        ? (record.lastGood as Record<string, string>)
        : undefined,
    usageStats:
      record.usageStats && typeof record.usageStats === "object"
        ? (record.usageStats as Record<string, ProfileUsageStats>)
        : undefined,
  };
}

function mergeRecord<T>(
  base?: Record<string, T>,
  override?: Record<string, T>,
): Record<string, T> | undefined {
  if (!base && !override) {
    return undefined;
  }
  if (!base) {
    return { ...override };
  }
  if (!override) {
    return { ...base };
  }
  return { ...base, ...override };
}

function mergeAuthProfileStores(
  base: AuthProfileStore,
  override: AuthProfileStore,
): AuthProfileStore {
  if (
    Object.keys(override.profiles).length === 0 &&
    !override.order &&
    !override.lastGood &&
    !override.usageStats
  ) {
    return base;
  }
  return {
    version: Math.max(base.version, override.version ?? base.version),
    profiles: { ...base.profiles, ...override.profiles },
    order: mergeRecord(base.order, override.order),
    lastGood: mergeRecord(base.lastGood, override.lastGood),
    usageStats: mergeRecord(base.usageStats, override.usageStats),
  };
}

function buildPersistedAuthProfileStore(store: AuthProfileStore): AuthProfileStore {
  const profiles = Object.fromEntries(
    Object.entries(store.profiles).flatMap(([profileId, credential]) => {
      if (credential.type === "api_key" && credential.keyRef && credential.key !== undefined) {
        const sanitized = { ...credential } as Record<string, unknown>;
        delete sanitized.key;
        return [[profileId, sanitized]];
      }
      if (credential.type === "token" && credential.tokenRef && credential.token !== undefined) {
        const sanitized = { ...credential } as Record<string, unknown>;
        delete sanitized.token;
        return [[profileId, sanitized]];
      }
      return [[profileId, credential]];
    }),
  ) as AuthProfileStore["profiles"];

  return {
    version: AUTH_STORE_VERSION,
    profiles,
    order: store.order ?? undefined,
    lastGood: store.lastGood ?? undefined,
    usageStats: store.usageStats ?? undefined,
  };
}

function mergeOAuthFileIntoStore(store: AuthProfileStore): boolean {
  const oauthPath = resolveOAuthPath();
  const oauthRaw = loadJsonFile(oauthPath);
  if (!oauthRaw || typeof oauthRaw !== "object") {
    return false;
  }
  const oauthEntries = oauthRaw as Record<string, OAuthCredentials>;
  let mutated = false;
  for (const [provider, creds] of Object.entries(oauthEntries)) {
    if (!creds || typeof creds !== "object") {
      continue;
    }
    const profileId = `${provider}:default`;
    if (store.profiles[profileId]) {
      continue;
    }
    store.profiles[profileId] = {
      type: "oauth",
      provider,
      ...creds,
    };
    mutated = true;
  }
  return mutated;
}

function applyLegacyStore(store: AuthProfileStore, legacy: LegacyAuthStore): void {
  for (const [provider, cred] of Object.entries(legacy)) {
    const profileId = `${provider}:default`;
    if (cred.type === "api_key") {
      store.profiles[profileId] = {
        type: "api_key",
        provider: String(cred.provider ?? provider),
        key: cred.key,
        ...(cred.email ? { email: cred.email } : {}),
      };
      continue;
    }
    if (cred.type === "token") {
      store.profiles[profileId] = {
        type: "token",
        provider: String(cred.provider ?? provider),
        token: cred.token,
        ...(typeof cred.expires === "number" ? { expires: cred.expires } : {}),
        ...(cred.email ? { email: cred.email } : {}),
      };
      continue;
    }
    store.profiles[profileId] = {
      type: "oauth",
      provider: String(cred.provider ?? provider),
      access: cred.access,
      refresh: cred.refresh,
      expires: cred.expires,
      ...(cred.enterpriseUrl ? { enterpriseUrl: cred.enterpriseUrl } : {}),
      ...(cred.projectId ? { projectId: cred.projectId } : {}),
      ...(cred.accountId ? { accountId: cred.accountId } : {}),
      ...(cred.email ? { email: cred.email } : {}),
    };
  }
}

function loadCoercedStore(authPath: string): AuthProfileStore | null {
  const raw = loadJsonFile(authPath);
  return coerceAuthStore(raw);
}

=======
/** Load the main auth profile store with runtime external profiles overlaid. */
>>>>>>> upstream/main
export function loadAuthProfileStore(): AuthProfileStore {
  const asStore = loadPersistedAuthProfileStore();
  if (asStore) {
<<<<<<< HEAD
    return asStore;
  }
  const legacyRaw = loadJsonFile(resolveLegacyAuthStorePath());
  const legacy = coerceLegacyStore(legacyRaw);
  if (legacy) {
    const store: AuthProfileStore = {
      version: AUTH_STORE_VERSION,
      profiles: {},
    };
    applyLegacyStore(store, legacy);
    return store;
  }

  return { version: AUTH_STORE_VERSION, profiles: {} };
=======
    return overlayExternalAuthProfiles(asStore);
  }

  const store: AuthProfileStore = { version: AUTH_STORE_VERSION, profiles: {} };
  return overlayExternalAuthProfiles(store);
>>>>>>> upstream/main
}

function loadAuthProfileStoreForAgent(
  agentDir?: string,
  options?: LoadAuthProfileStoreOptions,
): AuthProfileStore {
  const readOnly = options?.readOnly === true;
  const asStore = loadPersistedAuthProfileStore(agentDir, resolvePersistedLoadOptions(options));
  if (asStore) {
<<<<<<< HEAD
    if (!readOnly) {
      writeCachedAuthProfileStore(authPath, readAuthStoreMtimeMs(authPath), asStore);
    }
    return asStore;
=======
    const synced = maybeSyncPersistedExternalCliAuthProfiles({
      store: asStore,
      agentDir,
      options,
    });
    return synced.store;
>>>>>>> upstream/main
  }

  const store: AuthProfileStore = {
    version: AUTH_STORE_VERSION,
    profiles: {},
  };

  const mergedOAuth = mergeOAuthFileIntoStore(store);
  const forceReadOnly = process.env.OPENCLAW_AUTH_STORE_READONLY === "1";
<<<<<<< HEAD
  const shouldWrite = !readOnly && !forceReadOnly && (legacy !== null || mergedOAuth);
=======
  const shouldWrite = !readOnly && !forceReadOnly && mergedOAuth;
>>>>>>> upstream/main
  if (shouldWrite) {
    saveAuthProfileStore(store, agentDir);
  }

  const synced = maybeSyncPersistedExternalCliAuthProfiles({
    store,
    agentDir,
    options,
  });
  return synced.store;
}

/** Loads the effective runtime store for an agent, including inherited main profiles. */
export function loadAuthProfileStoreForRuntime(
  agentDir?: string,
  options?: LoadAuthProfileStoreOptions,
): AuthProfileStore {
  const store = loadAuthProfileStoreForAgent(agentDir, options);
  const authPath = resolveAuthStorePath(agentDir);
  const mainAuthPath = resolveAuthStorePath();
  const externalCli = resolveExternalCliOverlayOptions(options);
  if (!agentDir || authPath === mainAuthPath) {
    return overlayExternalAuthProfiles(store, {
      agentDir,
      ...externalCli,
    });
  }

  const mainStore = loadAuthProfileStoreForAgent(undefined, options);
  return overlayExternalAuthProfiles(
    mergeAuthProfileStores(mainStore, store, {
      preserveBaseRuntimeExternalProfiles: true,
    }),
    {
      agentDir,
      ...externalCli,
    },
  );
}

/** Load auth profiles for secret resolution without keychain prompts or writes. */
export function loadAuthProfileStoreForSecretsRuntime(
  agentDir?: string,
  options?: Pick<
    LoadAuthProfileStoreOptions,
    "config" | "externalCli" | "externalCliProviderIds" | "externalCliProfileIds"
  >,
): AuthProfileStore {
  return loadAuthProfileStoreForRuntime(agentDir, {
    ...options,
    readOnly: true,
    allowKeychainPrompt: false,
  });
}

/** Load auth profiles with runtime external profiles removed from the result. */
export function loadAuthProfileStoreWithoutExternalProfiles(
  agentDir?: string,
  loadOptions?: Pick<LoadAuthProfileStoreOptions, "allowKeychainPrompt">,
): AuthProfileStore {
  const options: LoadAuthProfileStoreOptions = {
    readOnly: true,
    allowKeychainPrompt: loadOptions?.allowKeychainPrompt ?? false,
  };
  const store = loadAuthProfileStoreForAgent(agentDir, options);
  const authPath = resolveAuthStorePath(agentDir);
  const mainAuthPath = resolveAuthStorePath();
  if (!agentDir || authPath === mainAuthPath) {
    return store;
  }

  const mainStore = loadAuthProfileStoreForAgent(undefined, options);
  return mergeAuthProfileStores(mainStore, store, {
    preserveBaseRuntimeExternalProfiles: true,
  });
}

/** Ensure an auth store is available, including runtime/external profile overlays. */
export function ensureAuthProfileStore(
  agentDir?: string,
  options?: {
    allowKeychainPrompt?: boolean;
    config?: OpenClawConfig;
    externalCli?: ExternalCliAuthDiscovery;
    externalCliProviderIds?: Iterable<string>;
    externalCliProfileIds?: Iterable<string>;
    readOnly?: boolean;
    syncExternalCli?: boolean;
  },
): AuthProfileStore {
  const externalCli = resolveExternalCliOverlayOptions(options);
  const runtimeStore = resolveRuntimeAuthProfileStore(agentDir, options);
  const store = overlayExternalAuthProfiles(
    ensureAuthProfileStoreWithoutExternalProfiles(agentDir, options),
    {
      agentDir,
      ...externalCli,
    },
  );
  if (!runtimeStore || hasScopedExternalCliOverlay(externalCli)) {
    return store;
  }
  return mergeRuntimeExternalProfileState({
    next: store,
    existing: runtimeStore,
  });
}

/** Ensure an auth store is available without external profile overlays. */
export function ensureAuthProfileStoreWithoutExternalProfiles(
  agentDir?: string,
  options?: {
    allowKeychainPrompt?: boolean;
    readOnly?: boolean;
    syncExternalCli?: boolean;
  },
): AuthProfileStore {
  const effectiveOptions: LoadAuthProfileStoreOptions = {
    ...options,
  };
  const runtimeStore = resolveRuntimeAuthProfileStore(agentDir, effectiveOptions);
  if (runtimeStore) {
    return buildAuthProfileStoreWithoutExternalProfiles({
      store: runtimeStore,
      agentDir,
      options: effectiveOptions,
    });
  }
  const store = loadAuthProfileStoreForAgent(agentDir, effectiveOptions);
  const authPath = resolveAuthStorePath(agentDir);
<<<<<<< HEAD
  const runtimeKey = resolveRuntimeStoreKey(agentDir);
  const payload = buildPersistedAuthProfileStore(store);
  saveJsonFile(authPath, payload);
  const runtimeStore = cloneAuthProfileStore(store);
  writeCachedAuthProfileStore(authPath, readAuthStoreMtimeMs(authPath), runtimeStore);
  if (runtimeAuthStoreSnapshots.has(runtimeKey)) {
    runtimeAuthStoreSnapshots.set(runtimeKey, cloneAuthProfileStore(runtimeStore));
=======
  const mainAuthPath = resolveAuthStorePath();
  if (!agentDir || authPath === mainAuthPath) {
    return store;
  }

  const mainStore = loadAuthProfileStoreForAgent(undefined, effectiveOptions);
  return mergeAuthProfileStores(mainStore, store, {
    preserveBaseRuntimeExternalProfiles: true,
  });
}

/** Find a persisted credential in the scoped store, falling back to the main store. */
export function findPersistedAuthProfileCredential(params: {
  agentDir?: string;
  profileId: string;
}): AuthProfileStore["profiles"][string] | undefined {
  const requestedStore = loadPersistedAuthProfileStore(params.agentDir);
  const requestedProfile = requestedStore?.profiles[params.profileId];
  if (requestedProfile || !params.agentDir) {
    return requestedProfile;
  }

  const requestedPath = resolveAuthStorePath(params.agentDir);
  const mainPath = resolveAuthStorePath();
  if (requestedPath === mainPath) {
    return requestedProfile;
  }

  return loadPersistedAuthProfileStore()?.profiles[params.profileId];
}

/** Resolve which agent dir owns a persisted profile, accounting for inherited OAuth. */
export function resolvePersistedAuthProfileOwnerAgentDir(params: {
  agentDir?: string;
  profileId: string;
}): string | undefined {
  if (!params.agentDir) {
    return undefined;
  }
  const requestedStore = loadPersistedAuthProfileStore(params.agentDir);
  const requestedPath = resolveAuthStorePath(params.agentDir);
  const mainPath = resolveAuthStorePath();
  if (requestedPath === mainPath) {
    return undefined;
  }

  const mainStore = loadPersistedAuthProfileStore();
  const requestedProfile = requestedStore?.profiles[params.profileId];
  if (requestedProfile) {
    return shouldUseMainOwnerForLocalOAuthCredential({
      local: requestedProfile,
      main: mainStore?.profiles[params.profileId],
    })
      ? undefined
      : params.agentDir;
  }

  return mainStore?.profiles[params.profileId] ? undefined : params.agentDir;
}

/** Load the store shape used when applying local-only auth updates. */
export function ensureAuthProfileStoreForLocalUpdate(agentDir?: string): AuthProfileStore {
  const options: LoadAuthProfileStoreOptions = { syncExternalCli: false };
  const store = loadAuthProfileStoreForAgent(agentDir, options);
  const authPath = resolveAuthStorePath(agentDir);
  const mainAuthPath = resolveAuthStorePath();
  if (!agentDir || authPath === mainAuthPath) {
    return store;
  }

  const mainStore = loadAuthProfileStoreForAgent(undefined, {
    readOnly: true,
    syncExternalCli: false,
  });
  return mergeAuthProfileStores(mainStore, store, {
    preserveBaseRuntimeExternalProfiles: true,
  });
}

export { hasAnyAuthProfileStoreSource, hasLocalAuthProfileStoreSource } from "./source-check.js";

/** Return the current runtime auth-profile snapshot for an agent dir. */
export function getRuntimeAuthProfileStoreSnapshot(
  agentDir?: string,
): AuthProfileStore | undefined {
  return getRuntimeAuthProfileStoreSnapshotImpl(agentDir);
}

/** Replace runtime auth-profile snapshots, used by tests and prepared runtimes. */
export function replaceRuntimeAuthProfileStoreSnapshots(
  entries: Array<{ agentDir?: string; store: AuthProfileStore }>,
): void {
  replaceRuntimeAuthProfileStoreSnapshotsImpl(entries);
}

/** Clear all runtime auth-profile snapshots. */
export function clearRuntimeAuthProfileStoreSnapshots(): void {
  clearRuntimeAuthProfileStoreSnapshotsImpl();
}

/** Save the auth profile store plus sidecar state, preserving runtime overlay metadata. */
export function saveAuthProfileStore(
  store: AuthProfileStore,
  agentDir?: string,
  options?: SaveAuthProfileStoreOptions,
  database?: OpenClawAgentDatabase,
): void {
  const localStore = buildLocalAuthProfileStoreForSave({ store, agentDir, options });
  const existingRaw = readPersistedAuthProfileStoreRaw(agentDir, database);
  const payload = preserveLegacyOAuthRefsOnSave({
    payload: buildPersistedAuthProfileSecretsStore(localStore),
    existingRaw,
  });
  if (!isDeepStrictEqual(existingRaw, payload)) {
    writePersistedAuthProfileStoreRaw(payload, agentDir, database);
  }
  if (database) {
    writePersistedAuthProfileStateRaw(
      buildPersistedAuthProfileState(localStore),
      agentDir,
      database,
    );
  } else {
    savePersistedAuthProfileState(localStore, agentDir);
  }
  if (hasRuntimeAuthProfileStoreSnapshot(agentDir)) {
    const existingRuntimeStore = getRuntimeAuthProfileStoreSnapshot(agentDir);
    const nextRuntimeStore = buildRuntimeAuthProfileStoreForSave({ store, agentDir, options });
    setRuntimeAuthProfileStoreSnapshot(
      existingRuntimeStore
        ? mergeRuntimeExternalProfileReferences({
            next: nextRuntimeStore,
            existing: existingRuntimeStore,
          })
        : nextRuntimeStore,
      agentDir,
    );
>>>>>>> upstream/main
  }
}
