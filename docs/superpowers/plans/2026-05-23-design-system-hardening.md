# Design System Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mature `@strait/ui` from a Storybook-browsable component set into a strictly-consistent, tested, documented, publishable npm package with CI guardrails.

**Architecture:** Five independently-shippable phases executed in order. Phase 0 makes the gates green and adds CI. Phase 1 enforces design-system consistency (audit-driven fixes + an automated convention test that fails the build on drift). Phase 2 turns the source-only package into a compiled, publishable npm artifact via `bunchee` (preserves `"use client"`, emits ESM/CJS + `.d.ts`). Phase 3 adds unit/interaction/visual/a11y testing on top of the existing stories. Phase 4 builds Foundations docs and ships the doc site.

**Tech Stack:** Bun + Turborepo, React 19, Tailwind v4 (oklch tokens), Base UI / react-aria / vaul primitives, CVA, Storybook 10 (`@storybook/react-vite`), Biome 2.4, `tsgo` typecheck. New: `bunchee` (build), `@changesets/cli` (release), Vitest + `@storybook/addon-vitest` + Playwright (test), Chromatic (visual regression), GitHub Actions (CI).

---

## Scope & phasing

Each phase is self-contained and produces working, reviewable software on its own. They share a dependency order (0 → 1 → 2/3/4 can parallelize after 1), so prefer sequential execution with a review checkpoint and a commit at the end of every phase.

- **Phase 0** — Green baseline & CI scaffold *(fast, unblocks everything)*
- **Phase 1** — Consistency remediation & automated enforcement
- **Phase 2** — npm package build & release pipeline
- **Phase 3** — Testing: unit, interaction, visual, a11y
- **Phase 4** — Docs & Foundations + deploy

**Conventions for every phase:** conventional-commit messages, **no co-author trailer**. Run `bun run --filter @strait/ui typecheck` and `bunx @biomejs/biome check packages/ui/src` before each commit. Commit at the end of each task that the plan marks "Commit".

---

## Current-state facts (verified, do not re-discover)

- `packages/ui/package.json`: `private: true`, `version: 1.0.0`, **no `main`/`module`/`types`**, `exports` map points at **raw `./src/**/*.tsx`**, `files: ["tailwind.config.ts","postcss.config.js","globals.css"]`, `sideEffects: false`, `typecheck: "tsgo --noEmit"`. peerDeps: `react`, `react-dom`.
- Components carry per-file `"use client"`; build MUST preserve these directives.
- `.gitignore` already ignores `*.tsbuildinfo`, `scripts/a11y-report.json`, `dist/`, `storybook-static/`, `node_modules/`, `.turbo/`.
- Tokens live in `packages/ui/src/globals.css` (`:root` light, `.dark` dark) and mirror to `design-system/tokens.{css,json}`.
- Gold-standard component: `packages/ui/src/components/button.tsx`.
- Remote: `github.com/strait-dev/ui`. No CI, no tests, no changesets today.
- Remaining Biome errors in `packages/ui/src` (non-a11y): 6× `noExplicitAny`, 3× `noImportantStyles`, 1× `noDoubleEquals`, 1× `noArrayIndexKey`, 1× `noDangerouslySetInnerHtml`.
- Storybook dev server: `bun run storybook` → http://localhost:6006. a11y scan: `bun scripts/a11y-scan.mjs [--theme dark]` (writes `scripts/a11y-report.json`, prints serious/critical summary). Render audit: `bun scripts/story-audit.mjs`.

---

## The Component Contract (gold-standard conventions, from button.tsx)

These are the rules Phase 1 enforces. Source: `packages/ui/src/components/button.tsx`.

