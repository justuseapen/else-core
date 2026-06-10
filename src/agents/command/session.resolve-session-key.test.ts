<<<<<<< HEAD
=======
// Covers cross-store session-key resolution for multi-agent session stores.
>>>>>>> upstream/main
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import type { SessionEntry } from "../../config/sessions/types.js";

const hoisted = vi.hoisted(() => ({
<<<<<<< HEAD
  loadSessionStoreMock: vi.fn<(storePath: string) => Record<string, SessionEntry>>(),
  listAgentIdsMock: vi.fn<() => string[]>(),
}));

vi.mock("../../config/sessions.js", async () => {
  const actual = await vi.importActual<typeof import("../../config/sessions.js")>(
    "../../config/sessions.js",
  );
  return {
    ...actual,
    loadSessionStore: (storePath: string) => hoisted.loadSessionStoreMock(storePath),
    resolveStorePath: (store?: string, params?: { agentId?: string }) =>
      `/stores/${params?.agentId ?? "main"}.json`,
    resolveAgentIdFromSessionKey: () => "main",
    resolveExplicitAgentSessionKey: () => undefined,
  };
});

vi.mock("../agent-scope.js", () => ({
  listAgentIds: () => hoisted.listAgentIdsMock(),
}));

const { resolveSessionKeyForRequest } = await import("./session.js");
=======
  loadSessionStoreMock:
    vi.fn<(storePath: string, opts?: { clone?: boolean }) => Record<string, SessionEntry>>(),
  listAgentIdsMock: vi.fn<() => string[]>(),
}));

vi.mock("../../config/sessions/store-load.js", () => ({
  loadSessionStore: (storePath: string, opts?: { clone?: boolean }) =>
    hoisted.loadSessionStoreMock(storePath, opts),
}));

vi.mock("../../config/sessions/paths.js", () => ({
  resolveStorePath: (_store?: string, params?: { agentId?: string }) =>
    `/stores/${params?.agentId ?? "main"}.json`,
}));

vi.mock("../../config/sessions/main-session.js", () => ({
  resolveAgentIdFromSessionKey: () => "main",
  resolveExplicitAgentSessionKey: () => undefined,
}));

vi.mock("../agent-scope.js", () => ({
  listAgentIds: () => hoisted.listAgentIdsMock(),
  resolveDefaultAgentId: () => "main",
}));

const { resolveSessionKeyForRequest, resolveStoredSessionKeyForSessionId } =
  await import("./session.js");

function mockSessionStores(storesByPath: Record<string, Record<string, SessionEntry>>): void {
  // Store paths are the routing boundary here; returning the exact object lets
  // tests assert whether callers borrowed or cloned the selected store.
  hoisted.loadSessionStoreMock.mockImplementation((storePath) => storesByPath[storePath] ?? {});
}

function expectResolvedRequestSession(params: {
  sessionId: string;
  sessionKey: string;
  sessionStore: Record<string, SessionEntry>;
  storePath: string;
}): void {
  const result = resolveSessionKeyForRequest({
    cfg: {
      session: {
        store: "/stores/{agentId}.json",
      },
    } satisfies OpenClawConfig,
    sessionId: params.sessionId,
  });

  expect(result.sessionKey).toBe(params.sessionKey);
  expect(result.sessionStore).toBe(params.sessionStore);
  expect(result.storePath).toBe(params.storePath);
}
>>>>>>> upstream/main

