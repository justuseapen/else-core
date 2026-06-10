<<<<<<< HEAD
import fs from "node:fs/promises";
import path from "node:path";
import { buildQaScenarioPlanMarkdown, QA_AGENT_IDENTITY_MARKDOWN } from "./qa-agent-bootstrap.js";
import { readQaBootstrapScenarioCatalog } from "./scenario-catalog.js";
=======
// Qa Lab plugin module implements qa agent workspace behavior.
import fs from "node:fs/promises";
import path from "node:path";
import { buildQaScenarioPlanMarkdown, readQaAgentIdentityMarkdown } from "./qa-agent-bootstrap.js";
import { readQaBootstrapScenarioCatalog, readQaScenarioPackMarkdown } from "./scenario-catalog.js";
>>>>>>> upstream/main

export async function seedQaAgentWorkspace(params: { workspaceDir: string; repoRoot?: string }) {
  const catalog = readQaBootstrapScenarioCatalog();
  await fs.mkdir(params.workspaceDir, { recursive: true });

  const kickoffTask = catalog.kickoffTask || "QA mission unavailable.";
  const files = new Map<string, string>([
<<<<<<< HEAD
    ["IDENTITY.md", QA_AGENT_IDENTITY_MARKDOWN],
    ["QA_KICKOFF_TASK.md", kickoffTask],
    ["QA_SCENARIO_PLAN.md", buildQaScenarioPlanMarkdown()],
=======
    ["IDENTITY.md", readQaAgentIdentityMarkdown()],
    ["QA_KICKOFF_TASK.md", kickoffTask],
    ["QA_SCENARIO_PLAN.md", buildQaScenarioPlanMarkdown()],
    ["QA_SCENARIOS.md", readQaScenarioPackMarkdown()],
>>>>>>> upstream/main
  ]);

  if (params.repoRoot) {
    files.set(
      "README.md",
      `# QA Workspace

- repo: ./repo/
- kickoff: ./QA_KICKOFF_TASK.md
- scenario plan: ./QA_SCENARIO_PLAN.md
<<<<<<< HEAD
=======
- scenario pack: ./QA_SCENARIOS.md
>>>>>>> upstream/main
- identity: ./IDENTITY.md

The mounted repo source should be available read-only under \`./repo/\`.
`,
    );
  }

  await Promise.all(
    [...files.entries()].map(async ([name, body]) => {
      await fs.writeFile(path.join(params.workspaceDir, name), `${body.trim()}\n`, "utf8");
    }),
  );

  if (params.repoRoot) {
    const repoLinkPath = path.join(params.workspaceDir, "repo");
    await fs.rm(repoLinkPath, { force: true, recursive: true });
    await fs.symlink(params.repoRoot, repoLinkPath, "dir");
  }
}