| Dimension | Rule |
| --- | --- |
| Focus ring | `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` — never `ring-2`, never `ring-offset-*`, never bare `outline` for the visible ring. (`ring-[3px]` is allowed only inside arbitrary-variant strings where `ring-3` can't be used.) |
| Disabled | `disabled:cursor-not-allowed disabled:opacity-50` (+ `disabled:pointer-events-none` on non-`<button>` interactive elements). |
| Invalid | `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40` — the `ring-3` width is mandatory. |
| Colors | Semantic tokens only. **No raw palette** (`*-red-500`, `*-emerald-*`, `*-amber-*`, `*-blue-*`, `*-orange-*`, `bg-white`, `bg-black/*` for component chrome). Use `bg-destructive`, `text-success-accent`, `bg-background`, etc. |
| className | Always accept a `className` prop and merge via `cn(...)` from `../utils/index`. Never template-literal-concatenate classes. |
| data-slot | Root element (and named sub-parts) carry `data-slot="<kebab-name>"`. |
| "use client" | Present iff the file uses hooks/state/refs/event handlers or an interactive client primitive. |
| Prop typing | `React.ComponentProps<"x">` (not `React.HTMLAttributes`/`InputHTMLAttributes`) or the primitive's `.Props`; spread `{...props}`. |
| Form-control height/radius | Match `Input` baseline: `h-8`, `rounded-lg`. |

---

## File structure (created / modified)

**Created**
- `.github/workflows/ci.yml` — PR gate (lint, typecheck, build-storybook, a11y).
- `.github/workflows/release.yml` — changesets publish on main.
- `.changeset/config.json` — release config.
- `docs/component-contract.md` — the table above, expanded, as the canonical reference.
- `scripts/check-conventions.mjs` — automated convention enforcement (Phase 1).
- `packages/ui/tsup`/`bunchee` config via `package.json` fields (no separate config file needed for bunchee).
- `packages/ui/vitest.config.ts`, `packages/ui/.storybook` test setup (`vitest.setup.ts`).
- `packages/ui/src/components/foundations/*.mdx` — Foundations docs (Colors, Typography, Spacing, Radius, Shadows, Icons).
- `packages/ui/src/docs/{getting-started,installation,theming,contributing}.mdx`.
- `chromatic.config.json` (if Chromatic chosen).

**Modified**
- `packages/ui/package.json` — exports/main/module/types, build scripts, devDeps.
- `apps/storybook/.storybook/main.ts` — register addon-vitest (Phase 3) and docs globs (Phase 4).
- `~30 component .tsx files` — Phase 1 consistency fixes (enumerated below).
- `turbo.json` — add `build`, `test` pipeline entries.
- root `package.json` — add `test` script.

---

# Phase 0 — Green baseline & CI scaffold

**Outcome:** `bunx @biomejs/biome check packages/ui/src` exits 0; CI runs lint + typecheck + build-storybook + a11y on every PR.

### Task 0.1: Clear the remaining non-a11y Biome errors

**Files (modify):** the files reported by `bunx @biomejs/biome check packages/ui/src`. Run it first to get exact lines.

- [ ] **Step 1: Enumerate.** Run: `bunx @biomejs/biome check packages/ui/src 2>&1 | grep -E "lint/(suspicious|complexity|security)"`. Expected: ~12 findings (6 `noExplicitAny`, 3 `noImportantStyles`, 1 `noDoubleEquals`, 1 `noArrayIndexKey`, 1 `noDangerouslySetInnerHtml`).
- [ ] **Step 2: Auto-fixable first.** Run: `bunx @biomejs/biome check --write packages/ui/src`. Re-run check; this resolves `noDoubleEquals` (field.tsx `==`→`===`) and any other safe fixes.
- [ ] **Step 3: `noExplicitAny` (×6).** For each, replace `any` with the real type. Where a third-party generic is genuinely unknown, use `unknown` + a narrowing cast, NOT `any`. If a single case is truly unavoidable (e.g., recharts payload), add a scoped `// biome-ignore lint/suspicious/noExplicitAny: <reason>` with a concrete reason — do not blanket-disable.
- [ ] **Step 4: `noImportantStyles` (×3).** Locate the `!`-important utilities. If they exist to beat a third-party stylesheet, replace with a higher-specificity selector or a `[&_...]` arbitrary variant; otherwise remove. If unavoidable, scoped `biome-ignore` with reason.
- [ ] **Step 5: `noArrayIndexKey` (field.tsx:205) & `noDangerouslySetInnerHtml`.** For the index key, use a stable id from the data; if items are positional+identical, add a scoped `biome-ignore` (as done in slider.tsx). For `dangerouslySetInnerHTML` (chart theme `<style>`), confirm content is build-time-constant (not user input) and add a scoped `biome-ignore lint/security/noDangerouslySetInnerHtml: static chart-theme CSS, no user input`.
- [ ] **Step 6: Verify clean.** Run: `bunx @biomejs/biome check packages/ui/src`. Expected: "No fixes applied" / exit 0.
- [ ] **Step 7: Verify typecheck.** Run: `bun run --filter @strait/ui typecheck`. Expected: exit 0.
- [ ] **Step 8: Commit.** `git add -A && git commit -m "fix(ui): clear remaining biome lint errors for a clean baseline"`

### Task 0.2: Add a single repo gate script

**Files (modify):** root `package.json`, `turbo.json`.

- [ ] **Step 1:** Add to root `package.json` scripts: `"verify": "biome check . && turbo run typecheck && turbo run build-storybook"`.
- [ ] **Step 2:** Run: `bun run verify`. Expected: all three pass.
- [ ] **Step 3: Commit.** `git commit -am "chore: add verify gate script"`

### Task 0.3: CI workflow

**Files (create):** `.github/workflows/ci.yml`.

- [ ] **Step 1:** Write the workflow:

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - name: Biome
        run: bunx @biomejs/biome check .
      - name: Typecheck
        run: bun run --filter @strait/ui typecheck
      - name: Build Storybook
        run: bun run build-storybook
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with: { bun-version: latest }
      - run: bun install --frozen-lockfile
      - run: bunx playwright install --with-deps chromium
      - name: Build & serve Storybook, run a11y scan
        run: |
          bun run build-storybook
          bunx http-server storybook-static -p 6006 &
          bunx wait-on http://localhost:6006/index.json
          bun scripts/a11y-scan.mjs
          bun scripts/a11y-scan.mjs --theme dark
      - name: Fail on serious/critical findings
        run: |
          COUNT=$(bun -e "console.log(JSON.parse(require('fs').readFileSync('scripts/a11y-report.json')).filter(f=>f.impact==='serious'||f.impact==='critical').length)")
          echo "serious/critical findings: $COUNT"
          test "$COUNT" = "0"
```

- [ ] **Step 2:** Add `http-server` and `wait-on` to root devDependencies: `bun add -d http-server wait-on`.
- [ ] **Step 3: Verify locally** the a11y job logic: with Storybook running, `bun scripts/a11y-scan.mjs && bun -e "console.log(JSON.parse(require('fs').readFileSync('scripts/a11y-report.json')).length)"`. Expected: `0`.
- [ ] **Step 4: Commit & push the branch; open PR; confirm CI is green.** `git add -A && git commit -m "ci: add PR gate (biome, typecheck, storybook build, a11y scan)"`

---

# Phase 1 — Consistency remediation & enforcement

**Outcome:** every component obeys the Component Contract; `scripts/check-conventions.mjs` passes and is wired into CI so drift fails the build. This is the user's core ask: *catch the small differences and make all components follow the system strictly.*

### Task 1.1: Write the Component Contract doc

**Files (create):** `docs/component-contract.md`.

- [ ] **Step 1:** Copy the "Component Contract" table from this plan into the doc, expand each row with the exact gold-standard class string from `button.tsx` and a ✅/❌ example. This is the human reference the convention script enforces.
- [ ] **Step 2: Commit.** `git commit -m "docs: add component contract"`

### Task 1.2: Convention-enforcement script (TDD — write the check before fixing)

**Files (create):** `scripts/check-conventions.mjs`. **Test:** the script IS the test; it scans `packages/ui/src/components/*.tsx` (excluding `*.stories.tsx`).

- [ ] **Step 1: Write the script.** It reads every component file and asserts the rules below, collecting violations into an array and exiting non-zero if any remain. Use an allowlist set for legitimately-exempt files (e.g. `charts.tsx`, `checkbox-tree.tsx` demo, `direction.tsx` re-export) keyed per-rule.

```js
// scripts/check-conventions.mjs
// Enforces the Component Contract (docs/component-contract.md).
import { readFileSync, readdirSync } from "node:fs";
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
      if (RAW_COLOR.test(ln)) add(file, "rawColor", `:${i + 1} ${ln.trim().slice(0, 80)}`);
      if (/\b(?:bg|text)-white\b/.test(ln) && !/sr-only/.test(ln))
        add(file, "rawColor", `:${i + 1} bg/text-white`);
    });
  }

  // Rule: focus ring must not use ring-2 or ring-offset for the visible ring
  lines.forEach((ln, i) => {
    if (/focus-visible:ring-2\b/.test(ln)) add(file, "focusRing", `:${i + 1} ring-2 (use ring-3)`);
    if (/focus-visible:ring-offset/.test(ln)) add(file, "focusRing", `:${i + 1} ring-offset`);
  });

  // Rule: aria-invalid ring must include width when color present
  lines.forEach((ln, i) => {
    if (/aria-invalid:ring-destructive\//.test(ln) && !/aria-invalid:ring-3/.test(src))
      add(file, "ariaInvalid", `:${i + 1} missing aria-invalid:ring-3`);
  });

  // Rule: must import cn and merge className (skip pure re-exports)
  const usesClassName = /className/.test(src);
  if (usesClassName && !EXEMPT.cn.has(file) && !/from "\.\.\/utils\/index"/.test(src))
    add(file, "cn", "uses className but does not import cn from ../utils/index");
  if (/className=\{`/.test(src)) add(file, "cn", "template-literal className (use cn())");

  // Rule: "use client" present iff interactive
  const interactive = /\buse(State|Effect|Ref|Callback|Memo|Context|Reducer|Id)\b|onClick=|onChange=|onKeyDown=/.test(src);
  const hasDirective = /^["']use client["'];/.test(src.trimStart());
  if (interactive && !hasDirective) add(file, "useClient", 'interactive but missing "use client"');

  // Rule: root data-slot present
  if (!EXEMPT.dataSlot.has(file) && !/data-slot=/.test(src))
    add(file, "dataSlot", "no data-slot anywhere");

  // Rule: no React.HTMLAttributes / InputHTMLAttributes (prefer ComponentProps)
  lines.forEach((ln, i) => {
    if (/React\.(HTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes)</.test(ln))
      add(file, "propTyping", `:${i + 1} prefer React.ComponentProps<...>`);
  });
}

if (violations.length) {
  console.error(`\n✗ ${violations.length} convention violations:\n`);
  for (const v of violations) console.error("  " + v);
  process.exit(1);
}
console.log("✓ All components follow the component contract.");
```

- [ ] **Step 2: Run it to see the baseline failure set.** Run: `bun scripts/check-conventions.mjs`. Expected: FAIL with the audit's violations (focusRing, rawColor, useClient, ariaInvalid, etc.). This is the worklist for Tasks 1.3–1.10.
- [ ] **Step 3: Commit the script (red).** `git commit -m "test(ui): add component-contract convention check"`

### Task 1.3: Fix raw colors → semantic tokens

**Files (modify):** `slider.tsx`, `badge.tsx`, `input-password-with-strength-indicator.tsx`, `toast/toast-warning.tsx`, `toast/toast-info.tsx`, `toast/toast-success.tsx`, `toast/toast-confirm.tsx`.

- [ ] **Step 1: slider.tsx:54** — `bg-white` → `bg-background` on the thumb (dark-mode bug).
- [ ] **Step 2: badge.tsx:15-18** — on `info`/`success`/`warning`/`destructive` solid variants replace `text-white` → `text-info-foreground` / `text-success-foreground` / `text-warning-foreground` / `text-destructive-foreground`.
- [ ] **Step 3: input-password-with-strength-indicator.tsx** — in `getStrengthColor`: `bg-red-500`→`bg-destructive`, `bg-orange-500`→`bg-warning` (or `bg-warning/80` for the weaker step), `bg-amber-500`→`bg-warning`, `bg-emerald-500`→`bg-success`; line 282 `text-emerald-500`→`text-success-accent`; line 295 `text-emerald-600`→`text-success-accent`. (Keep the empty/base step `bg-border`.)
- [ ] **Step 4: toast icons** — `toast-warning.tsx:11` `text-amber-500`→`text-warning-accent`; `toast-info.tsx:11` `text-blue-500`→`text-info-accent`; `toast-success.tsx:11` `text-emerald-500`→`text-success-accent`; `toast-confirm.tsx:45` `text-amber-500`→`text-warning-accent`.
- [ ] **Step 5: Visual check** in Storybook (light + dark) for Slider, Badge, the password-strength input, and each Toast story — confirm colors read correctly in both themes.
- [ ] **Step 6:** Re-run `bun scripts/check-conventions.mjs` — `rawColor` violations gone; then set `EXEMPT.rawColor` to empty (already is) and confirm.
- [ ] **Step 7: Commit.** `git commit -am "fix(ui): replace raw palette colors with semantic tokens"`

### Task 1.4: Normalize focus rings

**Files (modify):** `badge.tsx:8`, `sidebar.tsx` (lines 401, 425, 476, 565, 680), `navigation-menu.tsx:59,136`, `scroll-area.tsx:19`, `input-with-show-hide-password.tsx:33`, `input-with-loader.tsx:52`, `tabs.tsx:60`, plus the `ring-offset` users in the number-input + date-range-picker cluster.

- [ ] **Step 1:** Replace every `focus-visible:ring-2` with `focus-visible:ring-3`, every bare `focus-visible:ring-ring` with `focus-visible:ring-ring/50`, and add `focus-visible:border-ring` where missing. Remove `focus-visible:ring-offset-*` and `focus-visible:ring-offset-background` from component chrome.
- [ ] **Step 2:** In `navigation-menu.tsx` and `scroll-area.tsx` and `tabs.tsx`, drop the redundant `focus-visible:outline-1`/`focus-visible:outline` when a ring is present (keep `outline-none`/`outline-hidden` resets).
- [ ] **Step 3:** For composite containers that legitimately use `focus-within`/`data-focus-within` (`input-with-addons`, `input-with-inner-tags`, number-inputs, date-range-pickers), keep the `focus-within` trigger but align the values to `ring-3 ring-ring/50 border-ring` and drop `ring-offset`.
- [ ] **Step 4: Visual check** focus states (keyboard-tab) on Badge, Sidebar items, NavigationMenu, ScrollArea, Tabs, the number inputs, date-range pickers — both themes.
- [ ] **Step 5:** Re-run convention check — `focusRing` violations gone.
- [ ] **Step 6: Commit.** `git commit -am "fix(ui): standardize focus-ring on ring-3/ring-ring/border-ring"`

### Task 1.5: Complete aria-invalid handling

**Files (modify):** `select-native.tsx:14`, `toggle.tsx:9`, `input-with-inner-tags.tsx:95`, and add invalid handling to the form-wrapper containers `input-with-addons.tsx`, `date-range-picker.tsx`, `date-range-picker-with-presets.tsx`, the three `number-input-*` Group containers, and `combobox.tsx`.

- [ ] **Step 1:** Add the missing `aria-invalid:ring-3` to the three components that have the destructive color but no width.
- [ ] **Step 2:** For container components, mirror the Input pattern using the `has-[...]` selector already used in `input-group.tsx`: `has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40`.
- [ ] **Step 3: Visual check** — set `aria-invalid` in a scratch story (or via the existing form stories) for each and confirm the destructive ring renders in both themes.
- [ ] **Step 4:** Re-run convention check — `ariaInvalid` violations gone.
- [ ] **Step 5: Commit.** `git commit -am "fix(ui): complete aria-invalid styling across form controls"`

### Task 1.6: Add missing "use client" directives

**Files (modify):** `navigation-menu.tsx`, `navigation-rail.tsx` (confirm each truly needs it via the interactive check), and any others the convention script flags under `useClient`.

- [ ] **Step 1:** Add `"use client";` as the first line of each flagged interactive file.
- [ ] **Step 2:** For files flagged as having `"use client"` *unnecessarily* (`separator.tsx`, `label.tsx`, `table.tsx`, `progress.tsx` — verify they use no hooks/handlers AND wrap no client-only primitive), remove the directive. **Caution:** only remove if the underlying primitive is server-safe; when unsure, keep it (false positive is harmless, missing one is a hydration bug).
- [ ] **Step 3:** Re-run convention check — `useClient` violations gone.
- [ ] **Step 4: Verify typecheck + Storybook still render** the affected components.
- [ ] **Step 5: Commit.** `git commit -am 'fix(ui): correct "use client" directives for RSC compatibility'`

### Task 1.7: Fix the `cn()` template-literal bug + className forwarding

**Files (modify):** `input-with-inner-tags.tsx:121`, `charts.tsx`, `checkbox-tree.tsx`.

- [ ] **Step 1: input-with-inner-tags.tsx:121** — replace the `` className={`... ${className || ""}`} `` template literal with `className={cn("...", className)}`.
- [ ] **Step 2: charts.tsx** — add `className` to each chart component's props and forward it: `className={cn("<defaults>", className)}` on the chart container; spread `{...props}` where the recharts wrapper allows.
- [ ] **Step 3:** Re-run convention check — `cn` violations gone.
- [ ] **Step 4: Commit.** `git commit -am "fix(ui): use cn() for className merging consistently"`

### Task 1.8: Add missing `data-slot` attributes

**Files (modify):** the set the convention script flags under `dataSlot`: `navigation-rail.tsx` (+ sub-parts), `data-table.tsx`, `charts.tsx`, `credenza.tsx` parts, `date-picker.tsx`, `date-range-picker*.tsx`, `shell.tsx`, `spinner.tsx`, `sonner.tsx`, `phone-input.tsx`, `select-with-search*.tsx`, the calendar/date recipe roots, and the `toast/*` parts.

- [ ] **Step 1:** Add `data-slot="<kebab-name>"` to each component's root element (and named sub-parts, matching the naming used elsewhere — e.g. `data-slot="navigation-rail"`, `data-slot="navigation-rail-item"`).
- [ ] **Step 2:** Re-run convention check — `dataSlot` violations gone (keep only the genuine exemptions: `direction.tsx`, demo `checkbox-tree.tsx`).
- [ ] **Step 3: Commit.** `git commit -am "fix(ui): add data-slot to component roots for CSS targeting"`

### Task 1.9: Align form-control height & radius; prop typing

**Files (modify):** the `h-9`/`rounded-md` cluster (`select-native.tsx`, `input-with-addons.tsx`, `input-with-inner-tags.tsx`, the three `number-input-*`, `date-range-picker.tsx`, `date-picker.tsx`), and the `HTMLAttributes`/`InputHTMLAttributes` users (`form.tsx`, `stepper.tsx`, `timeline.tsx`, `navigation-rail.tsx`, `shell.tsx`, the `input-with-*`/`password-input`/strength-indicator inputs).

- [ ] **Step 1:** Change `h-9`→`h-8` and `rounded-md`→`rounded-lg` on the listed form-control containers so they match the `Input` baseline. **Verify** each still vertically centers its contents after the height change (adjust padding only if clipping).
- [ ] **Step 2:** Replace `React.HTMLAttributes<HTMLXElement>` → `React.ComponentProps<"x">` and `React.InputHTMLAttributes<HTMLInputElement>` → `React.ComponentProps<"input">`. Fix any resulting type errors (these types add `ref`/`key`; usually no code change needed).
- [ ] **Step 3:** Re-run convention check — `propTyping` violations gone.
- [ ] **Step 4: Verify typecheck** exit 0 and visual alignment of inputs in a form story.
- [ ] **Step 5: Commit.** `git commit -am "fix(ui): align form-control height/radius and prop typings to baseline"`

### Task 1.10: Tighten exemptions, wire the check into CI, green the gate

**Files (modify):** `scripts/check-conventions.mjs`, `.github/workflows/ci.yml`, root `package.json`.

- [ ] **Step 1:** Remove any now-unnecessary entries from `EXEMPT`. Each remaining exemption must have a one-line comment justifying it.
- [ ] **Step 2:** Add `"check:conventions": "bun scripts/check-conventions.mjs"` to root `package.json`; add it to `verify`.
- [ ] **Step 3:** Add a `conventions` step to `ci.yml`'s `verify` job: `- run: bun scripts/check-conventions.mjs`.
- [ ] **Step 4: Run the full gate.** `bun run verify`. Expected: conventions ✓, biome ✓, typecheck ✓, storybook build ✓.
- [ ] **Step 5: Final consistency re-scan** — re-run a11y light+dark scans to confirm the visual changes introduced no contrast regressions (`bun scripts/a11y-scan.mjs` and `--theme dark`; both 0).
- [ ] **Step 6: Commit.** `git commit -am "ci(ui): enforce component contract in CI"`

---

# Phase 2 — npm package build & release pipeline

**Outcome:** `@strait/ui` builds to `dist/` (ESM + CJS + `.d.ts`, `"use client"` preserved), exposes correct `exports`/`types`, passes `publint` + `attw`, and releases via Changesets.

### Task 2.1: Add bunchee and a build script

**Files (modify):** `packages/ui/package.json`. **Add devDep:** `bunchee`.

- [ ] **Step 1:** `bun add -d --filter @strait/ui bunchee publint @arethetypeswrong/cli`.
- [ ] **Step 2:** bunchee derives entries from the `exports` map. Convert each `exports` target from `./src/...tsx` to the **published** path with conditions, e.g.:

```jsonc
"exports": {
  "./components/button": {
    "types": "./dist/components/button.d.ts",
    "import": "./dist/components/button.js",
    "require": "./dist/components/button.cjs"
  },
  // ...one block per component (script-generate, see Step 3)
  "./globals.css": "./src/globals.css",
  "./css": "./src/globals.css",
  "./tailwind.config": "./dist/tailwind.config.js"
}
```

- [ ] **Step 3:** Because there are ~95 subpath exports, **generate** the new exports map with a one-off node script that reads the current map and rewrites every `./src/components/X.tsx` to the conditions block above (keep CSS/postcss/tailwind-config special cases). Run it, then hand-verify the diff.
- [ ] **Step 4:** Add top-level fields: `"type": "module"`, `"main": "./dist/index.cjs"`, `"module": "./dist/index.js"`, `"types": "./dist/index.d.ts"`, and a barrel `"."` export. Add a `src/index.ts` barrel that re-exports the public components (generate from the exports list).
- [ ] **Step 5:** Update `"files"` to `["dist", "src/globals.css", "tailwind.config.ts", "postcss.config.mjs"]`. Add scripts: `"build": "bunchee --tsconfig tsconfig.json"`, `"prepublishOnly": "bun run build"`.
- [ ] **Step 6:** Add `build` to `turbo.json` pipeline with `"outputs": ["dist/**"]`.

### Task 2.2: Build, preserve directives, externalize peers

- [ ] **Step 1:** Ensure `peerDependencies` covers `react`/`react-dom` (done). bunchee auto-externalizes deps + peerDeps; confirm no peer leaks.
- [ ] **Step 2: Run the build.** `bun run --filter @strait/ui build`. Expected: `dist/` populated with `.js`, `.cjs`, `.d.ts` per entry.
- [ ] **Step 3: Verify `"use client"` preserved.** Run: `head -1 packages/ui/dist/components/button.js`. Expected: `"use client";` (or `'use client';`). bunchee preserves per-file directives; if a bundled entry stripped it, split that entry or add the directive via bunchee's preserve behavior.
- [ ] **Step 4: Verify types.** Run: `bunx attw --pack packages/ui` and `bunx publint packages/ui`. Fix any reported export/types resolution problems. Expected: no errors (or only intentional warnings).

### Task 2.3: Consumption smoke test

**Files (create):** `packages/ui/scripts/smoke-consume.mjs` or a throwaway temp app.

- [ ] **Step 1:** `bun run --filter @strait/ui build` then `npm pack` in `packages/ui` to produce a tarball.
- [ ] **Step 2:** In a temp dir, `bun add ./strait-ui-1.0.0.tgz react react-dom`, then write `import { Button } from "@strait/ui/components/button"` in a `.tsx` and run `tsgo --noEmit` to confirm types resolve and the subpath import works.
- [ ] **Step 3: Commit.** `git add -A && git commit -m "build(ui): compile to dist via bunchee with preserved 'use client'"`

### Task 2.4: Changesets release pipeline

**Files (create):** `.changeset/config.json`, `.github/workflows/release.yml`. **Add devDep:** `@changesets/cli`.

- [ ] **Step 1:** `bun add -d @changesets/cli && bunx changeset init`. In `.changeset/config.json` set `"access": "restricted"` (or `"public"` if publishing publicly) and `baseBranch: "main"`.
- [ ] **Step 2:** Decide publish target: GitHub Packages (matches `strait-dev` org) or npm public. Set `publishConfig` in `packages/ui/package.json` accordingly and remove `"private": true` **only when ready to publish**.
- [ ] **Step 3:** Add `release.yml` using `changesets/action@v1` (creates a "Version Packages" PR; publishes on merge) with `NPM_TOKEN`/`GITHUB_TOKEN` secrets.
- [ ] **Step 4:** Add a `changeset` script to root `package.json`: `"changeset": "changeset"`, `"version": "changeset version"`, `"release": "turbo run build && changeset publish"`.
- [ ] **Step 5: Verify** `bunx changeset status` runs. Create a first changeset describing the Phase 0–1 changes.
- [ ] **Step 6: Commit.** `git add -A && git commit -m "ci(ui): add changesets release pipeline"`

---

# Phase 3 — Testing (unit, interaction, visual, a11y)

**Outcome:** stories double as tests (Storybook + Vitest browser mode), key interactive components have `play`-function interaction tests, visual regression runs on PRs (Chromatic), and a11y assertions fail CI on regressions.

### Task 3.1: Vitest + Storybook test addon setup

**Files (create):** `packages/ui/vitest.config.ts`, `packages/ui/.storybook/vitest.setup.ts`. **Modify:** `apps/storybook/.storybook/main.ts`, `packages/ui/package.json`. **Add devDeps:** `vitest`, `@vitest/browser`, `playwright`, `@storybook/addon-vitest`.

- [ ] **Step 1:** `bun add -d --filter @strait/ui vitest @vitest/browser playwright @storybook/addon-vitest`.
- [ ] **Step 2:** `bunx playwright install chromium`.
- [ ] **Step 3:** Register the addon in `apps/storybook/.storybook/main.ts` `addons: [..., "@storybook/addon-vitest"]`.
- [ ] **Step 4:** Create `vitest.config.ts` using the Storybook Vitest plugin (`storybookTest`) with `browser: { enabled: true, provider: "playwright", instances: [{ browser: "chromium" }] }` and the setup file that calls `setProjectAnnotations` from the preview.
- [ ] **Step 5:** Add scripts: `"test": "vitest run"`, `"test:watch": "vitest"`. Add `test` to `turbo.json`.
- [ ] **Step 6: Verify** `bun run --filter @strait/ui test` runs and discovers stories as tests.

### Task 3.2: Smoke-test all stories render (free coverage)

- [ ] **Step 1:** With the addon, every story is automatically a render test. Run: `bun run --filter @strait/ui test`. Expected: all ~91 components' stories mount with no errors (this replaces `story-audit.mjs` with assertions).
- [ ] **Step 2:** Fix any story that throws on mount (likely none — render audit was clean — but harness stories with timers/state may need `await`).
- [ ] **Step 3: Wire into CI** — add a `test` job to `ci.yml` (bun install → playwright install chromium → `bun run --filter @strait/ui test`).
- [ ] **Step 4: Commit.** `git add -A && git commit -m "test(ui): run stories as Vitest browser smoke tests"`

### Task 3.3: Interaction tests (`play` functions) for stateful components

**Files (modify):** the `.stories.tsx` of interactive components. Add a dedicated `play`-driven story per behavior.

Worked example (apply this pattern; one story per key interaction):

```tsx
// dialog.stories.tsx — add:
import { expect, userEvent, within, waitFor } from "storybook/test";

export const OpensAndCloses: Story = {
  render: () => (/* trigger + Dialog as in the Default story */),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /open/i }));
    const dialog = await within(document.body).findByRole("dialog");
    await expect(dialog).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(within(document.body).queryByRole("dialog")).toBeNull());
  },
};
```

- [ ] **Step 1: Tier-1 (must have interaction tests)** — author `play` stories for: `dialog`, `alert-dialog`, `drawer`, `sheet`, `popover`, `dropdown-menu`, `context-menu`, `tooltip`, `hover-card`, `combobox`, `multiselect`, `command`, `select`, `select-with-search`, `tabs`, `accordion`, `collapsible`, `checkbox`, `radio-group`, `switch`, `slider`, `toggle`, `toggle-group`, `form` (submit + validation), `input-otp`, `pagination`, `stepper`, `sonner` (toast fires). One assertion-bearing `play` per primary behavior.
- [ ] **Step 2: Tier-2 (assert key state)** — `calendar`/date-pickers (select a date → value updates), `data-table` (sort/filter), `carousel` (next/prev), `navigation-menu`/`menubar` (open submenu). Use fixed `defaultValue`s for determinism.
- [ ] **Step 3: Tier-3 (render-only, already covered by 3.2)** — presentational atoms (`badge`, `avatar`, `card`, `skeleton`, `separator`, `kbd`, `spinner`, `aspect-ratio`, `timeline`, `empty`, `item`, `charts`) need no extra `play`.
- [ ] **Step 4: Run** `bun run --filter @strait/ui test` after each batch; keep green.
- [ ] **Step 5: Commit per tier.** e.g. `git commit -am "test(ui): interaction tests for overlay & form components"`

### Task 3.4: Visual regression

**Decision:** Chromatic (hosted, native Storybook, light/dark via globals, PR diffs). Alternative if self-hosting required: Playwright `toHaveScreenshot` over `iframe.html?id=...` (reuse the a11y scan's iteration).

- [ ] **Step 1 (Chromatic path):** `bun add -d chromatic`. Add `CHROMATIC_PROJECT_TOKEN` secret.
- [ ] **Step 2:** Add `chromatic.config.json` and a `chromatic` job to CI: `bunx chromatic --exit-zero-on-changes` on PRs (review baselines), strict on main.
- [ ] **Step 3:** Configure dual-theme snapshots via Chromatic `modes` (light/dark) in `.storybook/preview` (`globals` theme), so each story is captured in both — locking in the contrast fixes.
- [ ] **Step 4: Establish baselines** on the first run; review and accept.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "test(ui): add Chromatic visual regression (light + dark)"`

