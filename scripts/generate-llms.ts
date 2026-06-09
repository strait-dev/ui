// scripts/generate-llms.ts
// Generates LLM-discoverability artifacts for @strait/ui by walking the
// component source with ts-morph:
//   - llms.txt        index (llmstxt.org spec): category sections, one line
//                     per component with its import path + summary.
//   - llms-full.txt   the same skeleton expanded with full TSDoc, prop tables,
//                     cva variants, data-slots, and heavy-dep notes.
//   - components.json  one machine-readable entry per public component export.
//   - props.json      slug-keyed component model consumed by the docs site's
//                     auto-generated <PropsTable>.
//
// llms/components artifacts are written to packages/ui/ (shipped on npm via
// package.json `files`) and copied to apps/storybook/public/ (served on the
// Storybook docs site); props.json is written to apps/docs/.generated/.
//
// Run: `bun scripts/generate-llms.ts` (idempotent).
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  Node,
  type ObjectLiteralExpression,
  Project,
  type SourceFile,
} from "ts-morph";

const PKG_DIR = "packages/ui";
const COMPONENTS_DIR = join(PKG_DIR, "src/components");
const STORYBOOK_PUBLIC = "apps/storybook/public";
// The docs site serves the llms/components artifacts as static files and
// consumes a slug-keyed model for its auto-generated <PropsTable>.
const DOCS_PUBLIC = "apps/docs/public";
const DOCS_GENERATED = "apps/docs/.generated";
const PKG_NAME = "@strait/ui";

// Heavyweight runtime deps worth surfacing to consumers (kept in sync with
// scripts/check-heavy-deps.mjs).
const HEAVY = [
  "recharts",
  "shiki",
  "motion",
  "vaul",
  "embla-carousel-react",
  "react-day-picker",
  "react-phone-number-input",
  "@tanstack/react-table",
];

const LIBRARY_SUMMARY =
  "Strait UI (@strait/ui) is a React + Tailwind v4 design system of 120+ " +
  "accessible components built on Base UI primitives. Every component ships " +
  "as its own tree-shakeable subpath export, is styled with semantic design " +
  "tokens and class-variance-authority recipes, and exposes a named `*Props` " +
  "type. Components render a polymorphic root via the Base UI `render` prop " +
  "and tag their parts with `data-slot` attributes for styling and testing.";

// Theming preamble emitted into both llms artifacts. The token system is the
// same for every component, so documenting it once up front saves consumers
// (and LLMs) from inferring it per-component. Kept in sync with the
// "Getting Started/Theming" story (src/docs/theming.mdx).
const THEMING_GUIDE = `## Theming

All colours are semantic \`oklch\` CSS custom properties defined in
\`@strait/ui/css\`. Components reference token-backed Tailwind utilities
(\`bg-primary\`, \`text-muted-foreground\`, …), never raw colours, so theming is
a matter of redefining variables after importing the stylesheet.

### Set a custom brand (primary) colour

\`--brand\` is the single source of truth for the accent. Set it to any colour
format and the rest of the brand system derives automatically:

\`\`\`css
@import "@strait/ui/css";

:root {
  --brand: #6366f1; /* hex, rgb(), or oklch() — that's the whole rebrand */
}
\`\`\`

Setting \`--brand\` re-themes everything keyed off it:
- \`--brand-foreground\` — text on the solid brand fill; defaults to white (a
  deliberate brand choice). Override it if you rebrand to a light colour that
  needs dark text.
- \`--brand-accent\` — AA-legible text/border for the soft and outline brand
  variants on tinted surfaces (darkens in light mode, lightens in dark mode).
- \`--chart-1\`, \`--sidebar-active-rail\`, and the active-row tint follow too.

The same value is used in light and dark mode. Every derived token is an
ordinary custom property, so any of them can still be overridden individually.
Note: \`--primary\` is warm ink (default buttons), distinct from \`--brand\`.

### Dark mode

Dark mode is a \`.dark\` class on (or above) the themed element — typically
\`<html>\`. Tokens cascade, so toggling the class re-themes every component;
\`next-themes\` is the recommended wiring.

### Surface tokens

Reusable surfaces are tokenized too: \`--surface-raised\` for elevated/floating
containers, \`--surface-subtle\` for nested panels and toolbar wells,
\`--surface-terminal\` / \`--surface-terminal-foreground\` for forced terminal/code
surfaces, and \`--overlay\` for modal scrims.`;

