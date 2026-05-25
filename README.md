# Strait UI

[![npm version](https://img.shields.io/npm/v/@strait/ui?logo=npm&color=cb3837)](https://www.npmjs.com/package/@strait/ui)
[![npm downloads](https://img.shields.io/npm/dm/@strait/ui?color=cb3837)](https://www.npmjs.com/package/@strait/ui)
[![install size](https://packagephobia.com/badge?p=@strait/ui)](https://packagephobia.com/result?p=@strait/ui)
[![license](https://img.shields.io/npm/l/@strait/ui?color=blue)](./LICENSE)
[![CI](https://github.com/strait-dev/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/strait-dev/ui/actions/workflows/ci.yml)
[![published with provenance](https://img.shields.io/badge/provenance-npm-3b82f6?logo=npm)](https://docs.npmjs.com/generating-provenance-statements)

**`@strait/ui`** is Strait's design system — a custom React component library built on
[Tailwind CSS v4](https://tailwindcss.com), [Base UI](https://base-ui.com), and a set of
semantic design tokens. It ships **120+ accessible, composable components** spanning forms,
overlays, data display, navigation, and rich application patterns, all themeable through a
single stylesheet.

The repo is a [Bun](https://bun.sh) + [Turborepo](https://turbo.build) monorepo.

📖 **Live docs:** [strait-dev.github.io/ui](https://strait-dev.github.io/ui/) — the
Storybook site, published from `main` (see [Documentation site](#documentation-site)).

---

## Highlights

- **Custom design language** — GitBook-inspired warm-stone neutrals with an orange accent,
  an `oklch` color system, and a tuned radius/typography scale. Not a stock shadcn theme.
- **Semantic tokens everywhere** — components style themselves with intent tokens
  (`bg-success/10`, `text-destructive-accent`, `var(--chart-1..5)`), so re-theming is a
  tokens-only change and dark mode comes for free.
- **Composable by default** — every component forwards `className`, exposes `data-slot`
  sub-parts for compound pieces, takes data via props, and uses Base UI's polymorphic
  `render` prop where an atom needs to change its element.
- **Per-component entry points** — import only what you use via
  `@strait/ui/components/<name>`; the build emits one tree-shakeable module per component.
- **Typed icons** — icons are [Hugeicons](https://hugeicons.com) (`IconSvgElement`),
  never loose SVG components.
- **Tested three ways** — Vitest unit tests, Storybook interaction tests, and Chromatic
  visual regression.

## Tech stack

| Concern        | Choice                                                              |
| -------------- | ------------------------------------------------------------------ |
| Styling        | Tailwind CSS v4 (`@theme` tokens, `@config`), `tw-animate-css`     |
| Primitives     | Base UI, React Aria Components, Radix-free                         |
| Variants       | `class-variance-authority` + `tailwind-merge` (`cn` helper)        |
| Icons          | `@hugeicons/react` + `@hugeicons/core-free-icons`                  |
| Forms          | `@tanstack/react-form`                                             |
| Tables         | `@tanstack/react-table`                                            |
| Charts         | `recharts`                                                         |
| Toasts         | `sonner` (themed with `next-themes`)                               |
| Dates          | `date-fns`, `react-day-picker`, `@internationalized/date`          |
| Code/Syntax    | `shiki`                                                            |
| Animation      | `motion`                                                           |
| Build          | `bunchee`                                                          |
| Types          | React 19, TypeScript                                               |

---

## Installation

```bash
bun add @strait/ui
# react + react-dom 19 are required peer dependencies
bun add react react-dom
```

### 1. Import the stylesheet once

Import the global stylesheet at the root of your app. It bundles Tailwind v4, the design
tokens, and component keyframes:

```ts
// app entry (e.g. app/layout.tsx, main.tsx)
import "@strait/ui/css";
```

The library is built with the GitBook-inspired Inter + JetBrains Mono pairing. Install the
fonts your design calls for, e.g.:

```ts
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
```

### 2. Enable dark mode

Tokens flip on a `.dark` class on any ancestor (`@custom-variant dark (&:is(.dark *))`).
Toggle it however you like — `next-themes` is the recommended driver:

```tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>;
```

### 3. (Optional) extend the Tailwind config

If your own app uses Tailwind and you want to consume the same tokens, the package exports
its config and PostCSS setup:

```ts
// @strait/ui/tailwind.config  — the shared Tailwind config
// @strait/ui/postcss          — the shared PostCSS config
```

---

## Usage

Each component has its own subpath export. Import only what you need:

```tsx
import { Button } from "@strait/ui/components/button";
import { Card, CardHeader, CardTitle, CardContent } from "@strait/ui/components/card";
import { Badge } from "@strait/ui/components/badge";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployments</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Badge variant="success">Live</Badge>
        <Button size="sm">Open</Button>
      </CardContent>
    </Card>
  );
}
```

The `cn` class-merging helper used internally is also exported:

```ts
import { cn } from "@strait/ui/utils";
```

### Conventions

These patterns hold across the library, so once you learn one component the rest are
predictable:

- **`className` passthrough** — every component merges your classes last (via `cn`), so you
  can always override.
- **`data-slot` sub-parts** — compound components (`Card`, `Dialog`, `Field`, …) expose each
  internal element as a `data-slot="…"` div you can target or restyle.
- **Intents & sizes** — interactive components share an intent vocabulary
  (`success | warning | info | destructive`) and a size scale (`xs | sm | default | lg | xl`)
  where it makes sense.
- **Polymorphism** — atoms that may render as a different element accept Base UI's `render`
  prop (e.g. `<Button render={<a href="…" />}>`), not `asChild`.

---

## Component catalog

120+ components, grouped the same way they appear in Storybook. Import any of them from
`@strait/ui/components/<name>`.

### Actions
`button` · `button-group` · `copy-button` · `kbd` · `toggle` · `toggle-group`

### Data Display
`activity-feed` · `aspect-ratio` · `avatar` · `badge` · `bar-list` · `bulk-action-bar` ·
`card` · `carousel` · `chart` · `charts` · `code-block` · `code-block-command` ·
`config-row` · `data-table` · `description-list` · `execution-trace-bar` · `filter` ·
`item` · `json-viewer` · `leaderboard` · `metric-card` · `qr-code` ·
`radial-gauge` · `relative-time-card` · `status-badge` · `table` · `tag-group` ·
`timeline` · `tracker` · `tree`

### Feedback
`alert` · `banner` · `chart-empty-state` · `empty` · `feature-lock` · `notice-banner` ·
`progress` · `skeleton` · `spinner` · `toast`

### Forms
`calendar` · `checkbox` · `combobox` · `field` · `file-upload` · `form` · `input` ·
`input-group` · `label` · `multiselect` · `native-select` · `radio-group` · `rating` ·
`secret-input` · `select` · `select-native` · `slider` · `switch` · `textarea`

### Layout
`accordion` · `collapsible` · `direction` · `resizable` · `scroll-area` · `separator` ·
`shell`

### Navigation
`breadcrumb` · `command` · `command-menu` · `menubar` · `navigation-menu` ·
`navigation-rail` · `pagination` · `sidebar` · `stepper` · `tabs`

### Overlays
`alert-dialog` · `context-menu` · `detail-sheet` · `dialog` · `drawer` · `dropdown-menu` ·
`hover-card` · `popover` · `sheet` · `tooltip`

### Patterns
Higher-level, opinionated compositions built from the primitives above:

`calendar-rac` · `calendar-with-presets` · `card-checkbox` · `checkbox-tree` · `credenza` ·
`date-input` · `date-picker` · `date-picker-with-month-year` · `date-range-picker` ·
`date-range-picker-with-presets` · `datefield-rac` · `id-cell` · `input-otp` ·
`input-password-with-strength-indicator` · `input-with-addons` ·
`input-with-inline-button` · `input-with-inner-tags` · `input-with-loader` ·
`input-with-show-hide-password` · `input-with-start-icon` ·
`number-input-percentage-with-chevrons` · `number-input-with-buttons` ·
`number-input-with-chevrons` · `password-input` · `phone-input` · `preview-card` ·
`range-calendar-with-presets` · `select-with-search` · `select-with-search-and-button`

### Non-component exports

| Export                      | Purpose                                        |
| --------------------------- | ---------------------------------------------- |
| `@strait/ui/css`            | Global stylesheet (Tailwind v4 + tokens).      |
| `@strait/ui/globals.css`    | Alias of `@strait/ui/css`.                     |
| `@strait/ui/utils`          | The `cn` class-merge helper.                   |
| `@strait/ui/tailwind.config`| Shared Tailwind config.                        |
| `@strait/ui/postcss`        | Shared PostCSS config.                         |

---

## Monorepo packages

| Path                | Name                | Description                                     |
| ------------------- | ------------------- | ----------------------------------------------- |
| `packages/ui`       | `@strait/ui`        | The React component library (this README).      |
| `packages/config`   | `@strait/config`    | Shared TypeScript configs.                      |
| `apps/storybook`    | `@strait/storybook` | Storybook 10 host for browsing components.      |

## Getting started (development)

```bash
bun install        # install all workspace dependencies
bun run storybook  # start Storybook at http://localhost:6006
```

### Scripts (from the repo root)

| Script                    | What it does                              |
| ------------------------- | ----------------------------------------- |
| `bun run storybook`       | Start Storybook in dev mode.              |
| `bun run build-storybook` | Build the static Storybook site.          |
| `bun run build`           | Build every package (`@strait/ui` via bunchee). |
| `bun run typecheck`       | Type-check every package.                 |
| `bun run lint`            | Lint with Biome.                          |
| `bun run format`          | Format with Biome.                        |
| `bun run test`            | Run unit tests across packages.           |
| `bun run chromatic`       | Publish Storybook to Chromatic (visual).  |
| `bun run verify`          | Full gate: Biome + conventions + build + typecheck + test + Storybook. |
| `bun run clean`           | Remove build artifacts and `node_modules`.|

### Working on the library directly

```bash
bun run --filter @strait/ui build       # bundle to dist/ with bunchee
bun run --filter @strait/ui dev         # rebuild on change
bun run --filter @strait/ui typecheck   # tsgo --noEmit
bun run --filter @strait/ui test        # Vitest (jsdom)
```

> The build is driven by the `exports` map in `packages/ui/package.json`: `bunchee` mirrors
> each `./components/<name>` entry to `src/components/<name>.tsx`. When you add a component,
> add its source file **and** an `exports` entry.

---

## Stories

Component stories are colocated with their components in
`packages/ui/src/components/*.stories.tsx`. Storybook globs them automatically. Each story
file sets `title: "Category/Name"`, which is what drives the catalog above.

## Testing

Three layers, all run in CI:

| Layer           | Command                                              | What it covers                                                        |
| --------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| **Unit**        | `bun run --filter @strait/ui test`                  | Components in jsdom via Vitest + Testing Library.                     |
| **Interaction** | `bun run --filter @strait/storybook test-storybook` | Every story rendered in headless Chromium; `play` functions asserted.|
| **Visual**      | `bun run chromatic`                                 | Visual regression snapshots via Chromatic.                           |

### Chromatic visual regression

Visual snapshots run on [Chromatic](https://www.chromatic.com). To enable them:

1. Create a project on Chromatic and copy its **project token**.
2. Add it as a GitHub Actions secret named `CHROMATIC_PROJECT_TOKEN`
   (Settings → Secrets and variables → Actions).
3. Add a repository **variable** `CHROMATIC_ENABLED` set to `true` to switch the
   `Chromatic` workflow on.

Run it locally against your project with
`CHROMATIC_PROJECT_TOKEN=<token> bun run chromatic`.

## Documentation site

Every push to `main` can publish the static Storybook to GitHub Pages via the
`Deploy docs` workflow, serving the live docs at
[strait-dev.github.io/ui](https://strait-dev.github.io/ui/). To turn it on:

1. In **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Add a repository **variable** `PAGES_ENABLED` set to `true` to switch the
   `Deploy docs` workflow on.

The job builds Storybook and deploys it with the official Pages actions; the live URL
appears on the workflow's `github-pages` environment after the first run.

## License

See [LICENSE](./LICENSE).