### Task 3.5: a11y assertions in the test run

- [ ] **Step 1:** Enable the addon-a11y test integration so `play`/render tests also assert no serious/critical axe violations (Storybook 10 supports a11y assertions in the Vitest run). Configure `parameters.a11y.test = "error"` globally in preview.
- [ ] **Step 2:** Keep `scripts/a11y-scan.mjs` as the cross-cutting dual-theme sweep in CI (Phase 0 job) for defense-in-depth.
- [ ] **Step 3: Run** `bun run --filter @strait/ui test`; fix any newly-surfaced node-level a11y failures.
- [ ] **Step 4: Commit.** `git commit -am "test(ui): assert axe a11y in story tests"`

### Task 3.6: Coverage map & doc

**Files (create):** `docs/testing.md`.

- [ ] **Step 1:** Document the three tiers, how to run tests, and a table mapping every component → tier. This is the checklist that proves "all components are tested."
- [ ] **Step 2: Commit.** `git commit -m "docs: testing strategy and per-component coverage map"`

---

# Phase 4 — Docs & Foundations + deploy

**Outcome:** a Foundations section generated from tokens, onboarding docs, and a deployed public Storybook.

### Task 4.1: Foundations docs from tokens

**Files (create):** `packages/ui/src/components/foundations/{colors,typography,spacing,radius,shadows,icons}.mdx`. **Modify:** `apps/storybook/.storybook/main.ts` (ensure `*.mdx` in `stories` globs).

