// scripts/check-docs.mjs
// Locks in TSDoc coverage for the public surface of @strait/ui.
//
// Three rules, all scoped to declarations that physically live in the
// component file being checked (re-export shims resolve to their owner file
// and are checked there, not twice):
//   1. Every exported component (PascalCase function/const that renders) must
//      carry a TSDoc block directly on its declaration.
//   2. Every exported `*Props` interface/type alias must carry a TSDoc block.
//   3. Every explicitly-declared property inside an exported `*Props` type
//      (interface members, or inline type-literal members of an intersection)
//      must carry a TSDoc block. Props inherited via spread (`ComponentProps`,
//      a primitive's `*.Props`) are out of scope — they are documented upstream.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Node, Project } from "ts-morph";

const COMPONENTS_DIR = "packages/ui/src/components";

const isSource = (f) =>
  f.endsWith(".tsx") &&
  !f.endsWith(".stories.tsx") &&
  !f.endsWith(".test.tsx");

const isPascalCase = (name) => /^[A-Z]/.test(name);

/** A declaration whose shape is "a React component value". */
function isComponentDecl(decl) {
  if (Node.isFunctionDeclaration(decl)) {
    return true;
  }
  if (Node.isVariableDeclaration(decl)) {
    const init = decl.getInitializer();
    return (
      Node.isArrowFunction(init) ||
      Node.isFunctionExpression(init) ||
      // forwardRef(...) / memo(...) and similar HOC wrappers
      Node.isCallExpression(init)
    );
  }
  return false;
}

/** JSDoc blocks attached to a declaration (variables hang theirs on the statement). */
function jsDocsOf(decl) {
  if (Node.isVariableDeclaration(decl)) {
    return decl.getVariableStatement()?.getJsDocs() ?? [];
  }
  if (typeof decl.getJsDocs === "function") {
    return decl.getJsDocs();
  }
  return [];
}

const hasDoc = (decl) =>
  jsDocsOf(decl).some((d) => (d.getDescription()?.trim().length ?? 0) > 0);

/** Property signatures explicitly declared by an exported `*Props` type. */
function ownPropSignatures(decl) {
  if (Node.isInterfaceDeclaration(decl)) {
    return decl.getProperties();
  }
  if (Node.isTypeAliasDeclaration(decl)) {
    const node = decl.getTypeNode();
    if (!node) {
      return [];
    }
    // Collect inline type-literals: `{ ... }` and each arm of `A & { ... }`.
    const literals = Node.isTypeLiteral(node)
      ? [node]
      : Node.isIntersectionTypeNode(node)
        ? node.getTypeNodes().filter((n) => Node.isTypeLiteral(n))
        : [];
    return literals.flatMap((lit) => lit.getProperties());
  }
  return [];
}

const project = new Project({
  skipAddingFilesFromTsConfig: true,
  skipFileDependencyResolution: true,
  compilerOptions: { allowJs: false, jsx: 4 /* react-jsx */ },
});

const files = readdirSync(COMPONENTS_DIR).filter(isSource);
for (const file of files) {
  project.addSourceFileAtPath(join(COMPONENTS_DIR, file));
}

const violations = [];
const add = (file, detail) => violations.push(`${file} ${detail}`);

for (const file of files) {
  const sourceFile = project.getSourceFileOrThrow(join(COMPONENTS_DIR, file));
  const filePath = sourceFile.getFilePath();

  for (const [name, decls] of sourceFile.getExportedDeclarations()) {
    for (const decl of decls) {
      // Only judge declarations that live in this file; re-exports are the
      // owner file's responsibility.
      if (decl.getSourceFile().getFilePath() !== filePath) {
        continue;
      }

      // Rule 1: exported PascalCase component values.
      if (isPascalCase(name) && isComponentDecl(decl) && !hasDoc(decl)) {
        add(file, `component "${name}" has no TSDoc comment`);
      }

      // Rules 2 & 3: exported `*Props` types.
      const isPropsType =
        name.endsWith("Props") &&
        (Node.isInterfaceDeclaration(decl) ||
          Node.isTypeAliasDeclaration(decl));
      if (isPropsType) {
        if (!hasDoc(decl)) {
          add(file, `type "${name}" has no TSDoc comment`);
        }
        for (const prop of ownPropSignatures(decl)) {
          const propDocs = prop.getJsDocs?.() ?? [];
          const documented = propDocs.some(
            (d) => (d.getDescription()?.trim().length ?? 0) > 0
          );
          if (!documented) {
            add(file, `${name}.${prop.getName()} has no TSDoc comment`);
          }
        }
      }
    }
  }
}

if (violations.length) {
  console.error(`\n✗ ${violations.length} TSDoc-coverage gaps:\n`);
  for (const v of violations) {
    console.error(`  ${v}`);
  }
  process.exit(1);
}
console.log("✓ Public component & prop surface is fully documented.");
