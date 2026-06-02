// scripts/generate-tokens.ts
// Parses the `@theme inline` block of packages/ui/src/globals.css into a
// structured token list consumed by the docs Foundations pages. Keeps the
// color/typography/radius specimens in lockstep with the design system.
//
// Run: `bun scripts/generate-tokens.ts` (idempotent); `--check` is the drift
// gate. Wired into `bun run docs:generate`.
import { readFileSync, writeFileSync } from "node:fs";

const GLOBALS = "packages/ui/src/globals.css";
const OUT = "apps/docs/.generated/tokens.json";

const css = readFileSync(GLOBALS, "utf8");
const theme = css.slice(css.indexOf("@theme inline"));

/** Bucket a color token name into a semantic group. */
function colorGroup(name: string): string {
  if (name.startsWith("chart-")) {
    return "Chart";
  }
  if (name.startsWith("sidebar")) {
    return "Sidebar";
  }
  if (/^(success|destructive|info|warning|invert)\b/.test(name)) {
    return "Status";
  }
  if (/^(primary|brand|secondary)\b/.test(name)) {
    return "Brand";
  }
  return "Surfaces";
}

const colors: Record<string, string[]> = {
  Surfaces: [],
  Brand: [],
  Status: [],
  Chart: [],
  Sidebar: [],
};
const colorRe = /--color-([\w-]+):/g;
let m: RegExpExecArray | null;
// biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop
while ((m = colorRe.exec(theme)) !== null) {
  colors[colorGroup(m[1])].push(m[1]);
}

// Type scale: each `--text-<name>` plus its line-height / font-weight modifiers,
// in declaration order.
const TYPE_ORDER = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "body",
  "body-sm",
  "caption",
  "micro",
];
const typeScale = TYPE_ORDER.map((name) => {
  const size = theme.match(new RegExp(`--text-${name}:\\s*([^;]+);`))?.[1];
  const lineHeight = theme.match(
    new RegExp(`--text-${name}--line-height:\\s*([^;]+);`)
  )?.[1];
  const weight = theme.match(
    new RegExp(`--text-${name}--font-weight:\\s*([^;]+);`)
  )?.[1];
  return {
    name,
    size: size?.trim(),
    lineHeight: lineHeight?.trim(),
    weight: weight?.trim(),
  };
}).filter((t) => t.size);

// Radius scale.
const radii: { name: string; value: string }[] = [];
const radiusRe = /--radius-([\w-]+):\s*([^;]+);/g;
// biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop
while ((m = radiusRe.exec(theme)) !== null) {
  radii.push({ name: m[1], value: m[2].trim() });
}

const json = `${JSON.stringify({ colors, typeScale, radii }, null, 2)}\n`;

if (process.argv.includes("--check")) {
  let existing: string | null = null;
  try {
    existing = readFileSync(OUT, "utf8");
  } catch {
    existing = null;
  }
  if (existing !== json) {
    console.error(
      `✗ ${OUT} is out of date. Run \`bun run docs:generate\` and commit.`
    );
    process.exit(1);
  }
  console.log(
    `✓ tokens.json up to date (${Object.values(colors).flat().length} colors, ` +
      `${typeScale.length} type levels, ${radii.length} radii).`
  );
} else {
  writeFileSync(OUT, json);
  console.log(
    `✓ Generated ${OUT} (${Object.values(colors).flat().length} colors, ` +
      `${typeScale.length} type levels, ${radii.length} radii).`
  );
}
