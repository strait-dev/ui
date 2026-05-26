---
"@strait/ui": major
---

feat(ui)!: rework Sidebar into a full app-shell primitive

`Sidebar` is reshaped to power any modern app shell. The active row now
owns its own visual (2 px left accent rail + soft `--sidebar-active*`
fill + `aria-current="page"`), sub-menus animate open and closed via
Base UI `Collapsible`, hover-popovers (Base UI `Menu`) mirror the
sub-menu when the sidebar is collapsed to icon width, and polished
compound parts ship for the most common app-shell needs:
`SidebarUserButton`, `SidebarSwitcher` / `SidebarSwitcherItem`,
`SidebarCard` (+ `Header` / `Title` / `Description` / `Content` /
`Footer`), and `SidebarSearchButton` with a built-in ⌘K shortcut.

A new `collapsible="rail"` mode renders a narrow icon column
(`SidebarRail` + `SidebarRailButton`) alongside a wider secondary
`SidebarPanel`, animated by `activeRailItem` on the provider. Menus
opt into drag-to-reorder by passing `reorderable` + `items` +
`onReorder`; pair each item with `SidebarMenuDragHandle`.

The collapse animation moves from `ease-linear` to `ease-out` (with
`motion-reduce:transition-none`), `SidebarInput` becomes transparent
so it sits cleanly on the sidebar surface, and truncated labels now
surface their full text via the existing tooltip path. The provider
context gains `openSubmenus` / `toggleSubmenu` / `setSubmenuOpen` /
`isSubmenuOpen` plus `activeRailItem` / `setActiveRailItem`.

Storybook ships 21 showcase stories, including `Collapse_Rail`,
`DisclosureSubMenu`, `SubMenuFlyout`, `Reorderable`, `WithSwitcher`,
`WithUserButton`, `WithCard`, and the flagship `RealWorldDashboard`.

**Breaking changes**

- `SidebarMenuSub` now requires a `value: string` prop; pair it with
  its parent `SidebarMenuItem`'s `value`.
- The old `SidebarRail` (drag handle) has been renamed
  `SidebarToggleRail`. `SidebarRail` now refers to the always-visible
  icon column used by `collapsible="rail"`.
- `Sidebar.collapsible` gains a new value: `"rail"`.

**Migration**

```diff
- <SidebarMenuItem>
+ <SidebarMenuItem value="settings">
    <SidebarMenuButton>Settings</SidebarMenuButton>
-   <SidebarMenuSub>…</SidebarMenuSub>
+   <SidebarMenuSub value="settings">…</SidebarMenuSub>
  </SidebarMenuItem>

- <SidebarRail />
+ <SidebarToggleRail />
```