// Category ordering for the generated index (most actionable first).
const CATEGORY_ORDER = [
  "Actions",
  "Forms",
  "Data Display",
  "Navigation",
  "Overlays",
  "Feedback",
  "Layout",
  "Patterns",
  "Uncategorized",
];

type PropDoc = {
  name: string;
  type: string;
  optional: boolean;
  default?: string;
  description?: string;
};

type TypeDoc = {
  /** The exported `*Props` type name. */
  name: string;
  /** Inline-declared props (own members of the type literal/interface). */
  props: PropDoc[];
  /** Types it intersects/extends whose members we can't statically expand. */
  extends: string[];
  /**
   * Props inherited from extended/intersected types (Base UI primitives,
   * controlled props, …), resolved via the type checker with HTML/ARIA global
   * attributes filtered out. Empty if resolution failed.
   */
  inheritedProps: PropDoc[];
  /** Native HTML tags whose attributes this type accepts (e.g. `["div"]`). */
  extendsHtml: string[];
};

/** A compound component's sub-part: an exported sub-component + its data-slot. */
type PartDoc = {
  name: string;
  slot?: string;
  description?: string;
};

type ComponentDoc = {
  name: string;
  importPath: string;
  category: string;
  description: string;
  exports: string[];
  /** One entry per exported `*Props` type in the module. */
  types: TypeDoc[];
  variants: Record<string, string[]>;
  defaultVariants: Record<string, string>;
  slots: string[];
  /** Sub-component parts (anatomy) for compound components. */
  parts: PartDoc[];
  dependencies: string[];
};

const isSource = (f: string) =>
  f.endsWith(".tsx") && !f.endsWith(".stories.tsx") && !f.endsWith(".test.tsx");

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Flatten TSDoc inline `{@link …}` tags to plain text. Handles both
 * `{@link Target}` and `{@link Target|display}` / `{@link Target display}`
 * forms; for a bare member link (`{@link Foo.bar}` / `{@link Foo#bar}`) keeps
 * the last segment so the prose reads naturally.
 */
function stripLinks(text: string): string {
  return text.replace(/\{@link\s+([^}]+)\}/g, (_match, body: string) => {
    const trimmed = body.trim();
    // Prefer an explicit display label after `|` or whitespace.
    const sep = trimmed.search(/[|\s]/);
    if (sep !== -1) {
      return trimmed.slice(sep + 1).trim();
    }
    // Bare target: drop the qualifier for member links.
    const lastSegment = trimmed.split(/[.#]/).pop() ?? trimmed;
    return lastSegment.trim();
  });
}

/** First paragraph of a TSDoc description, flattened to a single line. */
function firstParagraph(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }
  const [para] = trimmed.split(/\n\s*\n/);
  return stripLinks(para.replace(/\s+/g, " ").trim());
}

function jsDocText(node: Node): string {
  // Variable-declared values (`const X = …`) hang their JSDoc on the parent
  // VariableStatement, not the declaration — mirror check-docs.mjs.
  const docs = Node.isVariableDeclaration(node)
    ? (node.getVariableStatement()?.getJsDocs() ?? [])
    : Node.isJSDocable(node)
      ? node.getJsDocs()
      : [];
  for (const d of docs) {
    const desc = d.getDescription()?.trim();
    if (desc) {
      return desc;
    }
  }
  return "";
}

