<<<<<<< HEAD
import { describe, expect, it, vi } from "vitest";
import { importFreshModule } from "../../../test/helpers/import-fresh.ts";

describe("get-reply module imports", () => {
  it("does not load reset-model runtime on module import", async () => {
    const resetModelRuntimeLoads = vi.fn();
    const sandboxMediaRuntimeLoads = vi.fn();
    vi.doMock("./session-reset-model.runtime.js", async () => {
      resetModelRuntimeLoads();
      return await vi.importActual<typeof import("./session-reset-model.runtime.js")>(
        "./session-reset-model.runtime.js",
      );
    });
    vi.doMock("./stage-sandbox-media.runtime.js", async () => {
      sandboxMediaRuntimeLoads();
      return await vi.importActual<typeof import("./stage-sandbox-media.runtime.js")>(
        "./stage-sandbox-media.runtime.js",
      );
    });

    await importFreshModule<typeof import("./get-reply.js")>(
      import.meta.url,
      "./get-reply.js?scope=no-runtime-imports",
    );

    expect(resetModelRuntimeLoads).not.toHaveBeenCalled();
    expect(sandboxMediaRuntimeLoads).not.toHaveBeenCalled();
    vi.doUnmock("./session-reset-model.runtime.js");
    vi.doUnmock("./stage-sandbox-media.runtime.js");
=======
// Tests get-reply import boundaries for lazy runtime and side-effect control.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const getReplyPath = resolve(dirname(fileURLToPath(import.meta.url)), "get-reply.ts");
const lazyRuntimeSpecifiers = [
  "./session-reset-model.runtime.js",
  "./stage-sandbox-media.runtime.js",
] as const;

function readGetReplyModuleImports() {
  const sourceText = readFileSync(getReplyPath, "utf8");
  const sourceFile = ts.createSourceFile(getReplyPath, sourceText, ts.ScriptTarget.Latest, true);
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
  return { dynamicImports, staticImports };
}

describe("get-reply module imports", () => {
  it("keeps heavy runtime boundaries on dynamic imports", () => {
    const { dynamicImports, staticImports } = readGetReplyModuleImports();

    for (const specifier of lazyRuntimeSpecifiers) {
      expect(staticImports.has(specifier), `${specifier} should stay lazy`).toBe(false);
      expect(dynamicImports.has(specifier), `${specifier} should remain dynamically imported`).toBe(
        true,
      );
    }
>>>>>>> upstream/main
  });
});
