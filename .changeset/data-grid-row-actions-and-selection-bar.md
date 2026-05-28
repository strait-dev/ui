---
"@strait/ui": patch
---

feat(ui): add DataGridTableRowActions and DataGridSelectionBar

Two additive helpers for `DataGrid`:

- `DataGridTableRowActions<TData>` — drop-in cell helper that renders an
  ellipsis trigger and a `DropdownMenu` shell; consumers supply
  `DropdownMenuItem` children (Edit / Delete / …) for per-row commands.
- `DataGridSelectionBar` — selection-aware floating toolbar that reads the
  selected row count from `DataGrid` context and renders a fixed-position
  `BulkActionBar` whenever one or more rows are selected. The clear (×)
  button calls `table.resetRowSelection()` automatically.

Both compose cleanly with the existing parts and require no new runtime
dependencies.
