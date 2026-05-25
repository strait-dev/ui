---
"@strait/ui": patch
---

fix: render DropdownMenu and ContextMenu labels outside a group without crashing

Base UI's `MenuGroupLabel` throws when it is not wrapped in a `Menu.Group`.
`DropdownMenuLabel` and `ContextMenuLabel` now detect whether they are inside
a group and self-wrap in one when used standalone.