- [ ] **Step 1:** Add a small loader that imports `design-system/tokens.json` and renders swatches/scales. For **Colors**: render every semantic token (base/`-foreground`/`-accent`) as a swatch with its oklch value and a computed contrast badge, in light and dark. For **Typography/Spacing/Radius/Shadows**: render the scales.
- [ ] **Step 2:** For **Icons**: render the Hugeicons set used, with names, as a searchable grid.
- [ ] **Step 3:** Title them `Foundations/Colors`, etc., so they sort to the top of the sidebar.
- [ ] **Step 4: Verify** they render in `bun run storybook` (light + dark).
- [ ] **Step 5: Commit.** `git commit -am "docs(ui): add Foundations (colors, type, spacing, radius, shadows, icons)"`

### Task 4.2: Onboarding MDX

**Files (create):** `packages/ui/src/docs/{getting-started,installation,theming,contributing}.mdx`.

- [ ] **Step 1: Installation** — install command, peer deps, importing `globals.css`, Tailwind v4 setup, subpath imports (`@strait/ui/components/button`), RSC `"use client"` note.
- [ ] **Step 2: Theming** — token architecture (`:root`/`.dark`), how to override tokens, dark-mode wiring (`next-themes`), brand/status triads.
- [ ] **Step 3: Getting Started** — a 5-minute "render your first Button + Dialog" walkthrough.
- [ ] **Step 4: Contributing** — the Component Contract, how to run `verify`/`test`, how to add a story, conventional commits.
- [ ] **Step 5: Commit.** `git commit -am "docs(ui): getting-started, installation, theming, contributing"`