/** Pull the description text out of a raw `/** … *\/` block comment. */
function parseBlockComment(raw: string): string {
  const body = raw
    .replace(/^\/\*\*?/, "")
    .replace(/\*\/$/, "")
    .split("\n")
    .map((line) => line.replace(/^\s*\* ?/, ""))
    .join("\n");
  // The description is everything before the first block tag (`@param`, …).
  const [beforeTag] = body.split(/\n\s*@/);
  return firstParagraph(beforeTag);
}

/**
 * Description from a leading `/** … *\/` block on a node. ts-morph does not
 * model JSDoc on `export { … }` declarations, so re-export shims (whose
 * symbols resolve to another file) carry their doc as a leading comment.
 */
function leadingDocText(node: Node): string {
  const ranges = node.getLeadingCommentRanges();
  for (let i = ranges.length - 1; i >= 0; i--) {
    const text = ranges[i].getText();
    if (text.startsWith("/**")) {
      return parseBlockComment(text);
    }
  }
  return "";
}

/** Read `title: "Category/Name"` from the colocated stories file. */
function readStoryMeta(name: string): { category?: string; display?: string } {
  const path = join(COMPONENTS_DIR, `${name}.stories.tsx`);
  let src: string;
  try {
    src = readFileSync(path, "utf8");
  } catch {
    return {};
  }
  const m = src.match(/title:\s*["']([^"']+)["']/);
  if (!m) {
    return {};
  }
  const parts = m[1].split("/");
  return {
    category: parts[0]?.trim(),
    display: parts.slice(1).join("/").trim(),
  };
}

/** Unique `data-slot` values declared anywhere in the source. */
function extractSlots(src: string): string[] {
  const slots = new Set<string>();
  const re = /data-slot["']?\s*[:=]\s*["']([\w-]+)["']/g;
  let m: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop
  while ((m = re.exec(src)) !== null) {
    slots.add(m[1]);
  }
  return [...slots].sort();
}

/** Heavy deps imported by the module. */
function extractHeavyDeps(src: string): string[] {
  return HEAVY.filter((dep) => {
    const escaped = dep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`from\\s+["']${escaped}(?:/[^"']*)?["']`).test(src);
  });
}

