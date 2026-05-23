# Strait

The Strait design system — a Bun + Turborepo monorepo.

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
| `bun run clean`           | Remove build artifacts and `node_modules`.|

## Stories

Component stories are colocated with their components in
`packages/ui/src/components/*.stories.tsx`. Storybook globs them automatically.
