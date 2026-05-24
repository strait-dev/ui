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
| Surface | `bg-background`, `bg-card`, `bg-muted` | `bg-white`, `bg-zinc-50` |
| Danger | `bg-destructive`, `text-destructive-accent`, `text-destructive-foreground` | `bg-red-500`, `text-red-600` |
| Success | `bg-success`, `text-success-accent`, `text-success-foreground` | `bg-emerald-500`, `text-emerald-600` |
| Warning | `bg-warning`, `text-warning-accent`, `text-warning-foreground` | `bg-amber-500`, `bg-orange-500` |
| Info | `bg-info`, `text-info-accent`, `text-info-foreground` | `bg-blue-500` |

Banned in component source: `*-{red,orange,amber,yellow,lime,green,emerald,teal,cyan,sky,blue,indigo,violet,purple,fuchsia,pink,rose,slate,gray,zinc,neutral,stone}-{50…950}`,
plus `bg-white`/`text-white`/`bg-black` for chrome.

The `-foreground` token is the on-color text for a solid fill; the `-accent`
token is the readable colored text on a neutral/tinted surface. (`bg-black/40`
for an overlay scrim is acceptable — it's not chrome — but prefer a token where
one exists.)

✅ `bg-destructive text-destructive-foreground`
❌ `bg-red-500 text-white`

---

### 5. `className` merging via `cn()`

Every component accepts a `className` prop and merges it with `cn(...)` from
`../utils/index` (clsx + tailwind-merge). Never string-concatenate or
template-literal class names — that breaks Tailwind conflict resolution.

✅ `className={cn("flex w-full gap-2", className)}`
❌ `` className={`flex w-full gap-2 ${className || ""}`} ``

---

### 6. `data-slot`

The root element carries `data-slot="<kebab-name>"`, and each named sub-part
carries its own (`data-slot="card-header"`, `data-slot="navigation-rail-item"`).
This is the stable hook for cross-component CSS targeting (`has-[...]`,
`group-has-data-...`) and for tests.

✅ `<div data-slot="navigation-rail" ...>`
❌ a root element with no `data-slot`

---

### 7. `"use client"`

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

### 8. Prop typing

Type props with `React.ComponentProps<"x">` (or the primitive's exported
`.Props` / `useRender.ComponentProps<...>`), not the legacy `HTMLAttributes`
families. `ComponentProps` includes `ref` and `key` correctly. Always spread
`{...props}` onto the root.

✅ `function Input({ className, ...props }: React.ComponentProps<"input">)`
❌ `React.InputHTMLAttributes<HTMLInputElement>` / `React.HTMLAttributes<HTMLDivElement>`

---

### 9. Form-control height & radius

Form controls match the `Input` baseline: **`h-8`** and **`rounded-lg`**. (Inner
elements may use `rounded-md`/`rounded-sm`; this rule is about the control's outer
box.) Don't introduce `h-9`/`rounded-md` for new form controls.

✅ `h-8 rounded-lg` on a select / number-input container
❌ `h-9 rounded-md`

---

## Enforcement

| Rule | Check id in `check-conventions.mjs` |
| --- | --- |
| Raw colors (§4) | `rawColor` |
| Focus ring (§1) | `focusRing` |
| Invalid ring width (§3) | `ariaInvalid` |
| `cn()` usage (§5) | `cn` |
| `"use client"` (§7) | `useClient` |
| `data-slot` (§6) | `dataSlot` |
| Prop typing (§8) | `propTyping` |

Exemptions live in the `EXEMPT` map in the script, each with a one-line
justification. Add an exemption only when a rule genuinely doesn't apply (e.g.
`direction.tsx` is a context re-export with no DOM, so `dataSlot`/`cn` don't
apply) — never to silence a real fix.
