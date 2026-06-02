// scripts/scaffold-docs.ts
// Bootstraps a docs page + seed demo for every component that doesn't have one
// yet. The seed demo is derived from the component's Storybook `Playground`
// story (or the first story with a `render`), with relative imports rewritten
// to their `@strait/ui` subpath. Existing files are never overwritten, so this
// is safe to re-run as new components land; curated demos survive.
//
// Run: `bun scripts/scaffold-docs.ts`. Flagged components (no extractable demo,
// or a render that still references `args`) get a minimal fallback demo and are
// printed at the end for manual follow-up.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Node, Project, type SourceFile } from "ts-morph";

const COMPONENTS_JSON = "packages/ui/components.json";
const COMPONENTS_DIR = "packages/ui/src/components";
const DEMOS_DIR = "apps/docs/demos";
const PAGES_DIR = "apps/docs/content/docs/components";

type ComponentDoc = {
  name: string;
  importPath: string;
  description: string;
};

const components: ComponentDoc[] = JSON.parse(
  readFileSync(COMPONENTS_JSON, "utf8")
);

const project = new Project({
  skipAddingFilesFromTsConfig: true,
  skipFileDependencyResolution: true,
  compilerOptions: { allowJs: false, jsx: 4 /* react-jsx */ },
});

const pascal = (slug: string) =>
  slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

const HOOK_RE = /\buse[A-Z]\w*/;
const isDroppedModule = (spec: string) =>
  spec.startsWith("@storybook/") || spec.startsWith("storybook/");

/** Rewrite a story import specifier to the form a demo should use. */
const rewriteSpecifier = (spec: string) =>
  spec.startsWith("./") ? `@strait/ui/components/${spec.slice(2)}` : spec;

/** Find the story object to seed from: Playground, else first with a render. */
function pickStory(source: SourceFile) {
  const playground = source.getVariableDeclaration("Playground");
  if (playground) {
    return playground;
  }
  return source.getVariableDeclarations().find((decl) => {
    if (!decl.isExported()) {
      return false;
    }
    const init = decl.getInitializer();
    return (
      Node.isObjectLiteralExpression(init) &&
      Boolean(init.getProperty("render"))
    );
  });
}

/** Extract the render arrow body as a `{ ... }` function body, or null. */
function extractRenderBody(decl: ReturnType<typeof pickStory>): string | null {
  const init = decl?.getInitializer();
  if (!(init && Node.isObjectLiteralExpression(init))) {
    return null;
  }
  const renderProp = init.getProperty("render");
  if (!(renderProp && Node.isPropertyAssignment(renderProp))) {
    return null;
  }
  const fn = renderProp.getInitializer();
  if (!(fn && Node.isArrowFunction(fn))) {
    return null;
  }
  const body = fn.getBody();
  let text: string;
  if (Node.isBlock(body)) {
    text = body.getText();
  } else {
    // Concise body: a (parenthesized) JSX expression.
    text = `{\n  return (\n    ${body.getText()}\n  );\n}`;
  }
  // Drop prop-spreading of the story args; the seed renders with defaults.
  return text.replace(/\{\s*\.\.\.(args|props)\s*\}/g, "");
}

/** Synthesize a minimal demo body for components without an extractable render. */
function synthesizeBody(
  source: SourceFile,
  slug: string
): { body: string; primary: string } {
  const meta = source.getVariableDeclaration("meta");
  const metaInit = meta?.getInitializer();
  let primary = pascal(slug);
  let children = "";
  if (metaInit && Node.isObjectLiteralExpression(metaInit)) {
    const comp = metaInit.getProperty("component");
    if (comp && Node.isPropertyAssignment(comp)) {
      primary = comp.getInitializer()?.getText() ?? primary;
    }
    const args = metaInit.getProperty("args");
    if (args && Node.isPropertyAssignment(args)) {
      const argsObj = args.getInitializer();
      if (argsObj && Node.isObjectLiteralExpression(argsObj)) {
        const childrenProp = argsObj.getProperty("children");
        if (childrenProp && Node.isPropertyAssignment(childrenProp)) {
          const value = childrenProp.getInitializer();
          if (value && Node.isStringLiteral(value)) {
            children = value.getLiteralText();
          }
        }
      }
    }
  }
  const jsx = children
    ? `<${primary}>${children}</${primary}>`
    : `<${primary} />`;
  return { body: `{\n  return ${jsx};\n}`, primary };
}

