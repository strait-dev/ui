import { expectTypeOf } from "expect-type";

import type {
  SidebarGroupProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuProps,
  SidebarMenuSubProps,
  SidebarPanelProps,
  SidebarProps,
  SidebarRailButtonProps,
  SidebarSearchButtonProps,
  SidebarSwitcherItemProps,
  SidebarSwitcherProps,
  SidebarUserButtonProps,
} from "./sidebar";

/**
 * Type-level contract tests for the Sidebar surface.
 *
 * Checked by `tsgo`; excluded from the Vitest runtime suite (`*.test.{ts,tsx}`).
 */

// --- `Sidebar.collapsible` union now includes "rail" -----------------------
expectTypeOf<"rail">().toExtend<NonNullable<SidebarProps["collapsible"]>>();
expectTypeOf<"icon">().toExtend<NonNullable<SidebarProps["collapsible"]>>();
expectTypeOf<"offcanvas">().toExtend<
  NonNullable<SidebarProps["collapsible"]>
>();
expectTypeOf<"none">().toExtend<NonNullable<SidebarProps["collapsible"]>>();
expectTypeOf<"made-up">().not.toExtend<
  NonNullable<SidebarProps["collapsible"]>
>();

// --- SidebarGroup gains collapsible / pinned / defaultOpen -----------------
expectTypeOf<SidebarGroupProps>().toHaveProperty("collapsible");
expectTypeOf<SidebarGroupProps>().toHaveProperty("pinned");
expectTypeOf<SidebarGroupProps>().toHaveProperty("defaultOpen");
expectTypeOf<NonNullable<SidebarGroupProps["pinned"]>>().toEqualTypeOf<boolean>();

// --- SidebarMenuButton gains hasSubMenu ------------------------------------
expectTypeOf<SidebarMenuButtonProps>().toHaveProperty("hasSubMenu");

// --- SidebarMenuItem has the value persistence key -------------------------
expectTypeOf<SidebarMenuItemProps>().toHaveProperty("value");

// --- SidebarMenuSub requires `value: string` -------------------------------
expectTypeOf<SidebarMenuSubProps>().toHaveProperty("value");
expectTypeOf<SidebarMenuSubProps["value"]>().toEqualTypeOf<string>();

// --- SidebarMenu reorderable surface ---------------------------------------
expectTypeOf<SidebarMenuProps>().toHaveProperty("reorderable");
expectTypeOf<SidebarMenuProps>().toHaveProperty("items");
expectTypeOf<SidebarMenuProps>().toHaveProperty("onReorder");
expectTypeOf<NonNullable<SidebarMenuProps["onReorder"]>>().toEqualTypeOf<
  (items: string[]) => void
>();

// --- SidebarSearchButton.onTrigger -----------------------------------------
expectTypeOf<NonNullable<SidebarSearchButtonProps["onTrigger"]>>().toEqualTypeOf<
  () => void
>();

// --- Rail-mode parts -------------------------------------------------------
expectTypeOf<SidebarRailButtonProps>().toHaveProperty("value");
expectTypeOf<SidebarRailButtonProps["value"]>().toEqualTypeOf<string>();
expectTypeOf<SidebarRailButtonProps>().toHaveProperty("icon");
expectTypeOf<SidebarPanelProps>().toHaveProperty("value");
expectTypeOf<SidebarPanelProps["value"]>().toEqualTypeOf<string>();

// --- Switcher contract -----------------------------------------------------
expectTypeOf<SidebarSwitcherProps>().toHaveProperty("current");
expectTypeOf<SidebarSwitcherItemProps>().toHaveProperty("name");
expectTypeOf<SidebarSwitcherItemProps["name"]>().toEqualTypeOf<string>();
expectTypeOf<SidebarSwitcherItemProps>().toHaveProperty("selected");

// --- User-button contract --------------------------------------------------
expectTypeOf<SidebarUserButtonProps>().toHaveProperty("name");
expectTypeOf<SidebarUserButtonProps["name"]>().toEqualTypeOf<string>();
expectTypeOf<SidebarUserButtonProps>().toHaveProperty("email");
expectTypeOf<SidebarUserButtonProps>().toHaveProperty("menu");
expectTypeOf<SidebarUserButtonProps>().toHaveProperty("static");