/** Keys of an object-literal property whose value is itself an object. */
function objectKeys(obj: ObjectLiteralExpression, prop: string): string[] {
  const p = obj.getProperty(prop);
  if (!(p && Node.isPropertyAssignment(p))) {
    return [];
  }
  const init = p.getInitializer();
  if (!(init && Node.isObjectLiteralExpression(init))) {
    return [];
  }
  return init
    .getProperties()
    .map((member) => {
      if (
        Node.isPropertyAssignment(member) ||
        Node.isShorthandPropertyAssignment(member)
      ) {
        return member.getName().replace(/^["']|["']$/g, "");
      }
      return "";
    })
    .filter(Boolean);
}

/** Extract cva `variants` axes and `defaultVariants` from a source file. */
function extractCva(sourceFile: SourceFile, fileName: string) {
  const variants: Record<string, string[]> = {};
  const defaultVariants: Record<string, string> = {};

  const cvaDecls = sourceFile.getVariableDeclarations().filter((d) => {
    const init = d.getInitializer();
    return (
      Node.isCallExpression(init) && init.getExpression().getText() === "cva"
    );
  });
  if (cvaDecls.length === 0) {
    return { variants, defaultVariants };
  }

  // Prefer the recipe named `<file>Variants`; otherwise the first cva call.
  const primary =
    cvaDecls.find(
      (d) => normalize(d.getName()) === `${normalize(fileName)}variants`
    ) ?? cvaDecls[0];
  const call = primary.getInitializer();
  if (!Node.isCallExpression(call)) {
    return { variants, defaultVariants };
  }
  const config = call.getArguments()[1];
  if (!(config && Node.isObjectLiteralExpression(config))) {
    return { variants, defaultVariants };
  }

  const variantsProp = config.getProperty("variants");
  if (variantsProp && Node.isPropertyAssignment(variantsProp)) {
    const variantsObj = variantsProp.getInitializer();
    if (variantsObj && Node.isObjectLiteralExpression(variantsObj)) {
      for (const axis of variantsObj.getProperties()) {
        if (Node.isPropertyAssignment(axis)) {
          const axisName = axis.getName().replace(/^["']|["']$/g, "");
          variants[axisName] = objectKeys(variantsObj, axisName);
        }
      }
    }
  }

  const defaultsProp = config.getProperty("defaultVariants");
  if (defaultsProp && Node.isPropertyAssignment(defaultsProp)) {
    const defaultsObj = defaultsProp.getInitializer();
    if (defaultsObj && Node.isObjectLiteralExpression(defaultsObj)) {
      for (const member of defaultsObj.getProperties()) {
        if (Node.isPropertyAssignment(member)) {
          const key = member.getName().replace(/^["']|["']$/g, "");
          defaultVariants[key] =
            member
              .getInitializer()
              ?.getText()
              .replace(/^["']|["']$/g, "") ?? "";
        }
      }
    }
  }

  return { variants, defaultVariants };
}

/** Map of prop name -> default value text from a component's destructured params. */
function extractDefaults(decl: Node): Record<string, string> {
  const defaults: Record<string, string> = {};
  let fn: Node | undefined;
  if (Node.isFunctionDeclaration(decl)) {
    fn = decl;
  } else if (Node.isVariableDeclaration(decl)) {
    const init = decl.getInitializer();
    if (Node.isArrowFunction(init) || Node.isFunctionExpression(init)) {
      fn = init;
    } else if (Node.isCallExpression(init)) {
      // forwardRef(...) / memo(...) — first arg is the render fn.
      const arg = init.getArguments()[0];
      if (
        arg &&
        (Node.isArrowFunction(arg) || Node.isFunctionExpression(arg))
      ) {
        fn = arg;
      }
    }
  }
  if (!(fn && "getParameters" in fn)) {
    return defaults;
  }
  // @ts-expect-error narrowed to a function-like node above.
  const param = fn.getParameters()[0];
  const binding = param?.getNameNode();
  if (binding && Node.isObjectBindingPattern(binding)) {
    for (const element of binding.getElements()) {
      const init = element.getInitializer();
      if (init) {
        defaults[element.getName()] = init.getText();
      }
    }
  }
  return defaults;
}

/** Collect inline property signatures + intersected/extended type texts. */
function extractProps(
  decl: Node,
  defaults: Record<string, string>
): { props: PropDoc[]; extendsList: string[] } {
  const props: PropDoc[] = [];
  const extendsList: string[] = [];

  const pushProp = (sig: Node) => {
    if (!Node.isPropertySignature(sig)) {
      return;
    }
    const name = sig.getName().replace(/^["']|["']$/g, "");
    props.push({
      name,
      type: sig.getTypeNode()?.getText().replace(/\s+/g, " ") ?? "unknown",
      optional: sig.hasQuestionToken(),
      default: defaults[name],
      description: firstParagraph(jsDocText(sig)) || undefined,
    });
  };

  if (Node.isInterfaceDeclaration(decl)) {
    for (const ext of decl.getExtends()) {
      extendsList.push(ext.getText().replace(/\s+/g, " "));
    }
    for (const p of decl.getProperties()) {
      pushProp(p);
    }
  } else if (Node.isTypeAliasDeclaration(decl)) {
    const node = decl.getTypeNode();
    if (node) {
      const arms = Node.isIntersectionTypeNode(node)
        ? node.getTypeNodes()
        : [node];
      for (const arm of arms) {
        if (Node.isTypeLiteral(arm)) {
          for (const p of arm.getProperties()) {
            pushProp(p);
          }
        } else {
          extendsList.push(arm.getText().replace(/\s+/g, " "));
        }
      }
    }
  }
  return { props, extendsList };
}

// --- build the model -------------------------------------------------------

const project = new Project({
  skipAddingFilesFromTsConfig: true,
  skipFileDependencyResolution: true,
  compilerOptions: { allowJs: false, jsx: 4 /* react-jsx */ },
});

const files = readdirSync(COMPONENTS_DIR).filter(isSource).sort();
for (const file of files) {
  project.addSourceFileAtPath(join(COMPONENTS_DIR, file));
}

// A second project loaded with full dependency resolution, so the type checker
// can expand props inherited from Base UI primitives, React, and local types.
// Wrapped defensively: if it can't load, inherited-prop expansion is skipped.
let typeProject: Project | null = null;
try {
  typeProject = new Project({
    tsConfigFilePath: join(PKG_DIR, "tsconfig.json"),
  });
} catch {
  typeProject = null;
}

/**
 * Names of every native HTML/SVG/ARIA/DOM attribute, derived by resolving
 * `ComponentProps<"…">` for representative tags. Used to filter the noise out
 * of inherited props (we surface a "accepts all native <tag> attributes" note
 * instead of listing 200+ globals).
 */
function buildDomGlobals(p: Project): Set<string> {
  const names = new Set<string>();
  try {
    const probe = p.createSourceFile(
      join(COMPONENTS_DIR, "__strait_dom_probe__.ts"),
      `import type { ComponentProps } from "react";
export type Probe = ComponentProps<"div"> & ComponentProps<"button"> &
  ComponentProps<"input"> & ComponentProps<"a"> & ComponentProps<"span"> &
  ComponentProps<"ul"> & ComponentProps<"nav"> & ComponentProps<"svg">;`,
      { overwrite: true }
    );
    for (const sym of probe
      .getTypeAliasOrThrow("Probe")
      .getType()
      .getProperties()) {
      names.add(sym.getName());
    }
    p.removeSourceFile(probe);
  } catch {
    // leave empty — inherited props simply won't be filtered
  }
  return names;
}

const domGlobals = typeProject
  ? buildDomGlobals(typeProject)
  : new Set<string>();

/**
 * Resolve the full prop set of a `*Props` type via the checker, returning only
 * the meaningful inherited props: excludes the type's own inline props, the
 * cva variant axes (`exclude`), props declared in the component's own file, and
 * the HTML/ARIA globals.
 */
function resolveInheritedProps(
  typeName: string,
  filePath: string,
  exclude: Set<string>
): PropDoc[] {
  if (!typeProject) {
    return [];
  }
  try {
    const sf = typeProject.getSourceFile(filePath);
    const decl = sf?.getTypeAlias(typeName) ?? sf?.getInterface(typeName);
    if (!decl) {
      return [];
    }
    const out: PropDoc[] = [];
    for (const sym of decl.getType().getProperties()) {
      const propName = sym.getName();
      if (exclude.has(propName) || domGlobals.has(propName)) {
        continue;
      }
      const d = sym.getDeclarations()[0];
      if (!d || d.getSourceFile().getFilePath() === filePath) {
        continue;
      }
      let typeText = "unknown";
      let optional = true;
      let description: string | undefined;
      if (Node.isPropertySignature(d)) {
        typeText = d.getTypeNode()?.getText().replace(/\s+/g, " ") ?? "unknown";
        optional = d.hasQuestionToken();
        description = firstParagraph(jsDocText(d)) || undefined;
      } else {
        typeText = sym.getTypeAtLocation(d).getText(d).replace(/\s+/g, " ");
      }
      out.push({ name: propName, type: typeText, optional, description });
    }
    return out.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

const HTML_EXTENDS_RE = /ComponentProps(?:WithoutRef|WithRef)?<\s*"(\w+)"/;
function extendsHtmlTags(extendsList: string[]): string[] {
  const tags = new Set<string>();
  for (const e of extendsList) {
    const m = e.match(HTML_EXTENDS_RE);
    if (m) {
      tags.add(m[1]);
    }
  }
  return [...tags].sort();
}

const docs: ComponentDoc[] = [];

for (const file of files) {
  const name = file.replace(/\.tsx$/, "");
  const sourceFile = project.getSourceFileOrThrow(join(COMPONENTS_DIR, file));
  const filePath = sourceFile.getFilePath();
  const src = sourceFile.getFullText();

  const exported = sourceFile.getExportedDeclarations();

  // Locally-declared exported components (PascalCase function/const values).
  const localComponents: { name: string; decl: Node }[] = [];
  const propsTypes: { name: string; decl: Node }[] = [];
  // Default exports surface under the key "default"; recover the real
  // identifier so PascalCase detection and naming still work, and so the
  // exports list can show e.g. `MultipleSelector (default)`.
  let defaultExportName: string | undefined;
  const declName = (d: Node): string | undefined =>
    Node.isFunctionDeclaration(d) ||
    Node.isVariableDeclaration(d) ||
    Node.isClassDeclaration(d)
      ? d.getName()
      : undefined;
  for (const [exportName, decls] of exported) {
    for (const decl of decls) {
      if (decl.getSourceFile().getFilePath() !== filePath) {
        continue;
      }
      const resolvedName =
        exportName === "default" ? (declName(decl) ?? exportName) : exportName;
      if (exportName === "default" && resolvedName !== "default") {
        defaultExportName = resolvedName;
      }
      const isComponent =
        /^[A-Z]/.test(resolvedName) &&
        (Node.isFunctionDeclaration(decl) ||
          (Node.isVariableDeclaration(decl) &&
            (() => {
              const init = decl.getInitializer();
              return (
                Node.isArrowFunction(init) ||
                Node.isFunctionExpression(init) ||
                Node.isCallExpression(init)
              );
            })()));
      if (isComponent) {
        localComponents.push({ name: resolvedName, decl });
      }
      if (
        exportName.endsWith("Props") &&
        (Node.isInterfaceDeclaration(decl) || Node.isTypeAliasDeclaration(decl))
      ) {
        propsTypes.push({ name: exportName, decl });
      }
    }
  }

  const exportNames = [...exported.keys()]
    .map((k) =>
      k === "default" && defaultExportName
        ? `${defaultExportName} (default)`
        : k
    )
    .sort();

  const story = readStoryMeta(name);
  const category = story.category ?? "Uncategorized";

  // Primary component: the one whose normalized name matches the file name,
  // else the first declared component.
  const primary =
    localComponents.find((c) => normalize(c.name) === normalize(name)) ??
    localComponents[0];
  const displayName = story.display || primary?.name || name;

  let description = primary ? firstParagraph(jsDocText(primary.decl)) : "";
  if (!description) {
    // Re-export shim modules (e.g. notice-banner, direction) document the
    // module on the `export { … }` declaration itself; the re-exported
    // symbols resolve to another file and are filtered out above.
    for (const exportDecl of sourceFile.getExportDeclarations()) {
      const text = leadingDocText(exportDecl);
      if (text) {
        description = text;
        break;
      }
    }
  }

  // Index local components by name so each `*Props` type can pull defaults
  // from the destructured params of its own component.
  const componentByName = new Map(localComponents.map((c) => [c.name, c.decl]));

  const { variants, defaultVariants } = extractCva(sourceFile, name);
  const variantAxes = Object.keys(variants);

  const types: TypeDoc[] = propsTypes
    .map(({ name: typeName, decl }) => {
      const ownerName = typeName.replace(/Props$/, "");
      const ownerDecl = componentByName.get(ownerName);
      const defaults = ownerDecl ? extractDefaults(ownerDecl) : {};
      const { props, extendsList } = extractProps(decl, defaults);
      const exclude = new Set([...props.map((p) => p.name), ...variantAxes]);
      return {
        name: typeName,
        props,
        extends: extendsList,
        inheritedProps: resolveInheritedProps(typeName, filePath, exclude),
        extendsHtml: extendsHtmlTags(extendsList),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const slots = extractSlots(src);
  const slotByNorm = new Map(slots.map((s) => [normalize(s), s]));
  const parts: PartDoc[] = localComponents
    .map((c) => ({
      name: c.name,
      slot: slotByNorm.get(normalize(c.name)),
      description: firstParagraph(jsDocText(c.decl)) || undefined,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  docs.push({
    name: displayName,
    importPath: `${PKG_NAME}/components/${name}`,
    category,
    description,
    exports: exportNames,
    types,
    variants,
    defaultVariants,
    slots,
    parts,
    dependencies: extractHeavyDeps(src),
  });
}

// --- group + sort ----------------------------------------------------------

const byCategory = new Map<string, ComponentDoc[]>();
for (const doc of docs) {
  const list = byCategory.get(doc.category) ?? [];
  list.push(doc);
  byCategory.set(doc.category, list);
}
const orderedCategories = [...byCategory.keys()].sort((a, b) => {
  const ia = CATEGORY_ORDER.indexOf(a);
  const ib = CATEGORY_ORDER.indexOf(b);
  return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib) || a.localeCompare(b);
});
for (const list of byCategory.values()) {
  list.sort((a, b) => a.name.localeCompare(b.name));
}

// --- render llms.txt -------------------------------------------------------

function renderIndex(): string {
  const lines = [
    "# Strait UI",
    "",
    `> ${LIBRARY_SUMMARY}`,
    "",
    THEMING_GUIDE,
    "",
  ];
  for (const category of orderedCategories) {
    lines.push(`## ${category}`, "");
    for (const doc of byCategory.get(category) ?? []) {
      const summary = doc.description ? `: ${doc.description}` : "";
      lines.push(`- [${doc.name}](${doc.importPath})${summary}`);
    }
    lines.push("");
  }
  return `${lines.join("\n").trim()}\n`;
}

// --- render llms-full.txt --------------------------------------------------

function renderType(type: TypeDoc): string[] {
  const lines: string[] = [`Props (\`${type.name}\`):`];
  if (type.extends.length) {
    lines.push(`Extends: ${type.extends.map((e) => `\`${e}\``).join(", ")}`);
  }
  if (type.props.length === 0) {
    lines.push("");
    return lines;
  }
  lines.push(
    "",
    "| Prop | Type | Required | Default | Description |",
    "| --- | --- | --- | --- | --- |"
  );
  for (const p of type.props) {
    const ty = `\`${p.type}\``.replace(/\|/g, "\\|");
    const required = p.optional ? "" : "yes";
    const def = p.default ? `\`${p.default}\``.replace(/\|/g, "\\|") : "";
    const desc = (p.description ?? "").replace(/\|/g, "\\|");
    lines.push(`| \`${p.name}\` | ${ty} | ${required} | ${def} | ${desc} |`);
  }
  lines.push("");
  return lines;
}

function renderFull(): string {
  const lines = [
    "# Strait UI — Full Reference",
    "",
    `> ${LIBRARY_SUMMARY}`,
    "",
    THEMING_GUIDE,
    "",
  ];
  for (const category of orderedCategories) {
    lines.push(`## ${category}`, "");
    for (const doc of byCategory.get(category) ?? []) {
      lines.push(`### ${doc.name}`, "");
      lines.push(`Import: \`import { ... } from "${doc.importPath}";\``, "");
      if (doc.description) {
        lines.push(doc.description, "");
      }
      if (doc.exports.length) {
        lines.push(
          `Exports: ${doc.exports.map((e) => `\`${e}\``).join(", ")}`,
          ""
        );
      }
      for (const type of doc.types) {
        lines.push(...renderType(type));
      }
      const axes = Object.keys(doc.variants);
      if (axes.length) {
        lines.push("Variants:");
        for (const axis of axes) {
          const def = doc.defaultVariants[axis];
          const suffix = def ? ` (default: \`${def}\`)` : "";
          lines.push(
            `- \`${axis}\`: ${doc.variants[axis].map((v) => `\`${v}\``).join(", ")}${suffix}`
          );
        }
        lines.push("");
      }
      if (doc.slots.length) {
        lines.push(
          `Data slots: ${doc.slots.map((s) => `\`${s}\``).join(", ")}`,
          ""
        );
      }
      if (doc.dependencies.length) {
        lines.push(
          `Heavy dependencies: ${doc.dependencies.map((d) => `\`${d}\``).join(", ")}`,
          ""
        );
      }
    }
  }
  return `${lines.join("\n").trim()}\n`;
}

// --- write outputs ---------------------------------------------------------

const index = renderIndex();
const full = renderFull();
const json = `${JSON.stringify(docs, null, 2)}\n`;

// Slug-keyed model for the docs site: `button`, `activity-feed`, … — the same
// slug as the component's subpath export and its docs page/demo directory.
const propsBySlug: Record<string, ComponentDoc> = {};
for (const doc of docs) {
  const slug = doc.importPath.split("/").pop() ?? doc.importPath;
  propsBySlug[slug] = doc;
}
const sortedPropsBySlug = Object.fromEntries(
  Object.keys(propsBySlug)
    .sort()
    .map((slug) => [slug, propsBySlug[slug]])
);
const propsJson = `${JSON.stringify(sortedPropsBySlug, null, 2)}\n`;

const sharedTargets = (file: string) => [
  join(PKG_DIR, file),
  join(STORYBOOK_PUBLIC, file),
  join(DOCS_PUBLIC, file),
];

const artifacts: { file: string; content: string; targets: string[] }[] = [
  { file: "llms.txt", content: index, targets: sharedTargets("llms.txt") },
  {
    file: "llms-full.txt",
    content: full,
    targets: sharedTargets("llms-full.txt"),
  },
  {
    file: "components.json",
    content: json,
    targets: sharedTargets("components.json"),
  },
  {
    file: "props.json",
    content: propsJson,
    targets: [join(DOCS_GENERATED, "props.json")],
  },
];

// `--check` is the CI drift gate: render in-memory and diff against the
// committed artifacts without writing. Anything stale fails the build.
if (process.argv.includes("--check")) {
  const drifted: string[] = [];
  for (const { targets, content } of artifacts) {
    for (const path of targets) {
      let existing: string | null = null;
      try {
        existing = readFileSync(path, "utf8");
      } catch {
        existing = null;
      }
      if (existing !== content) {
        drifted.push(path);
      }
    }
  }
  if (drifted.length > 0) {
    console.error(
      `✗ Docs artifacts are out of date (${drifted.length}):\n` +
        `${drifted.map((p) => `  - ${p}`).join("\n")}\n` +
        "Run `bun run docs:generate` and commit the result."
    );
    process.exit(1);
  }
  console.log(
    `✓ Docs artifacts are up to date for ${docs.length} components ` +
      `(${orderedCategories.length} categories).`
  );
} else {
  mkdirSync(STORYBOOK_PUBLIC, { recursive: true });
  mkdirSync(DOCS_PUBLIC, { recursive: true });
  mkdirSync(DOCS_GENERATED, { recursive: true });
  for (const { targets, content } of artifacts) {
    for (const path of targets) {
      writeFileSync(path, content);
    }
  }
  console.log(
    `✓ Generated llms.txt, llms-full.txt, components.json, props.json for ${docs.length} components ` +
      `(${orderedCategories.length} categories) → ${PKG_DIR}/, ${STORYBOOK_PUBLIC}/, ${DOCS_GENERATED}/`
  );
}