/** Build the import block needed by a demo body from the story's imports. */
function buildImports(source: SourceFile, body: string): string {
  const referenced = new Set(body.match(/[A-Za-z_$][\w$]*/g) ?? []);
  const lines: string[] = [];
  for (const imp of source.getImportDeclarations()) {
    const spec = imp.getModuleSpecifierValue();
    if (isDroppedModule(spec)) {
      continue;
    }
    const named = imp
      .getNamedImports()
      .map((n) => ({ name: n.getName(), text: n.getText() }))
      .filter((n) => referenced.has(n.name));
    const def = imp.getDefaultImport()?.getText();
    const ns = imp.getNamespaceImport()?.getText();
    const keepDef = def && referenced.has(def) ? def : undefined;
    const keepNs = ns && referenced.has(ns) ? ns : undefined;
    if (named.length === 0 && !(keepDef || keepNs)) {
      continue;
    }
    const target = rewriteSpecifier(spec);
    const clauses: string[] = [];
    if (keepDef) {
      clauses.push(keepDef);
    }
    if (keepNs) {
      clauses.push(`* as ${keepNs}`);
    }
    if (named.length) {
      clauses.push(`{ ${named.map((n) => n.text).join(", ")} }`);
    }
    lines.push(`import ${clauses.join(", ")} from "${target}";`);
  }
  return lines.sort().join("\n");
}

let created = 0;
const flagged: string[] = [];

for (const component of components) {
  const slug = component.importPath.split("/").pop() as string;
  const pagefile = join(PAGES_DIR, `${slug}.mdx`);
  if (existsSync(pagefile)) {
    continue;
  }

  const storyPath = join(COMPONENTS_DIR, `${slug}.stories.tsx`);
  let body: string | null = null;
  let primaryFallback = pascal(slug);
  if (existsSync(storyPath)) {
    const source = project.addSourceFileAtPath(storyPath);
    body = extractRenderBody(pickStory(source));
    if (!body || /\bargs\b/.test(body)) {
      const synth = synthesizeBody(source, slug);
      body = synth.body;
      primaryFallback = synth.primary;
      flagged.push(slug);
    }
    const demofile = join(DEMOS_DIR, slug, "demo.tsx");
    if (!existsSync(demofile)) {
      const imports = buildImports(source, body);
      const useClient = HOOK_RE.test(body) ? '"use client";\n\n' : "";
      const fnName = `${pascal(slug)}Demo`;
      const demo = `// generated seed — replace with a curated example\n${useClient}${imports}\n\nexport default function ${fnName}() ${body}\n`;
      mkdirSync(join(DEMOS_DIR, slug), { recursive: true });
      writeFileSync(demofile, demo);
    }
  } else {
    // No story at all: minimal fallback demo importing the primary component.
    flagged.push(slug);
    const demofile = join(DEMOS_DIR, slug, "demo.tsx");
    if (!existsSync(demofile)) {
      const demo = `// generated seed — replace with a curated example\nimport { ${primaryFallback} } from "${component.importPath}";\n\nexport default function ${pascal(slug)}Demo() {\n  return <${primaryFallback} />;\n}\n`;
      mkdirSync(join(DEMOS_DIR, slug), { recursive: true });
      writeFileSync(demofile, demo);
    }
  }

  const description = component.description.replace(/"/g, '\\"');
  const page = `---\ntitle: ${component.name}\ndescription: ${description}\n---\n\n<ComponentPreview name="${slug}/demo" />\n\n## Reference\n\n<PropsTable name="${slug}" />\n`;
  mkdirSync(PAGES_DIR, { recursive: true });
  writeFileSync(pagefile, page);
  created++;
}

console.log(`✓ Scaffolded ${created} component page(s) → ${PAGES_DIR}`);
if (flagged.length) {
  console.log(
    `⚠ ${flagged.length} component(s) used a fallback demo and need manual ` +
      `curation:\n${flagged.map((s) => `  - ${s}`).join("\n")}`
  );
}
