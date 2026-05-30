---
"@strait/ui": patch
---

fix: resolve design-system consistency issues across components

Audit-driven consistency pass:

- **Focus rings** now follow the contract everywhere — `resizable`, `tree`,
  `input-with-inner-tags`, and the date-range pickers had divergent
  `ring-1`/`ring-2`/`ring-offset` focus treatments; all normalized to the
  standard `ring-3` ring. The convention linter was broadened to catch these.
- **Warning intent** opacity on `Button` now matches the other intents (it had
  heavier soft/outline/focus tints).
- **Form-control heights**: `Select`/`NativeSelect` `lg` size is `h-9` (was
  `h-10`); `Multiselect` default min-height is `h-8` (was `h-10`) — all aligned
  to the form-control baseline.
- **Radius**: floating surfaces that were still `rounded-md` (`preview-card`,
  range-calendar-with-presets, the date-range-picker popovers, the sidebar
  flyout, `input-with-inline-button`) now use the unified `rounded-lg`.
- **Typography**: near-12px arbitrary font sizes in `Button`/`Toggle`/`Tooltip`/
  `Calendar` map to the `text-xs` scale step.
- Smaller fixes: `Badge` outline `dark:bg-input/30` (was `/32`), `Multiselect`
  dropdown gains the standard surface ring, `Banner` title weight and `Popover`
  title size align with sibling components.
