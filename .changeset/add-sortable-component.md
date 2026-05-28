---
"@strait/ui": patch
---

feat: add Sortable drag-to-reorder component

Adds `Sortable`, `SortableItem`, and `SortableItemHandle`, built on dnd-kit, for
reorderable vertical lists, horizontal rows, and grids. The list is controlled
via `value` / `getItemValue` / `onValueChange`, drags start from a handle, and a
floating overlay mirrors the active item. Restyled to Strait design tokens.
