import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  Briefcase01Icon,
  ChartLineData02Icon,
  CreditCardIcon,
  File01Icon,
  Folder01Icon,
  HelpCircleIcon,
  Home01Icon,
  InboxIcon,
  Logout01Icon,
  MoreHorizontalIcon,
  Notification01Icon,
  Search01Icon,
  Settings01Icon,
  StarIcon,
  UserGroup02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "./button";
import {
  Sidebar,
  SidebarCard,
  SidebarCardContent,
  SidebarCardDescription,
  SidebarCardFooter,
  SidebarCardHeader,
  SidebarCardTitle,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuDragHandle,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarPanel,
  SidebarProvider,
  SidebarRail,
  SidebarRailButton,
  SidebarSearchButton,
  SidebarSwitcher,
  SidebarSwitcherItem,
  SidebarTrigger,
  SidebarUserButton,
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
          "Wrap every story in `SidebarProvider` and a fixed-height container so",
          "the sidebar does not overflow the Storybook canvas.",
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
      options: ["offcanvas", "icon", "rail", "none"],
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

function Frame({
  children,
  height = 600,
}: {
  children: React.ReactNode;
  height?: number;
}) {
  // `transform-gpu` (translateZ(0)) establishes a containing block for the
  // sidebar's `position: fixed` shell so it sits flush against the Frame's
  // left edge instead of escaping to the viewport.
  return (
    <div
      className="flex w-full transform-gpu overflow-hidden rounded-lg border"
      style={{ height }}
    >
      {children}
    </div>
  );
}

function BasicMenu({ active = "dashboard" }: { active?: string }) {
  return (
    <SidebarMenu>
      {navItems.map(({ icon, label, id }) => (
        <SidebarMenuItem key={id}>
          <SidebarMenuButton isActive={id === active} tooltip={label}>
            <HugeiconsIcon icon={icon} />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function BrandHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-sm">
              A
            </div>
            <span className="font-semibold">Acme Inc.</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

function InsetBody({ label = "Main content" }: { label?: string }) {
  return (
    <SidebarInset>
      <header className="flex h-12 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <span className="font-medium text-sm">{label}</span>
      </header>
      <main className="p-4">
        <p className="text-muted-foreground text-sm">{label}.</p>
      </main>
    </SidebarInset>
  );
}

/** Interactive playground — every arg is wired via Storybook controls. */
export const Playground: Story = {
  render: (args) => (
    <Frame>
      <SidebarProvider defaultOpen>
        <Sidebar {...args}>
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <BasicMenu />
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
        <InsetBody label="Dashboard" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Default `variant="sidebar"` — flush panel with a border. */
export const Variant_Sidebar: Story = {
  render: () => (
    <Frame>
      <SidebarProvider defaultOpen>
        <Sidebar variant="sidebar">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Flush sidebar" />
      </SidebarProvider>
    </Frame>
  ),
};

/** `variant="floating"` — rounded panel with a shadow ring. */
export const Variant_Floating: Story = {
  render: () => (
    <Frame>
      <SidebarProvider defaultOpen>
        <Sidebar variant="floating">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Floating sidebar" />
      </SidebarProvider>
    </Frame>
  ),
};

/** `variant="inset"` — content area nested inside the sidebar colour. */
export const Variant_Inset: Story = {
  render: () => (
    <Frame>
      <SidebarProvider defaultOpen>
        <Sidebar variant="inset">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Inset content" />
      </SidebarProvider>
    </Frame>
  ),
};

/** `side="right"` — the panel anchors to the right edge. */
export const Side_Right: Story = {
  render: () => (
    <Frame>
      <SidebarProvider defaultOpen>
        <Sidebar side="right">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Right-anchored sidebar" />
      </SidebarProvider>
    </Frame>
  ),
};

/** `collapsible="offcanvas"` — slides the panel fully off-screen. */
export const Collapse_Offcanvas: Story = {
  render: () => (
    <Frame>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="offcanvas">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Toggle to hide the sidebar" />
      </SidebarProvider>
    </Frame>
  ),
};

/** `collapsible="icon"` — shrinks to an icon column. */
export const Collapse_Icon: Story = {
  render: () => (
    <Frame>
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Toggle to expand the sidebar" />
      </SidebarProvider>
    </Frame>
  ),
};

/** `collapsible="rail"` — dual-panel mode driven by rail buttons. */
export const Collapse_Rail: Story = {
  render: () => (
    <Frame>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="rail">
          <SidebarRail>
            <SidebarRailButton
              icon={<HugeiconsIcon icon={Home01Icon} />}
              tooltip="Home"
              value="home"
            />
            <SidebarRailButton
              icon={<HugeiconsIcon icon={InboxIcon} />}
              tooltip="Inbox"
              value="inbox"
            />
            <SidebarRailButton
              icon={<HugeiconsIcon icon={Settings01Icon} />}
              tooltip="Settings"
              value="settings"
            />
          </SidebarRail>
          <SidebarPanel value="home">
            <SidebarHeader>
              <span className="font-semibold text-sm">Home</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <BasicMenu />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </SidebarPanel>
          <SidebarPanel value="inbox">
            <SidebarHeader>
              <span className="font-semibold text-sm">Inbox</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>All mail</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>Starred</SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </SidebarPanel>
          <SidebarPanel value="settings">
            <SidebarHeader>
              <span className="font-semibold text-sm">Settings</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>Profile</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>Billing</SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </SidebarPanel>
        </Sidebar>
        <SidebarInset>
          <main className="p-4">
            <p className="text-muted-foreground text-sm">
              Click a rail button to swap the panel; click it again to close.
            </p>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Frame>
  ),
};

/** `collapsible="none"` — always visible, no toggle. */
export const Collapse_None: Story = {
  render: () => (
    <Frame height={400}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Always expanded" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Side-by-side comparison: hover vs active state. */
export const ActiveState: Story = {
  render: () => (
    <Frame height={300}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Hover vs active</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HugeiconsIcon icon={Home01Icon} />
                      <span>Hover row</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <HugeiconsIcon icon={Settings01Icon} />
                      <span>Active row</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Active rail + soft background" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Two groups, one folded by default via `collapsible`. */
export const CollapsibleGroup: Story = {
  render: () => (
    <Frame height={420}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup collapsible="favs">
              <SidebarGroupLabel>Favourites</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HugeiconsIcon icon={StarIcon} />
                      <span>Pinned</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup collapsible="nav" defaultOpen={false}>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <BasicMenu active="search" />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Click a group label to collapse it" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Settings + help group pinned to the bottom via `pinned`. */
export const PinnedGroup: Story = {
  render: () => (
    <Frame height={520}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup pinned>
              <SidebarGroupLabel>Help</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <HugeiconsIcon icon={HelpCircleIcon} />
                      <span>Documentation</span>
                    </SidebarMenuButton>
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
        <InsetBody label="Pinned group floats to the bottom" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Animated open/close disclosure sub-menu. */
export const DisclosureSubMenu: Story = {
  render: () => (
    <Frame height={460}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem value="settings">
                    <SidebarMenuButton hasSubMenu>
                      <HugeiconsIcon icon={Settings01Icon} />
                      <span>Settings</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub value="settings">
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
                  <SidebarMenuItem value="docs">
                    <SidebarMenuButton hasSubMenu>
                      <HugeiconsIcon icon={File01Icon} />
                      <span>Docs</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub value="docs">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>
                          Getting started
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Components</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Animated disclosure" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Icon-collapsed sub-menu — hovering opens a flyout popover. */
export const SubMenuFlyout: Story = {
  render: () => (
    <Frame height={460}>
      <SidebarProvider defaultOpen={false}>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem value="settings">
                    <SidebarMenuButton hasSubMenu tooltip="Settings">
                      <HugeiconsIcon icon={Settings01Icon} />
                      <span>Settings</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub value="settings">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Profile</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Billing</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Hover the icon to open the flyout" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Account row in the footer driven by `SidebarUserButton`. */
export const WithUserButton: Story = {
  render: () => (
    <Frame height={520}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarUserButton
              avatar={<HugeiconsIcon icon={UserIcon} />}
              email="ada@example.com"
              menu={
                <>
                  <MenuPrimitive.Item className="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent">
                    <HugeiconsIcon className="size-4" icon={UserIcon} />
                    <span>Profile</span>
                  </MenuPrimitive.Item>
                  <MenuPrimitive.Item className="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent">
                    <HugeiconsIcon className="size-4" icon={Logout01Icon} />
                    <span>Sign out</span>
                  </MenuPrimitive.Item>
                </>
              }
              name="Ada Lovelace"
            />
          </SidebarFooter>
        </Sidebar>
        <InsetBody label="User account chip with menu" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Workspace switcher pinned in the header. */
export const WithSwitcher: Story = {
  render: () => (
    <Frame height={480}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <SidebarHeader>
            <SidebarSwitcher
              current={{
                name: "Acme",
                meta: "Pro plan",
                logo: <HugeiconsIcon icon={Briefcase01Icon} />,
              }}
            >
              <SidebarSwitcherItem
                logo={<HugeiconsIcon icon={Briefcase01Icon} />}
                meta="Pro"
                name="Acme"
                selected
              />
              <SidebarSwitcherItem
                logo={<HugeiconsIcon icon={Folder01Icon} />}
                meta="Free"
                name="Globex"
              />
              <SidebarSwitcherItem
                logo={<HugeiconsIcon icon={UserGroup02Icon} />}
                meta="Team"
                name="Initech"
              />
            </SidebarSwitcher>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Click the switcher to swap workspace" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Header search row with a ⌘K shortcut hint. */
export const WithSearchButton: Story = {
  render: () => (
    <Frame height={480}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarSearchButton
              onTrigger={() => {
                // open command palette here
              }}
            />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="⌘K opens the search dialog" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Upgrade-to-Pro prompt in the footer via `SidebarCard`. */
export const WithCard: Story = {
  render: () => (
    <Frame height={520}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="none">
          <BrandHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarCard>
              <SidebarCardHeader>
                <SidebarCardTitle>Upgrade to Pro</SidebarCardTitle>
              </SidebarCardHeader>
              <SidebarCardDescription>
                Unlock unlimited workspaces and advanced reporting.
              </SidebarCardDescription>
              <SidebarCardContent>Pay yearly and save 20%.</SidebarCardContent>
              <SidebarCardFooter>
                <Button size="sm">Upgrade</Button>
              </SidebarCardFooter>
            </SidebarCard>
          </SidebarFooter>
        </Sidebar>
        <InsetBody label="Footer card prompt" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Drag-to-reorder menu wired to local state. */
export const Reorderable: Story = {
  render: () => {
    function ReorderDemo() {
      const [items, setItems] = useState([
        "alpha",
        "bravo",
        "charlie",
        "delta",
      ]);
      return (
        <SidebarMenu items={items} onReorder={setItems} reorderable>
          {items.map((id) => (
            <SidebarMenuItem key={id} value={id}>
              <SidebarMenuDragHandle />
              <SidebarMenuButton>
                <span className="pl-5 capitalize">{id}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      );
    }
    return (
      <Frame height={420}>
        <SidebarProvider defaultOpen>
          <Sidebar collapsible="none">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Drag to reorder</SidebarGroupLabel>
                <SidebarGroupContent>
                  <ReorderDemo />
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <InsetBody label="Hover an item to reveal its grip" />
        </SidebarProvider>
      </Frame>
    );
  },
};

/** Loading skeleton placeholders while content is fetching. */
export const LoadingSkeleton: Story = {
  render: () => (
    <Frame height={320}>
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
        <InsetBody label="Content loading…" />
      </SidebarProvider>
    </Frame>
  ),
};

/** Flagship "everything wired" story for a real app shell. */
export const RealWorldDashboard: Story = {
  render: () => (
    <Frame height={680}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarSwitcher
              current={{
                name: "Acme",
                meta: "Pro plan",
                logo: <HugeiconsIcon icon={Briefcase01Icon} />,
              }}
            >
              <SidebarSwitcherItem
                logo={<HugeiconsIcon icon={Briefcase01Icon} />}
                meta="Pro"
                name="Acme"
                selected
              />
              <SidebarSwitcherItem
                logo={<HugeiconsIcon icon={Folder01Icon} />}
                meta="Free"
                name="Globex"
              />
            </SidebarSwitcher>
            <SidebarSearchButton onTrigger={() => {}} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Dashboard">
                      <HugeiconsIcon icon={Home01Icon} />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Inbox">
                      <HugeiconsIcon icon={InboxIcon} />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>12</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Reports">
                      <HugeiconsIcon icon={ChartLineData02Icon} />
                      <span>Reports</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label="More options" showOnHover>
                      <HugeiconsIcon icon={MoreHorizontalIcon} />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup collapsible="favs">
              <SidebarGroupLabel>Favourites</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Starred">
                      <HugeiconsIcon icon={StarIcon} />
                      <span>Starred docs</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup pinned>
              <SidebarGroupContent>
                <SidebarCard>
                  <SidebarCardHeader>
                    <SidebarCardTitle>Upgrade to Pro</SidebarCardTitle>
                  </SidebarCardHeader>
                  <SidebarCardDescription>
                    Unlock unlimited workspaces.
                  </SidebarCardDescription>
                  <SidebarCardFooter>
                    <Button size="sm">
                      <HugeiconsIcon icon={CreditCardIcon} />
                      Upgrade
                    </Button>
                  </SidebarCardFooter>
                </SidebarCard>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarUserButton
              avatar={<HugeiconsIcon icon={UserIcon} />}
              email="ada@example.com"
              menu={
                <MenuPrimitive.Item className="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent">
                  <HugeiconsIcon className="size-4" icon={Logout01Icon} />
                  <span>Sign out</span>
                </MenuPrimitive.Item>
              }
              name="Ada Lovelace"
            />
          </SidebarFooter>
        </Sidebar>
        <InsetBody label="Real-world dashboard shell" />
      </SidebarProvider>
    </Frame>
  ),
};
