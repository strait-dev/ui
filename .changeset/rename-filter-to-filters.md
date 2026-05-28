---
"@strait/ui": patch
---

feat!: rename Filter to Filters, align with ReUI

The `Filter` component is renamed to `Filters` and moves from
`@strait/ui/components/filter` to `@strait/ui/components/filters`. The public
API is aligned with ReUI: `Filters` now accepts `showSearchInput` (default
`true`) to toggle the search box at the top of the field picker.

**Breaking:** update imports from `@strait/ui/components/filter` to
`@strait/ui/components/filters`.
