# Component Contract

The canonical set of conventions every `@strait/ui` component must follow. The
**gold standard** is [`packages/ui/src/components/button.tsx`](../packages/ui/src/components/button.tsx) —
when in doubt, copy what Button does.

These rules are enforced automatically by
[`scripts/check-conventions.mjs`](../scripts/check-conventions.mjs) (run `bun run check:conventions`),
which runs as part of `bun run verify` and in CI. Drift fails the build.

---

## Why a contract?

A design system is only as trustworthy as its consistency. Small divergences —
a `ring-2` here, a raw `bg-emerald-500` there, a missing `data-slot` — accumulate
into a library that *looks* uniform in the catalog but behaves subtly differently
per component (broken dark mode, inconsistent focus affordance, un-themeable
chrome, RSC hydration bugs). The contract makes the gold-standard explicit and
machine-checkable so every component is held to the same bar.

---

## The rules

### 1. Focus ring

The visible keyboard-focus affordance is **always**:

```
focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
```

- Never `focus-visible:ring-2` — the ring width is `ring-3`.
- Never `focus-visible:ring-offset-*` for component chrome — no offset ring.
- Never a bare `outline` as the visible ring (keep `outline-none`/`outline-hidden`
  as the *reset*, then add the ring).
- A variant may **re-tint** the ring (e.g. Button's `brand-solid` adds
  `focus-visible:border-brand/40 focus-visible:ring-brand/30`), but the base width
  stays `ring-3`.
- `ring-[3px]` is allowed **only** inside arbitrary-variant strings where the
  `ring-3` utility can't be expressed (e.g. `[&_x]:ring-[3px]`).

