// scripts/check-docs-pages.mjs
// Coverage gate: every published component must have a docs page at
// apps/docs/content/docs/components/<slug>.mdx. Fails the build on any gap so
// the docs site never silently drops a component.
//
// Run: `bun scripts/check-docs-pages.mjs`.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const COMPONENTS_JSON = "packages/ui/components.json";
const PAGES_DIR = "apps/docs/content/docs/components";

const components = JSON.parse(readFileSync(COMPONENTS_JSON, "utf8"));

const missing = [];
for (const component of components) {
  const slug = component.importPath.split("/").pop();
  if (!existsSync(join(PAGES_DIR, `${slug}.mdx`))) {
    missing.push(slug);
  }
}

if (missing.length > 0) {
  console.error(
    `✗ ${missing.length} component(s) missing a docs page in ${PAGES_DIR}:\n` +
      `${missing.map((s) => `  - ${s}.mdx`).join("\n")}\n` +
      "Run `bun scripts/scaffold-docs.ts` to generate the missing pages."
  );
  process.exit(1);
}

console.log(
  `✓ All ${components.length} components have a docs page in ${PAGES_DIR}.`
);
