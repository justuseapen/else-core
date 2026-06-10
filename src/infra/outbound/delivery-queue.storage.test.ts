// Verifies SQLite-backed outbound queue storage, metadata, failure updates,
// recovery-state markers, and failed-entry moves.
import path from "node:path";
import { describe, expect, it } from "vitest";
import { openOpenClawStateDatabase } from "../../state/openclaw-state-db.js";
import {
  ackDelivery,
  enqueueDelivery,
  failDelivery,
  loadPendingDeliveries,
  markDeliveryPlatformOutcomeUnknown,
  markDeliveryPlatformSendAttemptStarted,
  moveToFailed,
} from "./delivery-queue.js";
import { installDeliveryQueueTmpDirHooks, readQueuedEntry } from "./delivery-queue.test-helpers.js";

describe("delivery-queue storage", () => {
  const { tmpDir } = installDeliveryQueueTmpDirHooks();
<<<<<<< HEAD
  const queueDir = () => path.join(tmpDir(), "delivery-queue");
  const queueJsonFiles = () => fs.readdirSync(queueDir()).filter((file) => file.endsWith(".json"));
  const enqueueTextDelivery = (params: Parameters<typeof enqueueDelivery>[0], rootDir = tmpDir()) =>
    enqueueDelivery(params, rootDir);
=======
  const enqueueTextDelivery = (params: Parameters<typeof enqueueDelivery>[0], rootDir = tmpDir()) =>
    enqueueDelivery(params, rootDir);

  function readStatus(id: string): string | undefined {
    const { db } = openOpenClawStateDatabase({
      env: { ...process.env, OPENCLAW_STATE_DIR: tmpDir() },
    });
    const row = db
      .prepare("SELECT status FROM delivery_queue_entries WHERE queue_name = 'outbound' AND id = ?")
      .get(id) as { status?: string } | undefined;
    return row?.status;
  }
>>>>>>> upstream/main

  describe("enqueue + ack lifecycle", () => {
    it("creates and removes a queue entry", async () => {
      const id = await enqueueTextDelivery(
        {
          channel: "directchat",
          to: "+1555",
          payloads: [{ text: "hello" }],
          renderedBatchPlan: {
            payloadCount: 1,
            textCount: 1,
            mediaCount: 0,
            voiceCount: 0,
            presentationCount: 0,
            interactiveCount: 0,
            channelDataCount: 0,
            items: [{ index: 0, kinds: ["text"] as const, text: "hello", mediaUrls: [] }],
          },
          bestEffort: true,
          gifPlayback: true,
          silent: true,
          gatewayClientScopes: ["operator.write"],
          mirror: {
            sessionKey: "agent:main:main",
            text: "hello",
            mediaUrls: ["https://example.com/file.png"],
          },
          session: {
            key: "agent:main:main",
            agentId: "agent-main",
            requesterAccountId: "acct-1",
            requesterSenderId: "sender-1",
          },
        },
        tmpDir(),
      );
<<<<<<< HEAD

      expect(queueJsonFiles()).toEqual([`${id}.json`]);

=======
>>>>>>> upstream/main
      const entry = readQueuedEntry(tmpDir(), id);
      expect(entry.id).toBe(id);
      expect(entry.channel).toBe("directchat");
      expect(entry.to).toBe("+1555");
      expect(entry.renderedBatchPlan).toEqual({
        payloadCount: 1,
        textCount: 1,
        mediaCount: 0,
        voiceCount: 0,
        presentationCount: 0,
        interactiveCount: 0,
        channelDataCount: 0,
        items: [{ index: 0, kinds: ["text"] as const, text: "hello", mediaUrls: [] }],
      });
      expect(entry.bestEffort).toBe(true);
      expect(entry.gifPlayback).toBe(true);
      expect(entry.silent).toBe(true);
      expect(entry.gatewayClientScopes).toEqual(["operator.write"]);
      expect(entry.mirror).toEqual({
        sessionKey: "agent:main:main",
        text: "hello",
        mediaUrls: ["https://example.com/file.png"],
      });
      expect(entry.session).toEqual({
        key: "agent:main:main",
        agentId: "agent-main",
        requesterAccountId: "acct-1",
        requesterSenderId: "sender-1",
      });
      expect(entry.retryCount).toBe(0);
      expect(entry.payloads).toEqual([{ text: "hello" }]);

      await ackDelivery(id, tmpDir());
<<<<<<< HEAD
      expect(queueJsonFiles()).toHaveLength(0);
=======
      expect(await loadPendingDeliveries(tmpDir())).toHaveLength(0);
>>>>>>> upstream/main
    });

    it("ack is idempotent (no error on missing file)", async () => {
      await expect(ackDelivery("nonexistent-id", tmpDir())).resolves.toBeUndefined();
    });

<<<<<<< HEAD
    it.each([
      {
        name: "ack cleans up leftover .delivered marker when .json is already gone",
        payload: { channel: "whatsapp", to: "+1", payloads: [{ text: "stale-marker" }] },
        prepareDeliveredMarker: true,
        action: (id: string) => ackDelivery(id, tmpDir()),
      },
      {
        name: "ack removes .delivered marker so recovery does not replay",
        payload: { channel: "whatsapp", to: "+1", payloads: [{ text: "ack-test" }] },
        action: (id: string) => ackDelivery(id, tmpDir()),
      },
      {
        name: "loadPendingDeliveries cleans up stale .delivered markers without replaying",
        payload: { channel: "telegram", to: "99", payloads: [{ text: "stale" }] },
        prepareDeliveredMarker: true,
        action: () => loadPendingDeliveries(tmpDir()),
        expectedEntriesLength: 0,
      },
    ])("$name", async ({ payload, prepareDeliveredMarker, action, expectedEntriesLength }) => {
      const id = await enqueueTextDelivery(payload);
      const deliveredPath = path.join(queueDir(), `${id}.delivered`);

      if (prepareDeliveredMarker) {
        fs.renameSync(path.join(queueDir(), `${id}.json`), deliveredPath);
      }

      const entries = await action(id);

      if (expectedEntriesLength !== undefined) {
        expect(entries).toHaveLength(expectedEntriesLength);
      }
      expect(fs.existsSync(deliveredPath)).toBe(false);
      expect(fs.existsSync(path.join(queueDir(), `${id}.json`))).toBe(false);
=======
    it("removes acked entries from pending recovery", async () => {
      const id = await enqueueTextDelivery({
        channel: "directchat",
        to: "+1",
        payloads: [{ text: "ack-test" }],
      });

      await ackDelivery(id, tmpDir());

      expect(await loadPendingDeliveries(tmpDir())).toHaveLength(0);
      expect(readStatus(id)).toBeUndefined();
>>>>>>> upstream/main
    });
  });

  describe("failDelivery", () => {
<<<<<<< HEAD
    it("increments retryCount, records attempt time, and sets lastError", async () => {
=======
    it("marks entries as send-attempt-started before platform I/O", async () => {
>>>>>>> upstream/main
      const id = await enqueueTextDelivery(
        {
          channel: "forum",
          to: "123",
          payloads: [{ text: "test" }],
        },
        tmpDir(),
      );

      await markDeliveryPlatformSendAttemptStarted(id, tmpDir());

      const entry = readQueuedEntry(tmpDir(), id);
      expect(typeof entry.platformSendStartedAt).toBe("number");
      expect((entry.platformSendStartedAt as number) > 0).toBe(true);
      expect(entry.recoveryState).toBe("send_attempt_started");
      expect(entry.retryCount).toBe(0);
    });

    it("marks entries as unknown-after-send after platform I/O returns", async () => {
      const id = await enqueueTextDelivery(
        {
          channel: "forum",
          to: "123",
          payloads: [{ text: "test" }],
        },
        tmpDir(),
      );

      await markDeliveryPlatformSendAttemptStarted(id, tmpDir());
      await markDeliveryPlatformOutcomeUnknown(id, tmpDir());

      const entry = readQueuedEntry(tmpDir(), id);
      expect(typeof entry.platformSendStartedAt).toBe("number");
      expect((entry.platformSendStartedAt as number) > 0).toBe(true);
      expect(entry.recoveryState).toBe("unknown_after_send");
      expect(entry.retryCount).toBe(0);
    });

    it("increments retryCount, records attempt time, and sets lastError", async () => {
      const id = await enqueueTextDelivery(
        {
          channel: "forum",
          to: "123",
          payloads: [{ text: "test" }],
        },
        tmpDir(),
      );

      await failDelivery(id, "connection refused", tmpDir());

      const entry = readQueuedEntry(tmpDir(), id);
      expect(entry.retryCount).toBe(1);
      expect(typeof entry.lastAttemptAt).toBe("number");
      expect((entry.lastAttemptAt as number) > 0).toBe(true);
      expect(entry.lastError).toBe("connection refused");
    });
  });

  describe("moveToFailed", () => {
    it("moves entry to failed/ subdirectory", async () => {
      const id = await enqueueTextDelivery(
        {
          channel: "workspace",
          to: "#general",
          payloads: [{ text: "hi" }],
        },
        tmpDir(),
      );

      await moveToFailed(id, tmpDir());

<<<<<<< HEAD
      const failedDir = path.join(queueDir(), "failed");
      expect(fs.existsSync(path.join(queueDir(), `${id}.json`))).toBe(false);
      expect(fs.existsSync(path.join(failedDir, `${id}.json`))).toBe(true);
=======
      expect(await loadPendingDeliveries(tmpDir())).toHaveLength(0);
      expect(readStatus(id)).toBe("failed");
    });

    it("does not remove failed entries when a stale ack arrives", async () => {
      const id = await enqueueTextDelivery(
        {
          channel: "workspace",
          to: "#general",
          payloads: [{ text: "hi" }],
        },
        tmpDir(),
      );

      await moveToFailed(id, tmpDir());
      await ackDelivery(id, tmpDir());

      expect(readStatus(id)).toBe("failed");
>>>>>>> upstream/main
    });
  });

  describe("loadPendingDeliveries", () => {
    it("returns empty array for an empty state database", async () => {
      expect(await loadPendingDeliveries(path.join(tmpDir(), "no-such-dir"))).toStrictEqual([]);
    });

    it("loads multiple entries", async () => {
<<<<<<< HEAD
      await enqueueTextDelivery({ channel: "whatsapp", to: "+1", payloads: [{ text: "a" }] });
      await enqueueTextDelivery({ channel: "telegram", to: "2", payloads: [{ text: "b" }] });
=======
      await enqueueTextDelivery({ channel: "directchat", to: "+1", payloads: [{ text: "a" }] });
      await enqueueTextDelivery({ channel: "forum", to: "2", payloads: [{ text: "b" }] });
>>>>>>> upstream/main

      expect(await loadPendingDeliveries(tmpDir())).toHaveLength(2);
    });

    it("persists gateway caller scopes for replay", async () => {
      const id = await enqueueTextDelivery(
        {
          channel: "forum",
          to: "2",
          payloads: [{ text: "b" }],
          gatewayClientScopes: ["operator.write"],
        },
        tmpDir(),
      );

      const entry = readQueuedEntry(tmpDir(), id);
      expect(entry.gatewayClientScopes).toEqual(["operator.write"]);
    });

<<<<<<< HEAD
    it("backfills lastAttemptAt for legacy retry entries during load", async () => {
      const id = await enqueueTextDelivery({
        channel: "whatsapp",
        to: "+1",
        payloads: [{ text: "legacy" }],
      });
      const filePath = path.join(queueDir(), `${id}.json`);
      const legacyEntry = readQueuedEntry(tmpDir(), id);
      legacyEntry.retryCount = 2;
      delete legacyEntry.lastAttemptAt;
      fs.writeFileSync(filePath, JSON.stringify(legacyEntry), "utf-8");
=======
    it("persists session context for recovery replay", async () => {
      const id = await enqueueTextDelivery(
        {
          channel: "forum",
          to: "2",
          payloads: [{ text: "b" }],
          session: {
            key: "agent:main:main",
            agentId: "agent-main",
            requesterAccountId: "acct-1",
            requesterSenderId: "sender-1",
            requesterSenderName: "Sender One",
            requesterSenderUsername: "sender.one",
            requesterSenderE164: "+15551234567",
          },
        },
        tmpDir(),
      );
>>>>>>> upstream/main

      const entry = readQueuedEntry(tmpDir(), id);
      expect(entry.session).toEqual({
        key: "agent:main:main",
        agentId: "agent-main",
        requesterAccountId: "acct-1",
        requesterSenderId: "sender-1",
        requesterSenderName: "Sender One",
        requesterSenderUsername: "sender.one",
        requesterSenderE164: "+15551234567",
      });
    });
  });
});
