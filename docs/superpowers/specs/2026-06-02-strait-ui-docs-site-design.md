# Strait UI Documentation Site — Design

Date: 2026-06-02
Status: Approved (design); implementation plan to follow

## Purpose

Build a public, shadcn-style documentation website for `@strait/ui` that lists
every component with live previews, copyable code, and auto-generated props
tables. The site becomes the public face of the design system; Storybook is
retired from public duty and kept internal for Chromatic, interaction, and a11y
testing.

## Locked decisions

- **Public site / Storybook split**: the new docs site is the public reference.
  Storybook still builds in CI for Chromatic + interaction + a11y tests, but its
  public GitHub Pages deploy is retired.
- **Stack**: Next.js (App Router) + Fumadocs + Fumadocs MDX — the same stack as
  shadcn/ui's docs.
- **Hosting**: Vercel, via Git integration, with per-PR preview deploys.
- **Content**: props/variants tables are auto-generated (zero drift); demos are
  hand-authored as real `.tsx` files with Preview/Code tabs and copy buttons.
- **Scope**: full site infrastructure plus a curated page for all 124 components.
- **Demo bootstrapping**: scaffold an initial live demo per component seeded from
  its primary Storybook story, then curate in batches.
- **Extras in scope**: interactive theming/token explorer; copy-for-LLM /
  `llms.txt` surfacing; blocks/templates gallery; cmd+K command-palette search.

## Architecture

A new **private** workspace `apps/docs` (sibling to `apps/storybook`), so the
published `@strait/ui` package is unaffected.

- Next.js App Router + Fumadocs + Fumadocs MDX, TypeScript, ESM.
- Consumes `@strait/ui` via `workspace:*` and imports `@strait/ui/css` so docs
  render components with the real design tokens. Tailwind v4 wired through Next's
  PostCSS, reusing the `globals.css` token source — no duplicated theme values.
- Dark mode via `next-themes` (already in the repo for Sonner), driving the
  existing `.dark` token set.
- Code highlighting via Shiki (already a repo dependency; Fumadocs uses it).
- Search via Fumadocs' built-in Orama index, augmented with a cmd+K palette
  (cmdk, already shipped) for jumping to components.
- Turborepo: add `dev`/`build` tasks for `apps/docs`. Vercel builds via Git
  integration (build filtered to `@strait/docs`).

## Content model (per component page)

`content/docs/components/<name>.mdx`:

- Frontmatter (title, description, category) seeded from `components.json`.
- Live demos via `<ComponentPreview name="button/sizes" />` — renders a real demo
  file in a theme-aware canvas with Preview/Code tabs, Shiki-highlighted source,
  and a copy button.
- Import/usage snippet (`@strait/ui/components/<name>`).
- `<PropsTable name="Button" />` — auto-generated from TSDoc / `components.json`,
  so prop and variant docs never drift.
- Accessibility notes where relevant.
- Per-component "copy for AI" affordance linking the component's `llms` content.

Demos live as real React files in `apps/docs/demos/<name>/*.tsx` importing from
`@strait/ui`; they are type-checked on build, so a broken demo fails CI.

## Generation pipeline

Extend the existing `ts-morph` pipeline (`scripts/generate-llms.ts`) rather than
hand-building everything:

1. A generator emits `apps/docs/.generated/props.json` (per-component
   props/variants), consumed by `<PropsTable>`. Wired into `bun run docs:generate`
   and the drift gate so it can never go stale.
2. A scaffolder creates a compile-ready MDX page + a seed demo `.tsx` for each
   component, deriving the first demo from that component's primary Storybook
   story. Output is a real, rendering page on day one.
3. Curate — polish demos, add variant/size/state examples — in batches by
   category (Forms, Overlays, Data display, Navigation, etc.).
4. A coverage gate: every component in `components.json` must have a page, or CI
   fails.

## Site pages beyond components

- Introduction, Installation, Theming (port `packages/ui/src/docs/*.mdx`), Dark
  mode, Changelog (sourced from `CHANGELOG.md`).
- Interactive theming/token explorer (single-token rebrand + dark mode preview).
- Blocks/templates gallery (composed multi-component patterns).
- Sidebar grouped by the categories already present in `components.json`.

## Phasing (high level)

1. Workspace + Next/Fumadocs scaffold, Tailwind/token wiring, theming, deploy to
   Vercel (skeleton live). Validates Tailwind v4 token sharing early.
2. Generation pipeline: `props.json` generator + drift gate + `<PropsTable>` +
   `<ComponentPreview>` + scaffolder.
3. Narrative pages (intro/install/theming/dark mode/changelog) + theming/token
   explorer.
4. Generate all 124 component pages from stories (every page compiles + renders).
5. Curate demos in category batches (largest phase; parallelizable).
6. Extras (blocks gallery, cmd+K palette, copy-for-LLM), search polish, retire
   public Storybook deploy, final `verify` + docs drift gates.

## Risks / call-outs

- Tailwind v4 token sharing between the package CSS and the Next app is the main
  technical risk — validated in Phase 1.
- Phase 5 is large (124 curated demos); story-seeding makes every page real
  immediately, and curation can be batched / parallelized.
- Vercel monorepo build config and (optional) custom domain need one-time setup
  from the maintainer.

## Out of scope

- A shadcn-style CLI (`npx strait add ...`) — `@strait/ui` is an installed npm
  package, not copy-paste source. Not built here.
- Removing Storybook entirely — it stays for testing.