### Task 4.3: Autodocs description audit

- [ ] **Step 1:** Sweep every `*.stories.tsx` `meta.parameters.docs.description.component` — ensure each has a one-paragraph description and `argTypes` descriptions. Fill gaps. (Checklist: iterate the component list; missing/empty descriptions are the worklist.)
- [ ] **Step 2: Commit.** `git commit -am "docs(ui): complete autodocs descriptions"`

### Task 4.4: Deploy the doc site

- [ ] **Step 1:** Pick host: Chromatic publish (free static Storybook hosting, already integrated) — simplest; or Vercel/GH Pages from `storybook-static`.
- [ ] **Step 2:** Add a `deploy-docs` CI job on `main`: `bun run build-storybook` → publish. For Chromatic, `chromatic` already uploads; enable "publish" link.
- [ ] **Step 3:** Add the live URL to root `README.md`.
- [ ] **Step 4: Commit.** `git commit -am "ci(docs): deploy Storybook on main"`

---

## Self-review (acceptance criteria)

- **Phase 0:** `bunx @biomejs/biome check packages/ui/src` exit 0; CI green on a PR; a11y job fails if any serious/critical introduced.
- **Phase 1:** `bun scripts/check-conventions.mjs` exit 0 with minimal justified exemptions; a11y light+dark still 0; CI runs the convention check.
- **Phase 2:** `bun run --filter @strait/ui build` produces `dist/` with preserved `"use client"`; `publint` + `attw` clean; tarball consumes in a temp app with working types; changesets `status` works.
- **Phase 3:** `bun run --filter @strait/ui test` runs all stories as tests; Tier-1/Tier-2 components have `play` interaction tests; Chromatic baselines exist for light+dark; a11y asserted in the test run; coverage map documented.
- **Phase 4:** Foundations + onboarding MDX render; autodocs descriptions complete; Storybook deployed with a public URL in the README.

## Risks & notes

- **bunchee + `"use client"`:** verify directive preservation per-entry (Task 2.2 Step 3); if a bundled entry strips it, keep entries unbundled (one output file per source) so directives survive.
- **`tsgo` vs `.d.ts` emit:** bunchee uses its own type bundling; keep `tsgo` for fast `--noEmit` typecheck, let bunchee emit declarations. If bunchee's d.ts choke on `tsgo`-only syntax, fall back to `tsc --emitDeclarationOnly` for types.
- **Exports map size (~95 entries):** generate the build-time exports rewrite (Task 2.1 Step 3) rather than editing by hand; hand-verify the diff.
- **Test runtime:** browser-mode Vitest + Playwright is heavier in CI; cache the Playwright browser and shard if the run exceeds ~10 min.
- **Chromatic cost/secret:** needs a project token + may incur snapshot costs; the Playwright-screenshot fallback is fully self-hosted if that's a blocker.
- **Phase independence:** 2, 3, 4 can run in parallel after Phase 1; keep Phase 1 first so tests/docs/build target the corrected components.
- **`private: true`:** leave it set until Task 2.4 Step 2 is intentionally executed; building is fine while private.
