<<<<<<< HEAD:src/agents/skills/local-loader.ts
import fs from "node:fs";
import path from "node:path";
import { openVerifiedFileSync } from "../../infra/safe-open-sync.js";
import { parseFrontmatter, resolveSkillInvocationPolicy } from "./frontmatter.js";
import { createSyntheticSourceInfo, type Skill } from "./skill-contract.js";

function isPathWithinRoot(rootRealPath: string, candidatePath: string): boolean {
  const relative = path.relative(rootRealPath, candidatePath);
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))
  );
}

=======
// Local skill loader reads skill definitions from local filesystem roots.
import fs from "node:fs";
import path from "node:path";
import { openRootFileSync } from "../../infra/boundary-file-read.js";
import type { ParsedSkillFrontmatter } from "../types.js";
import { parseFrontmatter, resolveSkillInvocationPolicy } from "./frontmatter.js";
import { createSyntheticSourceInfo, type Skill } from "./skill-contract.js";
import { computeSkillPromptVersion } from "./skill-version.js";

type LoadedLocalSkill = {
  skill: Skill;
  frontmatter: ParsedSkillFrontmatter;
};

// Read SKILL.md through the root boundary helper so symlinks cannot escape the skill root.
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
function readSkillFileSync(params: {
  rootRealPath: string;
  filePath: string;
  maxBytes?: number;
}): string | null {
<<<<<<< HEAD:src/agents/skills/local-loader.ts
  const opened = openVerifiedFileSync({
    filePath: params.filePath,
    rejectPathSymlink: true,
=======
  const opened = openRootFileSync({
    absolutePath: params.filePath,
    rootPath: params.rootRealPath,
    rootRealPath: params.rootRealPath,
    boundaryLabel: "skill root",
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
    maxBytes: params.maxBytes,
  });
  if (!opened.ok) {
    return null;
  }
  try {
<<<<<<< HEAD:src/agents/skills/local-loader.ts
    if (!isPathWithinRoot(params.rootRealPath, opened.path)) {
      return null;
    }
=======
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
    return fs.readFileSync(opened.fd, "utf8");
  } finally {
    fs.closeSync(opened.fd);
  }
}

function loadSingleSkillDirectory(params: {
  skillDir: string;
  source: string;
  rootRealPath: string;
  maxBytes?: number;
<<<<<<< HEAD:src/agents/skills/local-loader.ts
}): Skill | null {
=======
}): LoadedLocalSkill | null {
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
  const skillFilePath = path.join(params.skillDir, "SKILL.md");
  const raw = readSkillFileSync({
    rootRealPath: params.rootRealPath,
    filePath: skillFilePath,
    maxBytes: params.maxBytes,
  });
  if (!raw) {
    return null;
  }

  let frontmatter: Record<string, string>;
  try {
    frontmatter = parseFrontmatter(raw);
  } catch {
    return null;
  }

  const fallbackName = path.basename(params.skillDir).trim();
  const name = frontmatter.name?.trim() || fallbackName;
  const description = frontmatter.description?.trim();
  if (!name || !description) {
    return null;
  }
  const invocation = resolveSkillInvocationPolicy(frontmatter);
  const filePath = path.resolve(skillFilePath);
  const baseDir = path.resolve(params.skillDir);

  return {
<<<<<<< HEAD:src/agents/skills/local-loader.ts
    name,
    description,
    filePath,
    baseDir,
    source: params.source,
    sourceInfo: createSyntheticSourceInfo(filePath, {
      source: params.source,
      baseDir,
      scope: "project",
      origin: "top-level",
    }),
    disableModelInvocation: invocation.disableModelInvocation,
=======
    skill: {
      name,
      description,
      filePath,
      baseDir,
      promptVersion: computeSkillPromptVersion(raw),
      source: params.source,
      sourceInfo: createSyntheticSourceInfo(filePath, {
        source: params.source,
        baseDir,
        scope: "project",
        origin: "top-level",
      }),
      disableModelInvocation: invocation.disableModelInvocation,
    },
    frontmatter,
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
  };
}

function listCandidateSkillDirs(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules",
      )
      .map((entry) => path.join(dir, entry.name))
<<<<<<< HEAD:src/agents/skills/local-loader.ts
      .sort((left, right) => left.localeCompare(right));
=======
      .toSorted((left, right) => left.localeCompare(right));
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
  } catch {
    return [];
  }
}

<<<<<<< HEAD:src/agents/skills/local-loader.ts
export function loadSkillsFromDirSafe(params: { dir: string; source: string; maxBytes?: number }): {
  skills: Skill[];
=======
/** Loads skills from a local directory while turning read/parse failures into diagnostics. */
export function loadSkillsFromDirSafe(params: { dir: string; source: string; maxBytes?: number }): {
  skills: Skill[];
  frontmatterByFilePath: ReadonlyMap<string, ParsedSkillFrontmatter>;
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
} {
  const rootDir = path.resolve(params.dir);
  let rootRealPath: string;
  try {
    rootRealPath = fs.realpathSync(rootDir);
  } catch {
<<<<<<< HEAD:src/agents/skills/local-loader.ts
    return { skills: [] };
=======
    return { skills: [], frontmatterByFilePath: new Map() };
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
  }

  const rootSkill = loadSingleSkillDirectory({
    skillDir: rootDir,
    source: params.source,
    rootRealPath,
    maxBytes: params.maxBytes,
  });
  if (rootSkill) {
<<<<<<< HEAD:src/agents/skills/local-loader.ts
    return { skills: [rootSkill] };
  }

  const skills = listCandidateSkillDirs(rootDir)
=======
    return {
      skills: [rootSkill.skill],
      frontmatterByFilePath: new Map([[rootSkill.skill.filePath, rootSkill.frontmatter]]),
    };
  }

  const loadedSkills = listCandidateSkillDirs(rootDir)
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
    .map((skillDir) =>
      loadSingleSkillDirectory({
        skillDir,
        source: params.source,
        rootRealPath,
        maxBytes: params.maxBytes,
      }),
    )
<<<<<<< HEAD:src/agents/skills/local-loader.ts
    .filter((skill): skill is Skill => skill !== null);

  return { skills };
=======
    .filter((skill): skill is LoadedLocalSkill => skill !== null);
  const frontmatterByFilePath = new Map<string, ParsedSkillFrontmatter>();
  for (const loaded of loadedSkills) {
    frontmatterByFilePath.set(loaded.skill.filePath, loaded.frontmatter);
  }

  return {
    skills: loadedSkills.map((loaded) => loaded.skill),
    frontmatterByFilePath,
  };
>>>>>>> upstream/main:src/skills/loading/local-loader.ts
}

export function readSkillFrontmatterSafe(params: {
  rootDir: string;
  filePath: string;
  maxBytes?: number;
}): Record<string, string> | null {
  let rootRealPath: string;
  try {
    rootRealPath = fs.realpathSync(path.resolve(params.rootDir));
  } catch {
    return null;
  }
  const raw = readSkillFileSync({
    rootRealPath,
    filePath: path.resolve(params.filePath),
    maxBytes: params.maxBytes,
  });
  if (!raw) {
    return null;
  }
  try {
    return parseFrontmatter(raw);
  } catch {
    return null;
  }
}
