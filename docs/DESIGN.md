# Strait UI — Design Foundations v2.0

Normative token specification for `@strait/ui`. This document is the source of
truth for `packages/ui/src/globals.css`. Companion visual spec: `Strait UI
Foundations.dc.html`. Supersedes the values audited in
`docs/design-system-consistency-audit.md` (2026-05-30); every deferred item from
that audit is resolved here.

**Summary of changes vs. v1**

- Inter → **Instrument Sans** everywhere (JetBrains Mono kept for code)
- Buttons move from `font-normal` (400) to **`font-semibold` (600)**
- Warning intent normalized to the shared opacity steps
- One control-height ladder for every interactive component (`lg` = `h-9` everywhere)
- New token groups: **shadows, motion, z-index layers, icon sizes**
- Dark-mode elevation rule formalized (surface step + hairline ring)
- Brand orange kept exactly: `oklch(0.6696 0.222 37.42)`

---

## 1. Typography

### Families

```css
--font-sans: "Instrument Sans", system-ui, sans-serif;
--font-heading: var(--font-sans);
--font-mono: "JetBrains Mono", monospace;
```

App imports:

```ts
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/jetbrains-mono";
```

### Scale

Each size bundles line-height, tracking, and weight (Tailwind v4 modifier
syntax). Semantic classes `.display`, `.heading-1..4`, `.body`, `.body-sm`,
`.caption` wrap these.

| Token | Size | Line-height | Tracking | Weight |
|---|---|---|---|---|
| `--text-display` | 3rem (48) | 1.1 | −0.02em | 700 |
| `--text-h1` | 2.25rem (36) | 1.15 | −0.02em | 600 |
| `--text-h2` | 1.875rem (30) | 1.2 | −0.015em | 600 |
| `--text-h3` | 1.5rem (24) | 1.25 | −0.01em | 600 |
| `--text-h4` | 1.25rem (20) | 1.3 | −0.01em | 600 |
| `--text-body` | 1rem (16) | 1.6 | — | 400 |
| `--text-body-sm` | 0.875rem (14) | 1.55 | — | 400 |
| `--text-caption` | 0.75rem (12) | 1.5 | — | 400 |
| `--text-micro` | 0.625rem (10) | 1 | — | — |

### Weights

| Weight | Used for |
|---|---|
| 400 Regular | body copy, inputs |
| 500 Medium | titles, badges, labels |
| 600 Semibold | **buttons**, headings h1–h4, kickers |
| 700 Bold | display only |

### Rules

- **No arbitrary `text-[…]` sizes.** `--text-micro` is the only sanctioned
  sub-caption tier (badge xs/sm, kbd). Enforced by the `fontSize` lint rule.
- Controls are never lighter than 500; buttons are 600
  (`buttonVariants` base: `font-semibold text-sm`).
- The interface default is `text-sm` (14px); `text-base` (16px) is for
  long-form reading surfaces.

---

## 2. Color tokens

Warm-stone neutrals + orange accent, all `oklch`. All tokens are defined
symmetrically in `:root` and `.dark` (`@custom-variant dark (&:is(.dark *))`).

### Rules

- No raw hex/rgb in component chrome (code-block’s forced-dark surface uses
  `--surface-terminal`).
- `-foreground` = text on a solid fill. `-accent` = legible text/border on
  soft (`/10`) and outline tints. Never mix the two roles.
- `--brand` is the single rebrand input; `--brand-accent` derives via
  relative color syntax.

### Surfaces

