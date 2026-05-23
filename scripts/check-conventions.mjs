// scripts/check-conventions.mjs
// Enforces the Component Contract (docs/component-contract.md).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "packages/ui/src/components";
const files = readdirSync(DIR).filter(
  (f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"),
);

// Per-rule exemptions: { ruleId: Set<filename> }
const EXEMPT = {
  rawColor: new Set([]), // tighten to empty after Phase 1 fixes land
  dataSlot: new Set(["direction.tsx", "checkbox-tree.tsx"]),
  cn: new Set(["direction.tsx"]),
};

const RAW_COLOR =
  /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d{2,3}\b/;

const violations = [];
function add(file, rule, detail) {
  violations.push(`${file} [${rule}] ${detail}`);
}

for (const file of files) {
  const src = readFileSync(join(DIR, file), "utf8");
  const lines = src.split("\n");

  // Rule: no raw palette colors (also catches bg-white / text-white in chrome)
  if (!EXEMPT.rawColor.has(file)) {
    lines.forEach((ln, i) => {
      if (RAW_COLOR.test(ln))
        add(file, "rawColor", `:${i + 1} ${ln.trim().slice(0, 80)}`);
      if (/\b(?:bg|text)-white\b/.test(ln) && !/sr-only/.test(ln))
        add(file, "rawColor", `:${i + 1} bg/text-white`);
    });
  }

  // Rule: focus ring must not use ring-2 or ring-offset for the visible ring
  lines.forEach((ln, i) => {
    if (/focus-visible:ring-2\b/.test(ln))
      add(file, "focusRing", `:${i + 1} ring-2 (use ring-3)`);
    if (/focus-visible:ring-offset/.test(ln))
      add(file, "focusRing", `:${i + 1} ring-offset`);
  });

  // Rule: aria-invalid ring must include width when color present
  lines.forEach((ln, i) => {
    if (
      /aria-invalid:ring-destructive\//.test(ln) &&
      !/aria-invalid:ring-3/.test(src)
    )
      add(file, "ariaInvalid", `:${i + 1} missing aria-invalid:ring-3`);
  });

  // Rule: must import cn and merge className (skip pure re-exports)
  const usesClassName = /className/.test(src);
  if (
    usesClassName &&
    !EXEMPT.cn.has(file) &&
    !/from "\.\.\/utils\/index"/.test(src)
  )
    add(
      file,
      "cn",
      "uses className but does not import cn from ../utils/index",
    );
  if (/className=\{`/.test(src))
    add(file, "cn", "template-literal className (use cn())");

  // Rule: "use client" present iff interactive
  const interactive =
    /\buse(State|Effect|Ref|Callback|Memo|Context|Reducer|Id)\b|onClick=|onChange=|onKeyDown=/.test(
      src,
    );
  const hasDirective = /^["']use client["'];/.test(src.trimStart());
  if (interactive && !hasDirective)
    add(file, "useClient", 'interactive but missing "use client"');

  // Rule: root data-slot present (JSX attr `data-slot=` or, for useRender/
  // mergeProps components, the object-property form `"data-slot":`)
  if (!EXEMPT.dataSlot.has(file) && !/data-slot["']?\s*[:=]/.test(src))
    add(file, "dataSlot", "no data-slot anywhere");

  // Rule: no React.HTMLAttributes / InputHTMLAttributes (prefer ComponentProps)
  lines.forEach((ln, i) => {
    if (
      /React\.(HTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes)</.test(
        ln,
      )
    )
      add(file, "propTyping", `:${i + 1} prefer React.ComponentProps<...>`);
  });
}

if (violations.length) {
  console.error(`\n✗ ${violations.length} convention violations:\n`);
  for (const v of violations) console.error(`  ${v}`);
  process.exit(1);
}
console.log("✓ All components follow the component contract.");
