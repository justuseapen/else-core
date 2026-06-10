<<<<<<< HEAD
import { describePackageManifestContract } from "../../../test/helpers/plugins/package-manifest-contract.js";
=======
// Package manifest contract tests cover plugin package manifest requirements.
import { describePackageManifestContract } from "openclaw/plugin-sdk/plugin-test-contracts";
>>>>>>> upstream/main

type PackageManifestContractParams = Parameters<typeof describePackageManifestContract>[0];

const packageManifestContractTests: PackageManifestContractParams[] = [
<<<<<<< HEAD
  { pluginId: "bluebubbles", minHostVersionBaseline: "2026.3.22" },
  {
    pluginId: "discord",
    runtimeDeps: ["@buape/carbon", "https-proxy-agent"],
=======
  {
    pluginId: "discord",
    pluginLocalRuntimeDeps: ["@discordjs/voice", "discord-api-types", "libopus-wasm"],
>>>>>>> upstream/main
    minHostVersionBaseline: "2026.3.22",
  },
  {
    pluginId: "feishu",
<<<<<<< HEAD
    runtimeDeps: ["@larksuiteoapi/node-sdk"],
    minHostVersionBaseline: "2026.3.22",
  },
  { pluginId: "googlechat", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "irc", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "line", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "matrix", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "mattermost", minHostVersionBaseline: "2026.3.22" },
  {
    pluginId: "memory-lancedb",
    runtimeDeps: ["@lancedb/lancedb"],
    minHostVersionBaseline: "2026.3.22",
  },
  { pluginId: "msteams", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "nextcloud-talk", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "nostr", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "slack", runtimeDeps: ["@slack/bolt"] },
  { pluginId: "synology-chat", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "telegram", runtimeDeps: ["grammy"] },
=======
    pluginLocalRuntimeDeps: ["@larksuiteoapi/node-sdk"],
    minHostVersionBaseline: "2026.3.22",
  },
  { pluginId: "google" },
  { pluginId: "google-meet" },
  {
    pluginId: "googlechat",
    pluginLocalRuntimeDeps: ["gaxios", "google-auth-library"],
    minHostVersionBaseline: "2026.3.22",
  },
  { pluginId: "irc", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "line", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "amazon-bedrock" },
  { pluginId: "amazon-bedrock-mantle" },
  {
    pluginId: "diffs",
    pluginLocalRuntimeDeps: ["@pierre/diffs", "@pierre/theme"],
  },
  { pluginId: "file-transfer" },
  {
    pluginId: "matrix",
    pluginLocalRuntimeDeps: [
      "@matrix-org/matrix-sdk-crypto-nodejs",
      "@matrix-org/matrix-sdk-crypto-wasm",
      "fake-indexeddb",
      "matrix-js-sdk",
      "music-metadata",
    ],
    minHostVersionBaseline: "2026.3.22",
  },
  { pluginId: "mattermost", minHostVersionBaseline: "2026.3.22" },
  {
    pluginId: "memory-lancedb",
    pluginLocalRuntimeDeps: ["@lancedb/lancedb", "apache-arrow"],
    minHostVersionBaseline: "2026.3.22",
  },
  {
    pluginId: "msteams",
    pluginLocalRuntimeDeps: ["@azure/identity", "@microsoft/teams.apps"],
    minHostVersionBaseline: "2026.3.22",
  },
  { pluginId: "nextcloud-talk", minHostVersionBaseline: "2026.3.22" },
  {
    pluginId: "nostr",
    pluginLocalRuntimeDeps: ["nostr-tools"],
    minHostVersionBaseline: "2026.3.22",
  },
  { pluginId: "openshell" },
  {
    pluginId: "qqbot",
    pluginLocalRuntimeDeps: ["@tencent-connect/qqbot-connector", "mpg123-decoder", "silk-wasm"],
  },
  { pluginId: "slack" },
  { pluginId: "synology-chat", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "telegram" },
>>>>>>> upstream/main
  { pluginId: "tlon", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "twitch", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "voice-call", minHostVersionBaseline: "2026.3.22" },
  {
    pluginId: "whatsapp",
<<<<<<< HEAD
    runtimeDeps: ["@whiskeysockets/baileys", "jimp"],
=======
    pluginLocalRuntimeDeps: ["audio-decode", "baileys"],
>>>>>>> upstream/main
    minHostVersionBaseline: "2026.3.22",
  },
  { pluginId: "zalo", minHostVersionBaseline: "2026.3.22" },
  { pluginId: "zalouser", minHostVersionBaseline: "2026.3.22" },
];

for (const params of packageManifestContractTests) {
  describePackageManifestContract(params);
}
