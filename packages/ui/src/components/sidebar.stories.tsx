import {
  Home01Icon,
  MoreHorizontalIcon,
  Notification01Icon,
  Search01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Navigation/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A collapsible application sidebar with full keyboard-shortcut support (`⌘B`).",
          "",
          "**Required wrapper**: all sidebar components must be descendants of",
          "`SidebarProvider`, which manages open/collapsed state.",
          "",
          "Key exports:",
          "- `SidebarProvider` — context + keyboard shortcut.",
          "- `Sidebar` — the actual panel; props: `side` (`left`|`right`),",
          "  `variant` (`sidebar`|`floating`|`inset`),",
          "  `collapsible` (`offcanvas`|`icon`|`none`).",
          "- `SidebarTrigger` — toggle button; calls `useSidebar().toggleSidebar()`.",
          "- `SidebarMenuButton` — renderable button with `isActive`, `size`, `variant`, `tooltip`.",
          "- `SidebarGroupLabel` / `SidebarGroupAction` — use a `render` prop (Base UI `useRender`).",
          "",
          "Wrap the story in a fixed-height container to prevent the sidebar from",
          "overflowing the Storybook canvas.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    side: {
      control: "radio",
      options: ["left", "right"],
      description: "Which edge the sidebar sits on.",
      table: { defaultValue: { summary: "left" } },
    },
    variant: {
      control: "select",
      options: ["sidebar", "floating", "inset"],
      description: "Visual style of the sidebar panel.",
      table: { defaultValue: { summary: "sidebar" } },
    },
    collapsible: {
      control: "select",
      options: ["offcanvas", "icon", "none"],
      description: "How the sidebar collapses.",
      table: { defaultValue: { summary: "offcanvas" } },
    },
  },
  args: {
    side: "left",
    variant: "sidebar",
    collapsible: "icon",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const navItems = [
  { icon: Home01Icon, label: "Dashboard", id: "dashboard" },
  { icon: Search01Icon, label: "Search", id: "search" },
  { icon: Notification01Icon, label: "Notifications", id: "notifications" },
  { icon: Settings01Icon, label: "Settings", id: "settings" },
] as const;

/** Interactive playground — click the trigger to collapse/expand. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex h-[600px] w-full overflow-hidden rounded-lg border">
      <SidebarProvider defaultOpen>
        <Sidebar {...args}>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" tooltip="Acme Inc.">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-sm">
                    A
                  </div>
                  <span className="font-semibold">Acme Inc.</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map(({ icon, label, id }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        isActive={id === "dashboard"}
                        tooltip={label}
                      >
                        <HugeiconsIcon icon={icon} />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile">
                  <HugeiconsIcon icon={UserIcon} />
                  <span>John Doe</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="font-medium text-sm">Dashboard</span>
          </header>
          <main className="p-4">
            <p className="text-muted-foreground text-sm">
              Main content area. Use the trigger button to collapse the sidebar.
            </p>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

/** `collapsible="none"` — always visible, no toggle. */
export const NonCollapsible: Story = {
  render: () => (
    <div className="flex h-[400px] w-full overflow-hidden rounded-lg border">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-sm">
                    S
                  </div>
                  <span className="font-semibold">Strait UI</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map(({ icon, label, id }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton isActive={id === "dashboard"}>
                        <HugeiconsIcon icon={icon} />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4">
            <p className="text-muted-foreground text-sm">
              Fixed sidebar — always expanded.
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

/** Sidebar with a search input in the header. */
export const WithSearch: Story = {
  render: () => (
    <div className="flex h-[480px] w-full overflow-hidden rounded-lg border">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarInput placeholder="Search…" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map(({ icon, label, id }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton tooltip={label}>
                        <HugeiconsIcon icon={icon} />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger />
          </header>
          <div className="p-4">
            <p className="text-muted-foreground text-sm">Content area.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

/** Menu item with an action button and a badge. */
export const WithActionsAndBadges: Story = {
  render: () => (
    <div className="flex h-[400px] w-full overflow-hidden rounded-lg border">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <HugeiconsIcon icon={Home01Icon} />
                      <span>Design System</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label="More options" showOnHover>
                      <HugeiconsIcon icon={MoreHorizontalIcon} />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HugeiconsIcon icon={Notification01Icon} />
                      <span>Notifications</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>12</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HugeiconsIcon icon={Settings01Icon} />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4">
            <p className="text-muted-foreground text-sm">Content area.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

/** Sub-menu items nested under a parent item. */
export const WithSubMenu: Story = {
  render: () => (
    <div className="flex h-[480px] w-full overflow-hidden rounded-lg border">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HugeiconsIcon icon={Settings01Icon} />
                      <span>Settings</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive>
                          Profile
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Billing</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Team</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HugeiconsIcon icon={UserIcon} />
                      <span>Account</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4">
            <p className="text-muted-foreground text-sm">Content area.</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};

/** Loading skeleton placeholders while content is fetching. */
export const LoadingSkeleton: Story = {
  render: () => (
    <div className="flex h-[320px] w-full overflow-hidden rounded-lg border">
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Loading…</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Array.from({ length: 5 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list has no stable keys
                    <SidebarMenuItem key={i}>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4">
            <p className="text-muted-foreground text-sm">Content loading…</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};
