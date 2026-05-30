---
"@strait/ui": minor
---

feat!: normalize boolean prop names (unprefixed + positive polarity)

Public boolean props are renamed to drop `is*`/`has*` prefixes and to use
positive `show*` polarity instead of `hide*`, completing the API-consistency
audit and satisfying contract §12. This is a **breaking change** for the
affected components.

Renames:

- `isRequired` → `required` (DatePicker)
- `isLoading` → `loading` (DataGrid, SelectWithSearch)
- `isActive` → `active` (NavigationRail, Pagination, Sidebar menu buttons)
- `isDragging` → `dragging` (FileUpload dropzone)
- `hasMore` → `moreAvailable`, `isFetchingMore` → `fetchingMore` (DataGrid)
- `isFetchingNextPage` → `fetchingNextPage` (SelectWithSearch)
- `hasSubMenu` → `subMenu` (Sidebar)
- render-callback args: `isChecked` → `checked` (CheckboxTree `renderNode`),
  `isSelected` → `selected` (SelectWithSearch `renderOption`)

Inverted `hide*` → `show*` (default flips to `true`; behavior preserved):

- Chart: `hideGridLines`/`hideXAxis`/`hideYAxis`/`hideLabel`/`hideIndicator`/
  `hideIcon` → `showGridLines`/`showXAxis`/`showYAxis`/`showLabel`/
  `showIndicator`/`showIcon`
- Multiselect: `hideClearAllButton` → `showClearAllButton`,
  `hidePlaceholderWhenSelected` → `showPlaceholderWhenSelected`
- Sidebar: `hideOnCollapse` → `showOnCollapse`

Migration: rename the prop at call sites. For the inverted `hide*` → `show*`
props, omit the prop to keep the previous default, or pass `show…={false}` to
reproduce the old hidden state.
