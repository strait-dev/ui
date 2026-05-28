---
"@strait/ui": patch
---

feat!: replace DataTable with DataGrid (TanStack + virtual + DnD)

`DataTable` is removed and replaced by `DataGrid`, a richer ReUI-aligned API
built on TanStack Table v8, `@tanstack/react-virtual`, and `@dnd-kit/*`. The
new component exposes a context root (`DataGrid`), composable parts
(`DataGridContainer`, `DataGridTable`, `DataGridPagination`,
`DataGridColumnHeader`, `DataGridColumnFilter`, `DataGridColumnVisibility`,
`DataGridScrollArea`), virtualised + infinite-scroll variants
(`DataGridTableVirtual`), and drag-and-drop variants for columns
(`DataGridTableDnd`) and rows (`DataGridTableDndRows`,
`DataGridTableDndRowHandle`), plus row selection, row pinning, column
pinning/resizing, footer aggregates, and skeleton/spinner loading states.

**Breaking:** the `./components/data-table` subpath export is removed in
favour of `./components/data-grid`. Consumers must migrate to the new API
(see Storybook for a per-variant reference).