describe("resolveSessionKeyForRequest", () => {
  beforeEach(() => {
    hoisted.loadSessionStoreMock.mockReset();
    hoisted.listAgentIdsMock.mockReset();
    hoisted.listAgentIdsMock.mockReturnValue(["main", "other"]);
  });

  it("prefers the current store when equal duplicates exist across stores", () => {
    const mainStore = {
      "agent:main:main": { sessionId: "sid", updatedAt: 10 },
    } satisfies Record<string, SessionEntry>;
    const otherStore = {
      "agent:other:main": { sessionId: "sid", updatedAt: 10 },
    } satisfies Record<string, SessionEntry>;
<<<<<<< HEAD
    hoisted.loadSessionStoreMock.mockImplementation((storePath) => {
      if (storePath === "/stores/main.json") {
        return mainStore;
      }
      if (storePath === "/stores/other.json") {
        return otherStore;
      }
      return {};
    });

    const result = resolveSessionKeyForRequest({
      cfg: {
        session: {
          store: "/stores/{agentId}.json",
        },
      } satisfies OpenClawConfig,
      sessionId: "sid",
    });

    expect(result.sessionKey).toBe("agent:main:main");
    expect(result.sessionStore).toBe(mainStore);
    expect(result.storePath).toBe("/stores/main.json");
  });

  it("keeps a cross-store structural winner over a newer local fuzzy duplicate", () => {
=======
    mockSessionStores({
      "/stores/main.json": mainStore,
      "/stores/other.json": otherStore,
    });

    expectResolvedRequestSession({
      sessionId: "sid",
      sessionKey: "agent:main:main",
      sessionStore: mainStore,
      storePath: "/stores/main.json",
    });
  });

  it("keeps a cross-store structural winner over a newer local fuzzy duplicate", () => {
    // Structural keys beat fuzzy timestamp matches so ACP/subagent resumes do
    // not accidentally attach to a newer generic main-session duplicate.
>>>>>>> upstream/main
    const mainStore = {
      "agent:main:main": { sessionId: "sid", updatedAt: 20 },
    } satisfies Record<string, SessionEntry>;
    const otherStore = {
      "agent:other:acp:sid": { sessionId: "sid", updatedAt: 10 },
    } satisfies Record<string, SessionEntry>;
<<<<<<< HEAD
    hoisted.loadSessionStoreMock.mockImplementation((storePath) => {
      if (storePath === "/stores/main.json") {
        return mainStore;
      }
      if (storePath === "/stores/other.json") {
        return otherStore;
=======
    mockSessionStores({
      "/stores/main.json": mainStore,
      "/stores/other.json": otherStore,
    });

    expectResolvedRequestSession({
      sessionId: "sid",
      sessionKey: "agent:other:acp:sid",
      sessionStore: otherStore,
      storePath: "/stores/other.json",
    });
  });

  it("scopes stored session-key lookup to the requested agent store", () => {
    const embeddedAgentStore = {
      "agent:embedded-agent:main": { sessionId: "other-session", updatedAt: 2 },
      "agent:embedded-agent:work": { sessionId: "resume-agent-1", updatedAt: 1 },
    } satisfies Record<string, SessionEntry>;
    hoisted.loadSessionStoreMock.mockImplementation((storePath) => {
      if (storePath === "/stores/embedded-agent.json") {
        return embeddedAgentStore;
>>>>>>> upstream/main
      }
      return {};
    });

<<<<<<< HEAD
=======
    const result = resolveStoredSessionKeyForSessionId({
      cfg: {
        session: {
          store: "/stores/{agentId}.json",
        },
      } satisfies OpenClawConfig,
      sessionId: "resume-agent-1",
      agentId: "embedded-agent",
    });

    expect(result.sessionKey).toBe("agent:embedded-agent:work");
    expect(result.sessionStore).toBe(embeddedAgentStore);
    expect(result.storePath).toBe("/stores/embedded-agent.json");
    expect(hoisted.loadSessionStoreMock).toHaveBeenCalledTimes(1);
  });

  it("borrows session stores when requested", () => {
    // clone=false is used by callers that intend to mutate the selected store,
    // so the resolver must pass that option through every candidate load.
    const mainStore = {
      "agent:main:main": { sessionId: "sid", updatedAt: 10 },
    } satisfies Record<string, SessionEntry>;
    const otherStore = {
      "agent:other:acp:sid": { sessionId: "sid", updatedAt: 20 },
    } satisfies Record<string, SessionEntry>;
    mockSessionStores({
      "/stores/main.json": mainStore,
      "/stores/other.json": otherStore,
    });

>>>>>>> upstream/main
    const result = resolveSessionKeyForRequest({
      cfg: {
        session: {
          store: "/stores/{agentId}.json",
        },
      } satisfies OpenClawConfig,
      sessionId: "sid",
<<<<<<< HEAD
=======
      clone: false,
>>>>>>> upstream/main
    });

    expect(result.sessionKey).toBe("agent:other:acp:sid");
    expect(result.sessionStore).toBe(otherStore);
<<<<<<< HEAD
    expect(result.storePath).toBe("/stores/other.json");
=======
    expect(hoisted.loadSessionStoreMock).toHaveBeenCalledWith("/stores/main.json", {
      clone: false,
    });
    expect(hoisted.loadSessionStoreMock).toHaveBeenCalledWith("/stores/other.json", {
      clone: false,
    });
>>>>>>> upstream/main
  });
});
