// scripts/check-heavy-deps.mjs
// Keeps heavyweight dependencies out of the shared/low-level layer so that
// importing a light component never transitively drags in a big dependency.
//
// Two rules:
//   1. Nothing under src/utils/** may import a heavyweight dep — the cn helper
//      layer is imported by virtually every component and must stay tiny.
//   2. Any widely-imported component (in-degree >= THRESHOLD, i.e. a de-facto
//      building block) must stay heavy-dep-free, unless it is the canonical
//      owner of that dep (see OWNERS). This auto-adopts new shared primitives:
//      if a heavy component later becomes widely imported, this check fails
//      until it is refactored or an explicit, documented owner entry is added.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const COMPONENTS_DIR = "packages/ui/src/components";
const UTILS_DIR = "packages/ui/src/utils";

// Heavyweight runtime dependencies we never want leaking into shared modules.
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

// A component is "shared/low-level" once at least this many other components
// import it. Such components must stay heavy-dep-free.
const THRESHOLD = 3;

// Documented, legitimate ownership: a heavy dep is allowed in its canonical
// wrapper even when that wrapper is widely imported. calendar.tsx IS the
// react-day-picker wrapper, and the date-picker patterns compose it.
const OWNERS = {
  "react-day-picker": new Set(["calendar.tsx"]),
};

const isSource = (f) =>
  f.endsWith(".tsx") && !f.endsWith(".stories.tsx") && !f.endsWith(".test.tsx");

/** Heavy deps directly imported by `src`. */
function heavyImports(src) {
  return HEAVY.filter((dep) => {
    const escaped = dep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`from\\s+["']${escaped}(?:/[^"']*)?["']`);
    return re.test(src);
  });
}

/** Local component names imported by `src` (./name or ../components/name). */
function localComponentImports(src) {
  const names = new Set();
  const re = /from\s+["'](?:\.\/|\.\.\/components\/)([\w-]+)["']/g;
  for (const m of src.matchAll(re)) {
    names.add(m[1]);
  }
  return names;
}

const componentFiles = readdirSync(COMPONENTS_DIR).filter(isSource);

// Build the heavy-import + local-import maps and the in-degree counts.
const heavyByFile = new Map();
const inDegree = new Map();
for (const file of componentFiles) {
  const src = readFileSync(join(COMPONENTS_DIR, file), "utf8");
  heavyByFile.set(file, heavyImports(src));
  for (const name of localComponentImports(src)) {
    inDegree.set(name, (inDegree.get(name) ?? 0) + 1);
  }
}

const violations = [];
const add = (file, detail) => violations.push(`${file} ${detail}`);

// Rule 1: utils layer must be heavy-dep-free.
for (const file of readdirSync(UTILS_DIR).filter(isSource)) {
  const src = readFileSync(join(UTILS_DIR, file), "utf8");
  for (const dep of heavyImports(src)) {
    add(`utils/${file}`, `imports heavy dep "${dep}" (utils must stay light)`);
  }
}

// Rule 2: widely-imported components must be heavy-dep-free (owners excepted).
for (const file of componentFiles) {
  const name = file.replace(/\.tsx$/, "");
  if ((inDegree.get(name) ?? 0) < THRESHOLD) {
    continue;
  }
  for (const dep of heavyByFile.get(file)) {
    if (OWNERS[dep]?.has(file)) {
      continue;
    }
    add(
      file,
      `is imported by ${inDegree.get(name)} components but imports heavy dep "${dep}"`
    );
  }
}

if (violations.length) {
  console.error(`\n✗ ${violations.length} heavy-dependency leaks:\n`);
  for (const v of violations) {
    console.error(`  ${v}`);
  }
  process.exit(1);
}

console.log("✓ No heavy dependencies leak into shared/low-level modules.");
