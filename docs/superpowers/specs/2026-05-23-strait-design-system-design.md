# Strait Design System — Monorepo & Storybook (Design)

Date: 2026-05-23
Status: Approved

## Goal

Turn the repo into a monorepo whose first deliverable is the `@strait/ui`
component library plus a Storybook to view the components. Scope is limited to
the `ui` package and Storybook; no publishing, CI, or extra apps yet (YAGNI).

## Tooling

- **Bun workspaces + Turborepo** for orchestration (Bun 1.3.14 installed; the
  existing package already assumed `.turbo` + `bun run`).
- **Biome** for lint/format, **tsgo** (`@typescript/native-preview`) for
  typecheck — both already used by the `ui` package.
- **Storybook 10** (`@storybook/react-vite`) + **Vite 8** +
  `@vitejs/plugin-react`.
- **Tailwind v4** in Storybook via `@tailwindcss/vite`; the library keeps its
  existing `@tailwindcss/postcss` setup untouched.
- **Geist** fonts via `@fontsource-variable/geist(-mono)`.

## Layout

```
strait/ (repo root)
├─ apps/
│  └─ storybook/        @strait/storybook — Storybook 10 + Vite host
│     └─ .storybook/{main.ts,preview.tsx}
├─ packages/
│  ├─ ui/               @strait/ui — moved from ui/ (source-consumed, no build)
│  │  └─ src/components/*.stories.tsx   stories colocated with components
│  └─ config/           @strait/config — shared tsconfigs
│     ├─ base.json
│     └─ react-library.json   satisfies ui's `extends ../config/react-library.json`
├─ package.json         root workspaces + turbo scripts
├─ turbo.json
├─ biome.json
├─ tsconfig.json
└─ bunfig.toml
```

## Key decisions

- **`packages/config` is required** because `packages/ui/tsconfig.json` does
  `extends: "../config/react-library.json"`.
- **Stories live in `packages/ui`** next to each component; `apps/storybook`
  globs `../../packages/ui/src/**/*.stories.@(ts|tsx)`. This keeps the library
  free of Storybook runtime deps (only dev types are added).
- **Light/dark** via `@storybook/addon-themes` `withThemeByClassName`, toggling
  `.dark` to match globals.css's `@custom-variant dark`.
- Storybook's `preview` imports `@strait/ui/css` (the existing `globals.css`)
  so all theme tokens/keyframes load; the decorator applies background, text,
  and Geist via the CSS variables already defined there.

## Story coverage (this effort)

Stand the system up end-to-end, then write multi-variant stories for ~10
representative components: button, input, label, card, badge, checkbox, switch,
dialog, tooltip, table (plus avatar/alert if quick). The remaining ~80 are
filled in follow-up passes.

## Verification

`bun install` clean → `bun run typecheck` passes → `bun run storybook` serves
locally with starter stories rendering in both light and dark, Geist applied,
no Tailwind/console errors.
