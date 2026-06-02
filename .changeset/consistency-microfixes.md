---
"@strait/ui": patch
---

fix: honor the compact size on MultipleSelector and align Menubar indicators

- `MultipleSelector` with `size="sm"` now renders the documented compact control (`min-h-7`, matching Input's small height). Previously both size branches resolved to the same `min-h-8`, so `sm` had no effect.
- Menubar checkbox/radio indicator slots drop a redundant explicit `size-4` on the wrapper span, matching the DropdownMenu/ContextMenu markup; icon sizing is unchanged (handled by the item-level rule).
