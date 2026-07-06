// scripts/generate-tokens.ts
// Parses packages/ui/src/globals.css into a structured token list consumed by
// the docs Foundations pages. Covers the `@theme inline` block (colors, type
// scale, radius, easings) plus the `:root` / `.dark` blocks (shadows, motion
// durations, z-index layers, icon sizes) so every DESIGN.md token group stays
// in lockstep with the docs.
//
// Run: `bun scripts/generate-tokens.ts` (idempotent); `--check` is the drift
// gate. Wired into `bun run docs:generate`.
import { readFileSync, writeFileSync } from "node:fs";

const GLOBALS = "packages/ui/src/globals.css";
const OUT = "apps/docs/.generated/tokens.json";

const css = readFileSync(GLOBALS, "utf8");
// Anchor on line-start selectors — comments inside the blocks may mention
// "@theme inline" or ".dark" as prose, so a plain indexOf can mis-anchor.
const themeStart = css.search(/^@theme inline/m);
const darkStart = css.search(/^\.dark \{/m);
const theme = css.slice(themeStart);
const root = css.slice(css.search(/^:root \{/m), darkStart);
const dark = css.slice(darkStart, themeStart);

/** Collapse a multi-line CSS value to single-spaced text. */
function tidy(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** Extract `--<prefix>-<name>: value;` pairs from a CSS block, in order. */
function extractVars(
  block: string,
  prefix: string
): { name: string; value: string }[] {
  const out: { name: string; value: string }[] = [];
  const re = new RegExp(`--${prefix}-([\\w-]+):\\s*([^;]+);`, "g");
  let m: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: standard regex loop
  while ((m = re.exec(block)) !== null) {
    out.push({ name: m[1], value: tidy(m[2]) });
  }
  return out;
}

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

// Shadow scale (DESIGN.md §6): light values from :root, deepened dark values
// from .dark.
const darkShadows = new Map(
  extractVars(dark, "shadow").map((s) => [s.name, s.value])
);
const shadows = extractVars(root, "shadow").map((s) => ({
  ...s,
  dark: darkShadows.get(s.name),
}));

// Motion (DESIGN.md §7): duration ladder from :root, easing curves from the
// @theme overrides (skip the self-referential --font/--shadow mappings by
// only reading the ease namespace).
const durations = extractVars(root, "duration");
const easings = extractVars(theme, "ease");

// Layering (DESIGN.md §8) and icon sizes (DESIGN.md §4) from :root.
const layers = extractVars(root, "z");
const iconSizes = extractVars(root, "icon");

const json = `${JSON.stringify(
  { colors, typeScale, radii, shadows, durations, easings, layers, iconSizes },
  null,
  2
)}\n`;

const summary =
  `${Object.values(colors).flat().length} colors, ` +
  `${typeScale.length} type levels, ${radii.length} radii, ` +
  `${shadows.length} shadows, ${durations.length} durations, ` +
  `${easings.length} easings, ${layers.length} layers, ` +
  `${iconSizes.length} icon sizes`;

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
  console.log(`✓ tokens.json up to date (${summary}).`);
} else {
  writeFileSync(OUT, json);
  console.log(`✓ Generated ${OUT} (${summary}).`);
}
