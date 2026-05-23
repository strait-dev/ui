# Strait

The Strait design system — a Bun + Turborepo monorepo.

📖 **Live docs:** [strait-dev.github.io/ui](https://strait-dev.github.io/ui/) — the
Storybook site, published from `main` (see [Documentation site](#documentation-site)).

## Packages

| Path                | Name                | Description                                     |
| ------------------- | ------------------- | ----------------------------------------------- |
| `packages/ui`       | `@strait/ui`        | React component library (Tailwind v4, Base UI). |
| `packages/config`   | `@strait/config`    | Shared TypeScript configs.                      |
| `apps/storybook`    | `@strait/storybook` | Storybook 10 host for browsing components.      |

## Getting started

```bash
bun install        # install all workspace dependencies
bun run storybook  # start Storybook at http://localhost:6006
```

## Scripts (run from the repo root)

| Script                    | What it does                              |
| ------------------------- | ----------------------------------------- |
| `bun run storybook`       | Start Storybook in dev mode.              |
| `bun run build-storybook` | Build the static Storybook site.          |
| `bun run typecheck`       | Type-check every package (via `tsgo`).    |
| `bun run lint`            | Lint with Biome.                          |
| `bun run format`          | Format with Biome.                        |
| `bun run chromatic`       | Publish Storybook to Chromatic (visual).  |
| `bun run clean`           | Remove build artifacts and `node_modules`.|

## Stories

Component stories are colocated with their components in
`packages/ui/src/components/*.stories.tsx`. Storybook globs them automatically.

## Testing

Three layers, all run in CI:

| Layer           | Command                                      | What it covers                                        |
| --------------- | -------------------------------------------- | ----------------------------------------------------- |
| **Unit**        | `bun run --filter @strait/ui test`           | Components in jsdom via Vitest + Testing Library.     |
| **Interaction** | `bun run --filter @strait/storybook test-storybook` | Every story rendered in headless Chromium; `play` functions asserted. |
| **Visual**      | `bun run chromatic`                          | Visual regression snapshots via Chromatic.            |

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

The job builds Storybook and deploys it with the official Pages actions; the live
URL appears on the workflow's `github-pages` environment after the first run.
