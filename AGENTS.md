# Contributor Operating Guide

Operating guide for contributors and AI agents working on this repository. **Read this before making changes.**

If instructions conflict, use this priority order:
1. Direct user request
2. This file
3. Existing code patterns
4. Personal preference

The same guide lives in both `AGENTS.md` and `CLAUDE.md`. Keep them in sync: any edit to one must be mirrored in the other.

---

## 1. What this repo is

`@strait/ui` is Strait's design system — a custom React component library built on [Tailwind CSS v4](https://tailwindcss.com), [Base UI](https://base-ui.com), and a set of semantic, `oklch`-based design tokens. It ships 120+ accessible, tree-shakeable components spanning forms, overlays, data display, navigation, and rich application patterns, all themeable through a single stylesheet (`@strait/ui/css`). Each component is published as its own subpath export (`@strait/ui/components/<name>`).

The repo is a [Bun](https://bun.sh) + [Turborepo](https://turbo.build) monorepo. `@strait/ui` (`packages/ui`) is the only published package; the Storybook workspace (`apps/storybook`) is private and is the reference/docs site, published to <https://strait-dev.github.io/ui/>.

Read first:
- `README.md`: overview, install, usage, tech stack
- `packages/ui/README.md`: package-level quick start and highlights
- `docs/component-contract.md`: the canonical, machine-enforced component contract
- `packages/ui/src/docs/theming.mdx`: token architecture, dark mode, single-token rebrand
- `packages/ui/src/docs/contributing.mdx`: contributor walkthrough (setup, stories, gates)
- `RELEASING.md`: Changesets + OIDC publish pipeline

---

## 2. Tech stack

- **Language**: TypeScript (React 19), ESM only
- **Styling**: Tailwind CSS v4 (`@theme` tokens, `@config`), `tw-animate-css`, semantic `oklch` CSS custom properties
- **Primitives**: Base UI (`@base-ui/react`), React Aria Components — Radix-free
- **Variants**: `class-variance-authority` + `tailwind-merge`, merged through the `cn` helper (`packages/ui/src/utils`)
- **Icons**: `@hugeicons/react` + `@hugeicons/core-free-icons` (`IconSvgElement`), never loose SVG
- **Forms / tables / charts**: `@tanstack/react-form`, `@tanstack/react-table`, `recharts`
- **Dates**: `date-fns`, `react-day-picker`, `@internationalized/date`
- **Misc runtime**: `motion`, `sonner` (toasts, themed via `next-themes`), `shiki` (code), `cmdk`, `vaul`, `embla-carousel-react`
- **Build**: `bunchee` (per-component tree-shakeable output)
- **Docs / reference**: Storybook 10 (`@storybook/react-vite`), MDX
- **Tests**: Vitest + Testing Library (unit), Storybook interaction tests (headless Chromium via Playwright), Chromatic (visual regression)
- **Tooling**: Biome (via `ultracite` presets), lefthook, Turbo, Changesets, ts-morph (docs generation)

Package manager is **Bun** (`packageManager: bun@…`); use `bun` / `bunx`, not npm or pnpm, for local work.

---

## 3. Repository layout

Monorepo. Top level:

- `packages/ui/`: the published `@strait/ui` library (this is where most work happens)
- `packages/config/`: shared internal config
- `apps/storybook/`: the Storybook reference + docs site (private, `@strait/storybook`)
- `scripts/`: repo automation (contract checks, docs generation, release notes)
- `docs/`: repo-level engineering docs (`component-contract.md`, audits)
- `.changeset/`: pending release notes
- `.github/workflows/`: CI
- `lefthook.yml`: git hooks

Inside `packages/ui/`:

- `src/components/`: one file per component, with colocated `*.stories.tsx` and `*.test.tsx`
- `src/components/foundations/`: tokens/colors/typography MDX docs
- `src/docs/`: getting-started, installation, theming, contributing MDX
- `src/utils/`: the `cn` class-merge helper and shared utilities
- `src/globals.css`: the single source of truth for design tokens (`:root`, `.dark`, `@theme inline`)
- `tailwind.config.ts`, `postcss.config.mjs`: Tailwind v4 + PostCSS wiring
- `llms.txt`, `llms-full.txt`, `components.json`: generated discoverability artifacts (do not hand-edit — see §4)
- `dist/`: build output (generated)

Key `scripts/`:

| Script | Purpose |
|---|---|
| `check-conventions.mjs` | Enforces the component contract (`docs/component-contract.md`). Run via `bun run check:conventions`. |
| `generate-llms.ts` | Generates `llms.txt` / `llms-full.txt` / `components.json` from component source via ts-morph. `--check` is the CI drift gate. |
| `check-changeset-format.mjs` | Requires every changeset summary to start with a Conventional Commits type. |
| `check-docs.mjs` | TSDoc coverage gate for the public component/prop surface. |
| `check-heavy-deps.mjs`, `check-trusted-deps.mjs` | Supply-chain / heavy-dependency guards. |
| `release-notes.mjs` (+ `.test.mjs`) | Pure formatter for the categorized GitHub Release notes. |

---

## 4. Generated artifacts — never hand-edit

`packages/ui/llms.txt`, `packages/ui/llms-full.txt`, `packages/ui/components.json`, and their copies under `apps/storybook/public/` are **generated** from component source by `scripts/generate-llms.ts`. CI fails on drift (`bun run check:docs:drift`).

To change their content, edit the **source** (component TSDoc, the `THEMING_GUIDE` / `LIBRARY_SUMMARY` constants in `generate-llms.ts`, or the component itself), then regenerate and commit the result:

```bash
bun run docs:generate
```

Likewise, `packages/ui/CHANGELOG.md` and the version in `packages/ui/package.json` are owned by Changesets — never edit them by hand (see §10).

---

## 5. The component contract (non-negotiable)

Every component obeys a shared contract so the system stays consistent. It is documented in full in `docs/component-contract.md` and **machine-enforced** by `scripts/check-conventions.mjs` (run in CI and via `bun run verify`). The gold standard is `packages/ui/src/components/button.tsx` — when in doubt, copy what Button does.

Enforced rules (drift fails the build):

1. **Focus ring** is always `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` (use `focus-within:` with the same values for composite wrappers). Variants may re-tint; the width stays `ring-3`. Never `ring-2`, never `ring-offset`.
2. **Disabled** uses `disabled:cursor-not-allowed disabled:opacity-50`; **invalid** uses `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 …` — the ring width is mandatory (a colour with no width renders nothing).
3. **Semantic tokens only** — `bg-primary`, `text-muted-foreground`, `bg-success/10`, `var(--chart-1..5)`, etc. Never raw hex or named Tailwind palette colours for component chrome.
4. **`className` merging** through `cn(...)` from `../utils/index` (clsx + tailwind-merge). Never string-concatenate or template-literal class names.
5. **`data-slot`** on the root (kebab-cased component name) and on each named sub-part (`data-slot="card-header"`).
6. **`"use client"`** as the first line iff the component uses hooks/state/refs/handlers or a client-only primitive. When unsure, keep it.
7. **Prop typing** via `React.ComponentProps<"x">` (or the primitive's exported props / `useRender.ComponentProps`), not the legacy `HTMLAttributes` families.
8. **Form-control baseline** — form controls match `Input`: `h-8` and `rounded-lg` on the outer box.
9. **Size scale** — a `size` axis exposes a contiguous subset of `xs · sm · default · lg · xl`, in that order. Never rename `default` to `md`. Documented `full` (overlay width) and `icon`/`icon-*` (Button) extensions are allowed.
10. **Variant axis naming** — the semantic axis is named `variant` (or `status` / `shape` for genuinely different concepts), never `intent`.
11. **Boolean props** are unprefixed and positively phrased — no `is*` / `has*` prefix (`loading`, not `isLoading`), no negative `hide*` polarity (`showIcon`, not `hideIcon`).
12. **Named `*Props` export** — every component exports a named `*Props` type (provider/render-prop-only components excepted).
13. **Polymorphism via `render`** — components that change element use Base UI's `render` prop, never Radix-style `asChild`.

Some rules (§9–§13 in the contract) currently grandfather pre-existing violators in the `EXEMPT` map in `check-conventions.mjs`; the rules fail only on **new** drift, and each grandfather set shrinks to empty as components are migrated. Add an exemption only when a rule genuinely doesn't apply — never to silence a real fix.

---

## 6. Local setup

```bash
bun install        # install all workspace dependencies; also installs lefthook hooks
bun run storybook  # Storybook reference site at http://localhost:6006
```

Component work happens in `packages/ui/src/components`. Each component has a colocated `*.stories.tsx` (its reference + docs) and `*.test.tsx`.

Lefthook is mandatory and installs automatically on `bun install` via the root `prepare` script. To (re)install manually:

```bash
bunx lefthook install
```

---

## 7. Validation commands

Run before pushing:

```bash
bun run verify   # biome + contract checks + docs gates + build + typecheck + unit tests + build-storybook
```

`verify` is the full gate (mirrors CI). Its parts, runnable individually:

```bash
bun run check               # Biome lint + format (writes fixes)
bun run check:conventions   # component contract enforcement
bun run check:docs          # TSDoc coverage
bun run check:docs:drift    # generated-artifact drift (regenerate with `bun run docs:generate`)
bun run check:changeset     # changeset summaries start with a Conventional Commits type
bun run typecheck           # turbo run typecheck
bun run test                # Vitest + Testing Library unit tests
bun run build               # bunchee build of @strait/ui
bun run build-storybook     # Storybook static build
```

When you add or change component behaviour, also run the story interaction tests:

```bash
bun run test:stories   # Storybook interaction tests in headless Chromium
```

Lefthook hook groups (`lefthook.yml`):
- `pre-commit` (parallel): Biome over the **staged** JS/TS/CSS/JSON files (fails closed — fix with `bunx biome check --write`).
- `commit-msg`: commitlint (Conventional Commits).

CI (`.github/workflows/ci.yml`) runs the full `verify` set plus story interaction tests, an axe a11y scan (light + dark), and zizmor (Actions security). `pr-checks.yml` lints the PR title and requires a changeset (or the `skip-changeset` label). Chromatic visual regression runs when configured.

**Never bypass hooks** with `--no-verify` or similar. Fix the underlying failure instead.

---

## 8. Planning protocol and implementation workflow (mandatory)

Canonical workflow for any non-trivial change. Follow this whenever you plan or implement work, and **always** when entering plan mode.

### 8.1 Before creating a plan

1. Understand the request and constraints.
2. Read the relevant docs (§1, §5) and the nearest component(s) — especially `button.tsx` as the contract gold standard.
3. Identify every unresolved question that could affect the public API (prop names, variant/size vocab, component boundaries) or theming tokens.
4. **Ask all unresolved questions and wait for answers before drafting the plan.** Never proceed on assumptions.

### 8.2 Plan shape

Every plan must be:
- **Detailed and complete**: covers the full implementation end to end, not just the first slice.
- **Separated into phases**: each phase is a coherent, independently verifiable unit of work.
- **Presented inline in the conversation**: never write plan files unless the user explicitly asks for one.

For every phase, specify: goal, files to change or create, stories/tests to add or update, and validation commands.

### 8.3 Per-phase execution loop

Once the plan is approved, execute each phase in order. For every phase:

1. Implement the phase exactly as planned.
2. Run the relevant validation suite (at minimum `bun run check:conventions`, `bun run typecheck`, and `bun run test`; add `bun run test:stories` when behaviour changes, and `bun run verify` before the final push).
3. If a check fails:
   - Fix small, local issues immediately and re-run until green.
   - **If the failure requires significantly more work than the phase contemplated** (token-architecture change, cross-cutting API rename, new dependency), stop, report, and wait for direction. Do not push through.
4. Once **all** checks pass, commit the phase with a Conventional Commit message (§10). Add a changeset (`bun run changeset`) when the change is user-facing. Never use `--no-verify`.
5. Proceed to the next phase **without asking permission**. Implement the entire plan to completion in one go.

### 8.4 Plan adherence

- Always follow the plan as agreed. If reality forces a deviation, stop, explain, and wait for confirmation.
- Never silently expand scope mid-phase.
- Never skip validation or commit gates.
- Stories and tests live in the same phase as the behaviour change, never deferred.
- Regenerate `llms`/`components.json` (`bun run docs:generate`) and add a changeset in the same phase that introduces a user-facing change.

---

## 9. Engineering rules (non-negotiable)

1. **Follow the component contract** (§5). It is the law; `button.tsx` is the reference.
2. **Semantic tokens only.** Components reference token-backed utilities, never raw colours. New visual needs get a token in `globals.css`, not a hardcoded value.
3. **Theming stays single-source.** Derive from existing tokens (`--brand` drives the brand triad + chart-1 + sidebar) rather than duplicating literals. Keep `:root`, `.dark`, and the `@theme inline` map in sync.
4. **Accessibility is load-bearing.** Preserve focus rings, `aria-*` wiring, and labelling; icon-only controls require an `aria-label`. The axe scan and WCAG AA contrast are gates, not suggestions.
5. **Composition over configuration.** Forward `className`, expose `data-slot` sub-parts, and use Base UI's `render` prop for polymorphism.
6. **Tree-shakeability.** One component per subpath export; don't introduce cross-component import chains that defeat per-component bundling. Heavy deps are surfaced by `check:heavy` — keep them isolated to the components that need them.
7. **Tests and stories.** Every component has a colocated story (with a `Playground` and variant/size/state stories) and meaningful tests — assert behaviour, not just "renders".
8. **No emojis** in code, comments, logs, docs, commits, or PR text. (The release-notes pipeline uses category emojis in generated GitHub Releases — that is the one generated exception, not something you author.)
9. **Comments** explain invariants, accessibility/theming boundaries, and non-obvious tradeoffs. Do not leave phase/plan history, AI/tool attribution, or comments that restate the next line.
10. **Backward compatibility.** Prop renames and removed variants are breaking changes on a published package — treat them as such (major changeset, migration note) and don't make them casually.

---

## 10. Commits, changesets, and PRs

### Conventional Commits (mandatory)

Format: `type(scope): summary`

Allowed types: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `revert`, `style`. Lowercase type, imperative summary, scope when it helps.

Examples:
- `feat(ui): add brand-accent token for legible soft/outline variants`
- `fix(button): keep focus ring at ring-3 in the brand-outline variant`
- `test(sidebar): cover active-row rail rendering`

`commitlint` runs on every commit (lefthook `commit-msg`) and PR titles are checked in CI (`pr-checks.yml`). Non-conforming subjects fail.

### Changesets (release notes)

`@strait/ui` releases are driven by [Changesets](https://github.com/changesets/changesets) (see `RELEASING.md`). Every user-facing PR needs a changeset:

```bash
bun run changeset   # pick patch/minor/major for @strait/ui, write a one-line summary
```

- **patch** = fixes; **minor** = new backwards-compatible components/props; **major** = breaking changes.
- **Start the summary with a Conventional Commits type** (`feat:`, `fix:`, `perf:`, `refactor:`, `docs:`, …). The `check:changeset` gate enforces this, and the prefix buckets the entry in the categorized GitHub Release notes.
- Releaseless PRs (docs-only, CI, repo chores) may skip it with the **`skip-changeset`** label.

Never hand-edit `CHANGELOG.md` or the version in `package.json` — Changesets owns both via the automated "Version Packages" PR.

### Forbidden in commit messages and PR text

**Never** add:
- `Co-Authored-By` lines
- "Generated with Claude Code" or any AI / tool attribution
- Vague messages (`update`, `misc`, `fix stuff`)

### PR descriptions

Substantive, not boilerplate. Include:
- **Summary**: what the PR does in plain language
- **Why**: context and motivation
- **What changed**: grouped by area
- **Validation**: exact commands run and their outcomes
- **Stories / tests added or updated** and why
- **Docs / token / changeset impact** (or an explicit "none")
- **Risks and follow-ups**

Never claim validation without listing the commands. Never paste generic boilerplate. Never add AI attribution footers.

### Releases (reference)

Merging to `main` opens/updates a Changesets **"Version Packages"** PR; merging that PR runs `changeset publish`, which publishes `@strait/ui` to npm via **OIDC trusted publishing** (no stored token) with provenance, pushes the tag, and publishes a categorized GitHub Release. Full details and one-time setup are in `RELEASING.md`.

---

## 11. DOs and DON'Ts

### Do
- Confirm assumptions when requirements are ambiguous.
- Follow the component contract and existing component patterns (copy `button.tsx`).
- Keep changes small, focused, and reversible.
- Add stories and tests for new behaviour, and regression tests for bug fixes.
- Maintain backward compatibility unless the user requests breakage; treat prop/variant renames as breaking.
- Regenerate `llms`/`components.json`, update docs, and add a changeset when the public surface changes.

### Don't
- Guess prop names, variant vocabularies, or component boundaries.
- Refactor unrelated components in the same PR.
- Ship components without stories and tests.
- Bypass failing tests, lint, hooks, or the contract checker.
- Use raw colours, `ring-2`, `asChild`, or `is*`/`hide*` boolean props.
- Hand-edit generated artifacts (`llms*`, `components.json`, `CHANGELOG.md`, `package.json` version).
- Add AI attribution anywhere.

---

## 12. Definition of done

A change is done only when:

1. `bun run check:conventions` passes (the contract holds).
2. `bun run typecheck` and `bun run test` pass; `bun run test:stories` passes when behaviour changed.
3. Biome is clean (`bun run check`).
4. Generated artifacts are in sync (`bun run docs:generate`, `bun run check:docs:drift`), and TSDoc coverage passes (`bun run check:docs`).
5. A changeset is present for user-facing changes (or `skip-changeset` is justified).
6. Stories and tests cover the new/changed behaviour.
7. A summary is provided: what changed, why, and how it was validated.

Running `bun run verify` green is the single best proxy for "done".

---

When in doubt, prefer established project patterns over novelty (copy `button.tsx`), ask clarifying questions early, and keep changes explicit and verifiable.