| Token | Light | Dark |
|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.182 0.004 49.25)` |
| `--foreground` | `oklch(0.216 0.006 56.043)` | `oklch(0.985 0.001 106.423)` |
| `--card` / `--popover` | `oklch(1 0 0)` | `oklch(0.216 0.006 56.043)` |
| `--card-foreground` / `--popover-foreground` | `oklch(0.216 0.006 56.043)` | `oklch(0.985 0.001 106.423)` |
| `--muted` / `--accent` | `oklch(0.97 0.001 106.424)` | `oklch(0.268 0.007 34.298)` |
| `--muted-foreground` | `oklch(0.5 0.013 58.071)` | `oklch(0.709 0.01 56.259)` |
| `--border` | `oklch(0.923 0.003 48.717)` | `oklch(1 0 0 / 10%)` |
| `--input` | `oklch(0.923 0.003 48.717)` | `oklch(1 0 0 / 15%)` |
| `--ring` | `oklch(0.553 0.013 58.071)` | `oklch(0.709 0.01 56.259)` |
| `--overlay` | `oklch(0 0 0 / 0.1)` | `oklch(0 0 0 / 0.4)` |
| `--surface-subtle` | `oklch(0.985 0.001 106.423)` | `oklch(0.268 0.007 34.298)` |
| `--surface-raised` | `oklch(1 0 0)` | `oklch(0.216 0.006 56.043)` |
| `--surface-terminal` | `oklch(0.216 0.006 56.043)` | `oklch(0.182 0.004 49.25)` |
| `--surface-terminal-foreground` | `oklch(0.985 0.001 106.423)` | `oklch(0.985 0.001 106.423)` |

### Brand

| Token | Light | Dark |
|---|---|---|
| `--brand` | `oklch(0.6696 0.222 37.42)` | same — kept exactly |
| `--brand-foreground` | `oklch(0.985 0.001 106.423)` | same (documented AA exception on brand-solid) |
| `--brand-accent` | `oklch(from var(--brand) min(l, 0.5) c h)` | `oklch(from var(--brand) max(l, 0.72) c h)` |
| `--primary` | `oklch(0.216 0.006 56.043)` | `oklch(0.97 0.001 106.424)` |
| `--primary-foreground` | `oklch(0.985 0.001 106.423)` | `oklch(0.216 0.006 56.043)` |
| `--secondary` | `oklch(0.97 0.001 106.424)` | `oklch(0.268 0.007 34.298)` |
| `--secondary-foreground` | `oklch(0.216 0.006 56.043)` | `oklch(0.985 0.001 106.423)` |

`--primary` is the warm-ink default-button color; `--brand` is the accent.

### Status intents

| Token | Light | Dark |
|---|---|---|
| `--success` | `oklch(0.535 0.145 150)` | `oklch(0.696 0.16 150)` |
| `--success-accent` | `oklch(0.48 0.13 150)` | `oklch(0.77 0.15 150)` |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |
| `--destructive-accent` | `oklch(0.47 0.2 27.325)` | `oklch(0.77 0.16 22.216)` |
| `--info` | `oklch(0.55 0.18 255)` | `oklch(0.62 0.17 255)` |
| `--info-accent` | `oklch(0.47 0.16 255)` | `oklch(0.75 0.15 255)` |
| `--warning` | `oklch(0.79 0.155 80)` | `oklch(0.79 0.155 80)` |
| `--warning-accent` | `oklch(0.45 0.1 80)` | `oklch(0.82 0.14 85)` |
| `--invert` | `oklch(0.216 0.006 56.043)` | `oklch(0.985 0.001 106.423)` |

Solid-fill foregrounds: light mode uses near-white
`oklch(0.985 0.001 106.423)`; dark mode uses dark ink
`oklch(0.182 0.004 49.25)` on the brighter dark-mode fills. Warning keeps
`oklch(0.3 0.07 80)` text in both modes.

### Chart

| Token | Value |
|---|---|
| `--chart-1` | `var(--brand)` |
| `--chart-2` | `oklch(0.769 0.188 70.08)` |
| `--chart-3` | `oklch(0.553 0.013 58.071)` (dark: `oklch(0.709 0.01 56.259)`) |
| `--chart-4` | `oklch(0.7 0.18 145)` |
| `--chart-5` | `oklch(0.55 0.2 260)` |

### Sidebar

Sidebar tokens mirror the surface set (`--sidebar` = surface-subtle,
`--sidebar-border` = border, …). Active row derives from brand:

```css
--sidebar-active: color-mix(in oklch, var(--brand) 12%, var(--background)); /* dark: 22% */
--sidebar-active-rail: var(--brand);
--sidebar-active-foreground: var(--foreground);
```

---

## 3. Intent & emphasis system

Six intent families — `brand`, `success`, `warning`, `destructive`, `info`,
`invert` — each in exactly three weights: `*-solid` (filled), bare name
(soft tint), `*-outline` (bordered). Shared opacity steps, no per-intent
exceptions (warning is normalized — was /15 soft, /25 hover, /40 outline):

| Layer | Light | Dark |
|---|---|---|
| Soft resting fill | `bg-intent/10` | `bg-intent/15` |
| Soft hover fill | `bg-intent/15` | `bg-intent/25` |
| Solid hover fill | `bg-intent/90` | `bg-intent/90` |
| Outline border | `border-intent/30` | `border-intent/30` |
| Focus border | `border-intent/40` | `border-intent/40` |
| Focus ring — solid | `ring-intent/30` | `ring-intent/30` |
| Focus ring — soft/outline | `ring-intent/20` | `ring-intent/20` |

Text color: solid uses `text-intent-foreground`; soft and outline use
`text-intent-accent`.

Enforced by the `intentOpacity` lint rule in
`scripts/check-conventions.mjs`.

---

## 4. Size & spacing

### Control-height ladder

One ladder for **every** interactive control (button, input, select,
native-select, autocomplete, number-input family, input-otp, phone-input,
multiselect):

| Size | Height | Padding-x | Text | Icon |
|---|---|---|---|---|
| `xs` | `h-6` (24) | `px-2.5` | `text-xs` | `size-3` |
| `sm` | `h-7` (28) | `px-3` | `text-xs` | `size-3.5` |
| `default` | `h-8` (32) | `px-3` | `text-sm` | `size-4` |
| `lg` | `h-9` (36) | `px-4` | `text-sm` | `size-4` |
| `xl` | `h-10` (40) | `px-5` | `text-sm` | `size-4` |

- `lg` is `h-9` everywhere (selects were `h-10` — fixed).
- Multiselect rests at `min-h-8`, grows with chips.
- Icon-only buttons use square `icon*` sizes (`size-6` … `size-10`).
- Enforced by the `controlHeight` lint rule (flags heights outside h-6/7/8/9/10).

### Inset padding — normalized

| Context | Value |
|---|---|
| Inline chrome (Alert, Banner) | `px-3 py-2.5` |
| Floating surfaces (popover, hover-card) | `p-2.5` |
| Field groups & fieldsets | `gap-4` |
| List max heights (command, select, phone-input) | `max-h-72` |

Resolves the audit micro-divergences: Alert `px-2.5` → `px-3`, FieldGroup
`gap-5` → `gap-4`, select-with-search `max-h-[300px]` → `max-h-72`.

### Spacing scale — 4pt grid

| Step | px | Used for |
|---|---|---|
| 1 | 4 | icon-to-dot gaps |
| 1.5 | 6 | button icon gap |
| 2 | 8 | chip rows, inline clusters |
| 3 | 12 | control padding, dense grids |
| 4 | 16 | field gaps, card grids |
| 6 | 24 | card padding, section gaps |
| 8 | 32 | page-level rhythm |

### Icon sizes (new tokens)

| Token | px | Tailwind | Used for |
|---|---|---|---|
| `--icon-xs` | 12 | `size-3` | badges, xs buttons |
| `--icon-sm` | 14 | `size-3.5` | sm buttons |
| `--icon-md` | 16 | `size-4` | default+ controls, menus |
| `--icon-lg` | 20 | `size-5` | empty states, callouts |

Rule: never size an icon with an arbitrary value — each control’s
`[&_svg]:size-*` selector applies the right token; only override with another
token. Icons are Hugeicons (`IconSvgElement`), never loose SVG components.

---

## 5. Radius

One base, everything derives — a single override retunes every corner:

```css
--radius: 0.625rem; /* 10px */
--radius-sm: calc(var(--radius) * 0.6);  /*  6px */
--radius-md: calc(var(--radius) * 0.8);  /*  8px */
--radius-lg: var(--radius);              /* 10px */
--radius-xl: calc(var(--radius) * 1.4);  /* 14px */
--radius-2xl: calc(var(--radius) * 1.8); /* 18px */
--radius-3xl: calc(var(--radius) * 2.2); /* 22px */
--radius-4xl: calc(var(--radius) * 2.6); /* 26px */
```

Rules:

- **Outer boxes are `rounded-lg`** — including every floating surface
  (popover, dropdown, preview-card, calendar shells; no `rounded-md`
  stragglers).
- Inner elements: `rounded-md` / `rounded-sm`.
- Circular controls: `rounded-full` (genuinely circular only).
- `rounded-4xl` pill is a badge-only opt-in (`radius="pill"`).

---

## 6. Focus, elevation & surfaces

### Focus ring — the only legal form

```
focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20
```

Intent variants swap in intent colors (see §3). No `ring-1`, `ring-2`, or
`ring-offset` anywhere — the broadened `focusRing` lint rule catches every
form, including `data-[focus-visible]:ring-*`.

### Popped-surface frame

Every floating surface — popover, dropdown, hover-card, multiselect list,
chart tooltip — uses the same frame, no exceptions:

```
rounded-lg shadow-md ring-1 ring-foreground/10
```

Modal scrim: `bg-overlay` (tokenized; deepens in dark mode).

### Shadow tokens (new)

```css
--shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);                                  /* cards at rest */
--shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.06), 0 2px 4px -2px oklch(0 0 0 / 0.06); /* floating surfaces */
--shadow-lg: 0 10px 40px -10px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.05); /* hover-lift, modals */
```

Landing utilities (`.hover-lift`, `.section-muted`, …) consume tokens like
everything else — no hardcoded shadows or hue-less grays.

### Dark-mode elevation rule

Shadows barely read on dark surfaces. Elevation is expressed as a **lighter
surface step** — `--surface-raised` over `--background` — plus the standard
`ring-1 ring-foreground/10` hairline. Shadow tokens stay applied (deepened
alpha) but are the secondary cue, never the only one.

---

## 7. Motion (new)

### Durations

| Token | Value | Use for |
|---|---|---|
| `--duration-instant` | 100ms | color & opacity feedback — hover fills, active states |
| `--duration-fast` | 150ms | focus rings, toggles, switches, tooltips |
| `--duration-base` | 250ms | popovers, dropdowns, accordions, hover-lift |
| `--duration-slow` | 400ms | dialogs, sheets, drawers, list-item entrances |
| `--duration-deliberate` | 600ms | scroll reveals, staggered sections, page transitions |

### Easings

| Token | Value | Use for |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | everything entering |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | everything exiting |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | moves & resizes within the screen |

### Rules

- Animate **transform and opacity only**.
- Exits run one duration step faster than enters.
- The global `prefers-reduced-motion` kill-switch stays.
- No raw durations in transitions/animations — `motionToken` lint rule.

---

## 8. Layering (new)

No raw `z-index` in component code — every stacking context takes a token:

| Token | Value | Layer |
|---|---|---|
| `--z-base` | 0 | page content |
| `--z-sticky` | 100 | sticky headers, bulk-action bar |
| `--z-overlay` | 500 | the scrim (`--overlay`) |
| `--z-modal` | 510 | dialogs, sheets, drawers |
| `--z-popover` | 600 | popovers, dropdowns, command |
| `--z-toast` | 700 | sonner toasts, banners |
| `--z-tooltip` | 800 | tooltips — always on top |

- Scrim and modal are an adjacent pair (500/510) so nothing wedges between a
  dialog and its backdrop.
- Popovers sit above modals because they open inside them.
- Toasts beat modals so feedback is never hidden.
- Hundred-steps leave room for app-level layers between tokens.
- Enforced by the `zIndexToken` lint rule (no raw `z-50` / `z-[N]`).

---

## 9. Migration checklist (globals.css diff, in order)

1. **Swap the font & bolden controls** — `body` font-family → Instrument
   Sans; `@fontsource-variable/instrument-sans`; `buttonVariants` base
   `font-normal` → `font-semibold`.
2. **Close the badge intent gap** — add `brand-light` / `brand-outline`
   variants; move all `*-outline` badges from generic `border-border` to
   intent-tinted `border-intent/30`, matching buttons.
3. **Tokenize landing utilities** — `.hover-lift` → `var(--shadow-lg)`;
   `.section-muted` → `var(--surface-subtle)`.
4. **Normalize spacing stragglers** — Alert `px-2.5` → `px-3`; FieldGroup
   `gap-5` → `gap-4`; SelectWithSearch `max-h-[300px]` → `max-h-72`.
5. **Standardize the chart tooltip frame** — `ring-border/60` →
   `ring-foreground/10`.
6. **Extend the lint gate** — new rules: `fontSize`, `shadowToken`,
   `controlHeight`.
7. **Add motion + layer + icon tokens** to `@theme` (see §4, §6, §7, §8).
8. **Consume the new tokens** — sweep hardcoded durations, `z-50`s, and
   shadows; add `zIndexToken` and `motionToken` lint rules.

Run `bun scripts/generate-tokens.ts` after editing so the docs Foundations
pages stay in lockstep, and `bun run verify` for the full gate.
