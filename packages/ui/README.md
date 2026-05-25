# @strait/ui

[![npm version](https://img.shields.io/npm/v/@strait/ui?logo=npm&color=cb3837)](https://www.npmjs.com/package/@strait/ui)
[![npm downloads](https://img.shields.io/npm/dm/@strait/ui?color=cb3837)](https://www.npmjs.com/package/@strait/ui)
[![install size](https://packagephobia.com/badge?p=@strait/ui)](https://packagephobia.com/result?p=@strait/ui)
[![license](https://img.shields.io/npm/l/@strait/ui?color=blue)](https://github.com/strait-dev/ui/blob/main/LICENSE)
[![CI](https://github.com/strait-dev/ui/actions/workflows/ci.yml/badge.svg)](https://github.com/strait-dev/ui/actions/workflows/ci.yml)
[![published with provenance](https://img.shields.io/badge/provenance-npm-3b82f6?logo=npm)](https://docs.npmjs.com/generating-provenance-statements)

Strait's design system — **120+ accessible, composable React components** built on
[Tailwind CSS v4](https://tailwindcss.com) and [Base UI](https://base-ui.com), themeable
through a single stylesheet and shipped as one tree-shakeable module per component.

📖 **Docs & live playground:** [strait-dev.github.io/ui](https://strait-dev.github.io/ui/)
🤖 **For LLMs:** [llms.txt](https://strait-dev.github.io/ui/llms.txt) ·
[llms-full.txt](https://strait-dev.github.io/ui/llms-full.txt)

## Install

```sh
bun add @strait/ui
# react and react-dom 19 are required peer dependencies
bun add react react-dom
```

## Quick start

Import the stylesheet once at the root of your app — it bundles Tailwind v4, the design
tokens, and component keyframes:

```ts
// app entry (e.g. app/layout.tsx, main.tsx)
import "@strait/ui/css";
```

Then import only the components you use. Each has its own subpath export, so your bundle
only ever includes what you import:

```tsx
import { Badge } from "@strait/ui/components/badge";
import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployments</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Badge variant="success">Live</Badge>
        <Button>Open</Button>
      </CardContent>
    </Card>
  );
}
```

## Dark mode

Tokens flip on a `.dark` class on any ancestor
(`@custom-variant dark (&:is(.dark *))`). Toggle it however you like —
[`next-themes`](https://github.com/pacocoursey/next-themes) is the recommended driver:

```tsx
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>;
```

## Tailwind & PostCSS config

To consume the same tokens in your own Tailwind setup, the package exports its config and
PostCSS setup:

```ts
// @strait/ui/tailwind.config  — the shared Tailwind config
// @strait/ui/postcss          — the shared PostCSS config
// @strait/ui/css              — the prebuilt global stylesheet
```

## Highlights

- **Per-component entry points** — `@strait/ui/components/<name>`; nothing you don't import
  ends up in your bundle.
- **Semantic tokens everywhere** — components style themselves with intent tokens
  (`bg-success/10`, `text-destructive-accent`, `var(--chart-1..5)`), so re-theming is a
  tokens-only change and dark mode comes for free.
- **Composable by default** — every component forwards `className`, exposes `data-slot`
  sub-parts, and uses Base UI's polymorphic `render` prop where an element needs to change.
- **Typed end to end** — React 19, TypeScript, and named `Props` types for every component.
- **Published from CI with [provenance](https://docs.npmjs.com/generating-provenance-statements)** via npm trusted publishing.

## Documentation

The full component catalog, props, variants, and live examples live in the Storybook site:
**[strait-dev.github.io/ui](https://strait-dev.github.io/ui/)**.

## License

[MIT](https://github.com/strait-dev/ui/blob/main/LICENSE) © Strait