✅ `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`
❌ `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

For composite containers that focus a wrapper when an inner control is focused,
use `focus-within:` with the **same values**:
`focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50`.

---

### 2. Disabled

```
disabled:cursor-not-allowed disabled:opacity-50
```

On interactive elements that are **not** native `<button>`/`<input>` (e.g. a
`<div role="...">` or a Base UI primitive rendered as a span), also add
`disabled:pointer-events-none` (or the `data-[disabled=true]:` equivalent the
primitive exposes).

✅ `disabled:cursor-not-allowed disabled:opacity-50`
❌ `disabled:opacity-40` / omitting the cursor

---

### 3. Invalid (`aria-invalid`)

```
aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40
```

The `aria-invalid:ring-3` **width is mandatory** — a destructive ring color
without a width renders nothing. Container components that wrap a control mirror
this with a `has-[...]` selector (see `input-group.tsx`):

```
has-[[data-slot][aria-invalid=true]]:border-destructive
has-[[data-slot][aria-invalid=true]]:ring-3
has-[[data-slot][aria-invalid=true]]:ring-destructive/20
dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40
```

✅ `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20`
❌ `aria-invalid:ring-destructive/20` (no width — invisible)

---

### 4. Colors — semantic tokens only

Use the design tokens, never raw Tailwind palette colors for component chrome.

| Need | Use | Not |
| --- | --- | --- |
| Surface | `bg-background`, `bg-card`, `bg-muted`, `bg-surface-raised`, `bg-surface-subtle`, `bg-surface-terminal` | `bg-white`, `bg-zinc-50`, `bg-neutral-950` |
| Danger | `bg-destructive`, `text-destructive-accent`, `text-destructive-foreground` | `bg-red-500`, `text-red-600` |
| Success | `bg-success`, `text-success-accent`, `text-success-foreground` | `bg-emerald-500`, `text-emerald-600` |
| Warning | `bg-warning`, `text-warning-accent`, `text-warning-foreground` | `bg-amber-500`, `bg-orange-500` |
| Info | `bg-info`, `text-info-accent`, `text-info-foreground` | `bg-blue-500` |

Banned in component source: `*-{red,orange,amber,yellow,lime,green,emerald,teal,cyan,sky,blue,indigo,violet,purple,fuchsia,pink,rose,slate,gray,zinc,neutral,stone}-{50…950}`,
plus `bg-white`/`text-white`/`bg-black` for chrome.

The `-foreground` token is the on-color text for a solid fill; the `-accent`
token is the readable colored text on a neutral/tinted surface. Overlay scrims
use `bg-overlay`; terminal/code surfaces use `bg-surface-terminal` and
`text-surface-terminal-foreground`.

✅ `bg-destructive text-destructive-foreground`
❌ `bg-red-500 text-white`

---

### 5. Motion and overlay tokens

Transitions target only the properties that visually change. Avoid
`transition-all`; use utilities such as `transition-colors`,
`transition-opacity`, `transition-transform`, or an explicit arbitrary property
list (`transition-[width,background-color]`).

Overlay scrims use the themeable `--overlay` token via `bg-overlay`, never a
hard-coded `bg-black/*` value. This lets the scrim deepen in dark mode and stay
rebrandable.

Durations come from the motion ladder (DESIGN.md §7) — `--duration-instant`
(100ms) · `--duration-fast` (150ms) · `--duration-base` (250ms) ·
`--duration-slow` (400ms) · `--duration-deliberate` (600ms) — consumed as
`duration-(--duration-*)`. Raw `duration-200` / `duration-[0.35s]` values are
banned. Exits run one duration step faster than their enter (e.g.
`duration-(--duration-base) data-closed:duration-(--duration-fast)`).

✅ `bg-overlay transition-opacity duration-(--duration-fast)`
❌ `bg-black/10 transition-all duration-200`

### 6. `className` merging via `cn()`

Every component accepts a `className` prop and merges it with `cn(...)` from
`../utils/index` (clsx + tailwind-merge). Never string-concatenate or
template-literal class names — that breaks Tailwind conflict resolution.

✅ `className={cn("flex w-full gap-2", className)}`
❌ `` className={`flex w-full gap-2 ${className || ""}`} ``

---

### 7. `data-slot`

The root element carries `data-slot="<kebab-name>"`, and each named sub-part
carries its own (`data-slot="card-header"`, `data-slot="navigation-rail-item"`).
This is the stable hook for cross-component CSS targeting (`has-[...]`,
`group-has-data-...`) and for tests.

✅ `<div data-slot="navigation-rail" ...>`
❌ a root element with no `data-slot`

---

### 8. `"use client"`

Present **iff** the file uses hooks/state/refs/event handlers, or renders an
interactive client-only primitive that needs it. A server-safe presentational
component (pure markup, no hooks) must **not** carry the directive.

- Interactive signals: `useState`/`useEffect`/`useRef`/`useCallback`/`useMemo`/
  `useContext`/`useReducer`/`useId`, `onClick=`/`onChange=`/`onKeyDown=`, or a
  wrapped client primitive.
- When unsure whether a wrapped primitive is server-safe, **keep** the directive:
  a needless `"use client"` is harmless; a missing one is a hydration bug.

✅ first line `"use client";` on `field.tsx` (uses `useMemo`)
❌ `"use client";` on a pure `<table>` wrapper with no hooks

---

### 9. Prop typing

Type props with `React.ComponentProps<"x">` (or the primitive's exported
`.Props` / `useRender.ComponentProps<...>`), not the legacy `HTMLAttributes`
families. `ComponentProps` includes `ref` and `key` correctly. Always spread
`{...props}` onto the root.

✅ `function Input({ className, ...props }: React.ComponentProps<"input">)`
❌ `React.InputHTMLAttributes<HTMLInputElement>` / `React.HTMLAttributes<HTMLDivElement>`

---

### 10. Form-control height & radius

Form controls match the `Input` baseline: **`h-8`** and **`rounded-lg`** on their
outer box. The broader radius rule applies to all non-circular component outer
boxes:

- **Non-circular outer boxes** use `rounded-lg`. This is the canonical corner
  radius for all interactive and container components (buttons, selects, cards,
  dialogs, toggles, badges, command palettes, etc.).
- **`rounded-xl`**, **`rounded-2xl`**, **`rounded-3xl`**, **`rounded-4xl`** are
  retired from all component chrome. They must not appear on outer boxes.
- **`rounded-full`** is reserved for genuinely circular controls: switch thumbs,
  radio buttons, sliders, progress tracks, dot indicators, avatars, and Badge's
  opt-in `pill` radius value.
- **Inner / nested elements** (`rounded-md`, `rounded-sm`) stay as-is — this
  rule governs only the component's outer box.

Don't introduce `h-9`/`rounded-md` for new form controls.

✅ `h-8 rounded-lg` on a select / number-input / button outer box
✅ `rounded-full` on a switch thumb or avatar
✅ `<Badge radius="pill">` for a full-pill opt-in
❌ `rounded-xl` on any component outer box
❌ `rounded-full` as the default on a rectangular button
❌ `h-9 rounded-md` on a new form control

---

### 11. Size scale

Components with a `size` axis expose a **contiguous subset** of the canonical
scale, always written in this order:

```
xs · sm · default · lg · xl
```

- `default` is the unmarked middle step — never rename it to `md`.
- Don't reorder (`default | sm | xs` ❌) or invent steps outside the scale.
- Two documented, namespaced extensions are allowed where a primitive truly
  needs them:
  - **Overlay width** (`Dialog`, `Alert Dialog`) may add `full`.
  - **Square/icon controls** (`Button`) may add the `icon` / `icon-{step}`
    family — a *shape* modifier that rides alongside size.

✅ `size: sm | default | lg`
❌ `size: default | sm | xs | xl` (out of order) / `size: md` (renamed default)

---

### 12. Variant axis naming

The semantic axis a component varies on is named **`variant`** — not `intent`.
A flattened colour×fill enum (Button's `brand-solid | brand | brand-outline | …`)
is acceptable and is the gold standard; the rule is about the *axis name*, not
the shape of its values.

When an axis encodes a genuinely different concept, name it for that concept
rather than overloading `variant`/`intent`:

- **Presence/status** (Avatar's `online | busy | away | offline`) → `status`.
- **Shape** (`circle | rounded | square`) → `shape`.

✅ `variant: "brand-solid"` · `status: "online"`
❌ `intent: "brand"` · `intent: "online"`

---

### 13. Boolean prop naming

Boolean props are **unprefixed and positively phrased**.

- No `is*` / `has*` prefix: `loading`, not `isLoading`; `active`, not `isActive`;
  `required`, not `isRequired`.
- Positive polarity (default `false` means "off"): `showIcon`, not `hideIcon`;
  `showGridLines`, not `hideGridLines`. A `hide*` prop forces double-negatives
  (`hideIcon={false}`) on consumers.

The rule applies to boolean declarations in component files (public props and
internal flags alike) so the vocabulary stays uniform.

✅ `loading?: boolean` · `showIcon?: boolean`
❌ `isLoading?: boolean` · `hideIcon?: boolean`

---

### 14. Named props type

Every component exports a named `*Props` type/interface (e.g. `ButtonProps`) so
consumers can import and extend it. Exempt: provider re-exports and pure
render-prop components that declare no props of their own (`direction`,
`checkbox-tree`).

✅ `export interface ButtonProps extends ...`
❌ props typed inline with no exported alias

---

### 15. Polymorphism via `render`

Components that can render as a different element use Base UI's `render` prop,
never Radix-style `asChild`.

✅ `<DialogTrigger render={<Button />} />`
❌ `<DialogTrigger asChild><Button /></DialogTrigger>`

---

### 16. Font sizes — the type scale only

No arbitrary `text-[…]` sizes. The type scale (`text-display` … `text-caption`,
plus Tailwind's standard steps) covers every tier; `text-micro` (10px) is the
only sanctioned sub-caption size, used for dense chrome like badge `xs`/`sm`
and `kbd`.

✅ `text-xs`, `text-micro`
❌ `text-[0.6875rem]`, `text-[11px]`

---

### 17. Shadows — tokens only

Elevation uses the tokenized `shadow-sm` / `shadow-md` / `shadow-lg` steps
(DESIGN.md §6). Arbitrary shadow values may not embed raw colors — a
token-colored hairline like `shadow-[0_0_0_1px_var(--sidebar-border)]` is
legal, a literal `rgb()`/`oklch()`/hex color is not. In dark mode, elevation is
primarily the `--surface-raised` step plus the `ring-1 ring-foreground/10`
hairline; the deepened shadow is the secondary cue.

✅ `shadow-md ring-1 ring-foreground/10` on a floating surface
✅ `shadow-[0_2px_0_var(--border)]` for a pinned-column hairline
❌ `shadow-[0_1px_2px_rgb(0_0_0/0.4)]`

---

### 18. Control-height ladder

Every interactive control's `size` axis sits on the shared ladder
(DESIGN.md §4): `xs` = `h-6`, `sm` = `h-7`, `default` = `h-8`, `lg` = `h-9`,
`xl` = `h-10`. The machine check inspects the control files' size-variant
definitions and `data-[size=…]:h-*` utilities; inner elements are
unconstrained.

✅ `lg: "h-9 px-4"` / `data-[size=lg]:h-9`
❌ `lg: "h-10 …"` (the old select drift)

---

### 19. Layering — z-index tokens

Every stacking context takes a layer token via `z-(--z-*)`
(DESIGN.md §8): `--z-sticky` (100) · `--z-overlay` (500) · `--z-modal` (510) ·
`--z-popover` (600) · `--z-toast` (700) · `--z-tooltip` (800). Raw `z-30` /
`z-40` / `z-50` and arbitrary `z-[N]` are banned. `z-10` / `z-20` remain legal
for local overlap inside a component's own stacking context (pinned cells,
inset icons), which the ladder does not govern.

✅ `z-(--z-popover)` on a dropdown positioner
❌ `z-50` on a tooltip

---

## Enforcement

| Rule | Check id in `check-conventions.mjs` |
| --- | --- |
| Raw colors (§4) | `rawColor` |
| Motion and overlay tokens (§5) | `transitionAll`, `overlayToken`, `motionToken` |
| Font sizes (§16) | `fontSize` |
| Shadows (§17) | `shadowToken` |
| Control-height ladder (§18) | `controlHeight` |
| Layering (§19) | `zIndexToken` |
| Focus ring (§1) | `focusRing` |
| Invalid ring width (§3) | `ariaInvalid` |
| `cn()` usage (§6) | `cn` |
| `"use client"` (§8) | `useClient` |
| `data-slot` (§7) | `dataSlot` |
| Prop typing (§9) | `propTyping` |
| Outer-box radius (§10) | `radius` |
| Variant axis name (§12) | `intentAxis` |
| Boolean naming (§13) | `boolNaming` |
| Named props type (§14) | `namedProps` |
| Polymorphism (§15) | `asChild` |

Rules §11–§15 were added during the API-consistency convergence
(`docs/api-consistency-audit.md`). The pre-existing violators are grandfathered
in the `EXEMPT` map so the rules fail only on **new** drift; each grandfather set
shrinks to empty as components are migrated. (§11 size scale is documented but
not yet machine-checked — it needs cva-axis value parsing, tracked for a later
slice.)

Exemptions live in the `EXEMPT` map in the script, each with a one-line
justification. Add an exemption only when a rule genuinely doesn't apply (e.g.
`direction.tsx` is a context re-export with no DOM, so `dataSlot`/`cn` don't
apply) — never to silence a real fix.
