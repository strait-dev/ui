# Design System Consistency Audit — `@strait/ui`

**Date:** 2026-05-30
**Scope:** All 124 components in `packages/ui/src/components` + `globals.css`.
**Method:** Three parallel source-verified audits (spacing/height, color/token,
typography/border/ring/shadow + radius re-verify). Findings below were checked
against source, not grep counts alone.

This audit followed the radius unification (`rounded-lg` outer boxes). The
**radius system re-verified clean** — no stray `xl`/`2xl`/`3xl`, every
`rounded-full` is a genuinely circular control, arbitrary radii justified — so
radius is omitted from the findings except for the floating-surface stragglers in
§Medium.

Status key: ✅ fixed in the accompanying PR · ⏳ deferred (see notes).

---

## High

### H1 — Focus-ring violations slipping past the linter ✅
Contract §1 mandates `focus-visible:border-ring focus-visible:ring-3
focus-visible:ring-ring/50`. The `focusRing` lint rule only matched
`focus-visible:ring-2` and `ring-offset`, so these forms slipped through:

- `resizable.tsx` — `focus-visible:ring-1` (half-width ring, no `border-ring`).
- `tree.tsx` — `ring-2` applied via `data-[focus-visible]:` and an
  `isFocusVisible &&` string (the `data-` attribute form the regex didn't see).
- `date-range-picker.tsx`, `date-range-picker-with-presets.tsx` — the retired
  `ring-offset-2` + `focus-within:` pattern instead of the `ring-3` standard.

**Fix:** align all to the `ring-3` treatment, **and broaden the `focusRing` lint
rule** to catch `ring-1`/`ring-N` and the `data-[focus-visible]:ring-*` form so
this can't regress.

### H2 — `warning` intent opacity diverges from every other intent (button.tsx) ✅
Every intent family uses `/10` resting soft fill, `/15` hover, `/30` outline
border, `/40` solid-focus border, `/30` focus ring. `warning` alone used `/15`
soft, `/25` hover, `/40` outline border, `/50` solid-focus border, `/40` ring —
making warning buttons visibly heavier than siblings. (badge/empty already use
the correct `/10`, so it was button-specific.)

**Fix:** normalize warning to the shared opacity steps.

### H3 — `lg` form-control height breaks the scale ✅
`select.tsx` and `native-select.tsx` use `h-10` at `size="lg"`; input,
autocomplete, the number-input family, input-otp, and phone-input all use `h-9`.
A `<Select size="lg">` rendered 4px taller than a sibling `<Input size="lg">`.

**Fix:** `h-10` → `h-9` (+ JSDoc tables).

### H4 — Multiselect default height above the form baseline ✅
`multiselect.tsx` default `min-h-10` (40px) vs the `h-8` (32px) form-control
baseline; an empty multiselect sat taller than its row.

**Fix:** default → `min-h-8` (grows with chips as before).

### H5 — Off-scale font sizes ⏳ (partial)
Arbitrary font sizes bypass the type scale: `text-[0.8rem]` (button sm, toggle
sm, calendar), `text-[0.7rem]` (toggle xs, tooltip sm), `text-[0.6rem]` /
`text-[0.625rem]` (badge xs/sm), `text-[10px]` (kbd sm, a sidebar kbd).

**Fix (this PR):** round the near-12px values (`0.7rem`/`0.8rem`) to the
`text-xs` scale step in button, toggle, tooltip, calendar.
**Deferred:** the true-micro sizes (≤10px: badge xs/sm, kbd) are a genuine tier
with no token. Rounding them to 12px is a visible ~25% size change to badges, so
they're left as-is pending a decision on adding a `--text-micro` token vs.
accepting the enlargement.

---

## Medium

### M1 — `badge.tsx` `dark:bg-input/32` typo ✅
Every other `dark:bg-input/*` in the codebase is `/30`; this lone `/32` is a
typo. → `/30`.

### M2 — Floating surfaces still `rounded-md` (radius stragglers) ✅
The radius unification missed several floating outer surfaces:
`preview-card.tsx`, `range-calendar-with-presets.tsx`, `date-range-picker.tsx`
shell, the `sidebar.tsx` menu flyout, and `input-with-inline-button.tsx` wrapper
use `rounded-md` where peer surfaces use `rounded-lg`. → `rounded-lg` on the
outer box.

### M3 — `multiselect` dropdown missing the standard surface frame ✅
Every popped surface uses `shadow-md` + `ring-1 ring-foreground/10`; the
multiselect dropdown used `shadow-lg` and no ring. → add the ring, drop to
`shadow-md`.

### M4 — `BannerTitle` weight diverges ✅
`banner.tsx` title is `font-semibold`; every other title role (dialog, card,
sheet, drawer, alert-dialog) is `font-medium`. → `font-medium`.

### M5 — `PopoverTitle` missing an explicit text size ✅
Comparable titles set `text-base`; `PopoverTitle` only sets `font-medium`, so it
inherits body size and loses hierarchy. → add `text-base`.

### M6 — Overlay scrim token gap ⏳
`dialog`/`alert-dialog`/`sheet`/`drawer` overlays use `bg-black/10` with no
dark-mode bump and no token. The contract permits `bg-black/N` for scrims, so
this is not a violation, but `/10` is faint on dark and unthemeable.
**Deferred:** introduce a `--overlay` token in a focused follow-up rather than
hardcode a `dark:` bump here.

---

## Low (deferred — token debt, documented for later)

- `globals.css` landing-page utilities hardcode shadows/colors
  (`.hover-lift`, `.gradient-border-subtle`, `.section-muted`) instead of tokens.
- `code-block.tsx` forced-dark surface (`bg-neutral-950`) has no token (linter
  exempt) — could become a `--surface-terminal` token.
- Badge intent coverage gap: no `brand-light`/`brand-outline` (uses `primary`),
  and `*-outline` badges use a generic `border-border` vs button's intent-tinted
  border.
- Spacing micro-divergences: `Alert` `px-2.5` vs `Banner` `px-3`; `FieldGroup`
  `gap-5` vs `FieldSet` `gap-4`; `popover`/`hover-card` `p-2.5` default;
  `select-with-search` `max-h-[300px]` vs the `max-h-72` used by command/phone.
- `chart` tooltip uses `ring-border/60` vs the standard `ring-foreground/10`.

---

## Verified consistent (coverage)

- **Radius system** (re-verified): outer boxes `rounded-lg`, circular controls
  `rounded-full`, inner elements `rounded-md`/`sm`, only badge `pill` uses `4xl`.
- **Token symmetry:** `:root` and `.dark` define the same 50 tokens; all mapped
  in `@theme inline`; `--radius` correctly `:root`-only.
- **`-foreground` vs `-accent`:** used correctly everywhere (no solid-fill text
  using `-accent`, no tint text using `-foreground`).
- **Menu destructive styling** identical across dropdown/context/menubar.
- **No raw hex/rgb** in real component chrome (code-block exempt; chart/qr
  references are selectors/docs, not chrome).
- **Card/Button/Toggle size ladders** clean and contiguous.
- Dialog/AlertDialog body padding, menu item padding scales, Card padding scale —
  all consistent.

---

## Enforcement changes shipped with this audit

`scripts/check-conventions.mjs`:
- **`focusRing`** broadened to flag any `focus-visible:ring-N` other than `ring-3`
  and the `data-[focus-visible]:ring-*` attribute form — closing the gap that let
  H1 through.
- **`intentOpacity`** (new) — flags `bg-warning/*` etc. that deviate from the
  shared per-intent opacity steps, so H2-class drift can't recur. (Conservative;
  grandfathers any remaining intentional exceptions with justification.)
