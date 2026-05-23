#!/usr/bin/env node
// Story coverage + render audit for the Strait Storybook.
//
// Usage:
//   node scripts/story-audit.mjs            # against a running dev server (6006)
//   STORYBOOK_URL=http://localhost:6007 node scripts/story-audit.mjs
//
// Reads <url>/index.json, groups stories by sidebar category, and fetches each
// story's iframe to confirm it is served (HTTP 200). Compile/render errors that
// only surface in the browser are caught by `bun run build-storybook` and the
// Playwright spot-checks; this script is the fast coverage/serve gate.

const BASE = process.env.STORYBOOK_URL ?? "http://localhost:6006";

const fail = (msg) => {
  console.error(`\x1b[31m✗ ${msg}\x1b[0m`);
  process.exit(1);
};

let index;
try {
  const res = await fetch(`${BASE}/index.json`);
  if (!res.ok) fail(`GET ${BASE}/index.json -> ${res.status}`);
  index = await res.json();
} catch (err) {
  fail(
    `Could not reach Storybook at ${BASE}. Is the dev server running? (${err.message})`,
  );
}

const entries = Object.values(index.entries ?? {}).filter(
  (e) => e.type === "story",
);

// Group by category (the part of the title before the first "/").
const byCategory = new Map();
for (const entry of entries) {
  const category = entry.title.split("/")[0];
  if (!byCategory.has(category)) byCategory.set(category, new Set());
  byCategory.get(category).add(entry.title);
}

console.log(`\n📚 Storybook coverage @ ${BASE}\n`);
const categories = [...byCategory.keys()].sort();
for (const category of categories) {
  const components = [...byCategory.get(category)].sort();
  console.log(`  ${category} (${components.length})`);
  for (const title of components) {
    console.log(`    • ${title.split("/").slice(1).join("/")}`);
  }
}
console.log(
  `\n  Totals: ${categories.length} categories, ` +
    `${new Set(entries.map((e) => e.title)).size} components, ` +
    `${entries.length} stories\n`,
);

// Serve check: every story iframe returns 200.
let broken = 0;
await Promise.all(
  entries.map(async (entry) => {
    const url = `${BASE}/iframe.html?id=${entry.id}&viewMode=story`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        broken++;
        console.error(`  ✗ ${entry.id} -> ${res.status}`);
      }
    } catch (err) {
      broken++;
      console.error(`  ✗ ${entry.id} -> ${err.message}`);
    }
  }),
);

if (broken > 0) fail(`${broken} story iframe(s) failed to load`);
console.log(`\x1b[32m✓ all ${entries.length} story iframes served\x1b[0m`);
