<<<<<<< HEAD
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const libraryPath = resolve(dirname(fileURLToPath(import.meta.url)), "library.ts");
=======
// Tests library entrypoint exports and package boundary behavior.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const libraryPath = new URL("./library.ts", import.meta.url);
>>>>>>> upstream/main
const lazyRuntimeSpecifiers = [
  "./auto-reply/reply.runtime.js",
  "./cli/prompt.js",
  "./infra/binaries.js",
  "./process/exec.js",
  "./plugins/runtime/runtime-web-channel-plugin.js",
] as const;

function readLibraryModuleImports() {
  const sourceText = readFileSync(libraryPath, "utf8");
<<<<<<< HEAD
  const sourceFile = ts.createSourceFile(libraryPath, sourceText, ts.ScriptTarget.Latest, true);
  const staticImports = new Set<string>();
  const dynamicImports = new Set<string>();

  function visit(node: ts.Node) {
    if (
      ts.isImportDeclaration(node) &&
      ts.isStringLiteral(node.moduleSpecifier) &&
      !node.importClause?.isTypeOnly
    ) {
      staticImports.add(node.moduleSpecifier.text);
    }

    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      dynamicImports.add(node.arguments[0].text);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
=======
  const staticImports = new Set<string>();
  const dynamicImports = new Set<string>();
  const staticImportPattern = /(?:^|\n)\s*import\s+(?!type\b)[\s\S]*?\s+from\s+["']([^"']+)["']/g;
  const dynamicImportPattern = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

  for (const match of sourceText.matchAll(staticImportPattern)) {
    staticImports.add(match[1]);
  }
  for (const match of sourceText.matchAll(dynamicImportPattern)) {
    dynamicImports.add(match[1]);
  }
>>>>>>> upstream/main
  return { dynamicImports, staticImports };
}

describe("library module imports", () => {
  it("keeps lazy runtime boundaries on dynamic imports", () => {
    const { dynamicImports, staticImports } = readLibraryModuleImports();

    for (const specifier of lazyRuntimeSpecifiers) {
      expect(staticImports.has(specifier), `${specifier} should stay lazy`).toBe(false);
      expect(dynamicImports.has(specifier), `${specifier} should remain dynamically imported`).toBe(
        true,
      );
    }
  });
});
