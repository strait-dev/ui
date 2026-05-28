---
"@strait/ui": patch
---

feat: add DateSelector date-filter component

A compact date filter that selects by day, month, quarter, half-year, or
year, with `is` / `before` / `after` / `between` operators. The day view reuses
`Calendar`; coarser periods render their own grids. Locks the operator with
`presetMode`, restricts granularities with `periodTypes`, and localises every
label through a partial `i18n` override.
