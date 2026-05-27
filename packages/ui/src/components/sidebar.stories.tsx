import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  Bookmark02Icon,
  BookOpen01Icon,
  BotIcon,
  Briefcase01Icon,
  Calendar01Icon,
  ChartLineData02Icon,
  Comment01Icon,
  CreditCardIcon,
  CubeIcon,
  File01Icon,
  Folder01Icon,
  GitBranchIcon,
  HelpCircleIcon,
  Home01Icon,
  InboxIcon,
  Layers02Icon,
  Logout01Icon,
  MagicWand02Icon,
  Mail01Icon,
  MessageQuestionIcon,
  MoonIcon,
  MoreHorizontalIcon,
  Notification01Icon,
  PencilEdit02Icon,
  Rocket01Icon,
  Search01Icon,
  Settings01Icon,
  StarIcon,
  SunIcon,
  Tag01Icon,
  UserCircleIcon,
  UserGroup02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "./button";
import { CommandMenu } from "./command-menu";
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
  // left edge instead of escaping to the viewport. The `[&_[data-slot=
  // sidebar-container]]:!h-full` override clamps the sidebar's built-in
  // `h-svh` down to the Frame's own height so the footer stays in view.
  return (
    <div
      className="[&_[data-slot=sidebar-container]]:!h-full flex w-full transform-gpu overflow-hidden rounded-lg border"
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

function BrandHeader({ subtitle }: { subtitle?: string } = {}) {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <HugeiconsIcon
                className="size-4"
                icon={Briefcase01Icon}
                strokeWidth={2}
              />
            </div>
            {/* Label hides in icon mode so only the brand glyph stays. */}
            <div className="flex flex-1 flex-col gap-0.5 leading-tight group-data-[collapsible=icon]:hidden">
              <span className="font-semibold">Acme Inc.</span>
              {subtitle && (
                <span className="text-muted-foreground text-xs">
                  {subtitle}
                </span>
              )}
            </div>
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

/**
 * Header search row with a ⌘K shortcut hint, wired to a real
 * {@link CommandMenu} so clicking the field (or hitting ⌘K) opens the
 * palette.
 */
function WithSearchButtonRender() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  return (
    <Frame height={480}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarSearchButton onTrigger={() => setPaletteOpen(true)} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <BasicMenu />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <InsetBody label="Click the search field or press ⌘K" />
        <CommandMenu
          groups={commandGroups}
          onOpenChange={setPaletteOpen}
          open={paletteOpen}
        />
      </SidebarProvider>
    </Frame>
  );
}

export const WithSearchButton: Story = {
  render: () => <WithSearchButtonRender />,
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

// --- Real-world helpers ------------------------------------------------------

/** Shared menu-item recipe used inside the {@link SidebarUserButton} dropdown. */
const userMenuItemClass =
  "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground";

/**
 * Realistic {@link CommandMenu} payload — three groups with shortcuts and
 * keyword aliases so the palette can be opened from `SidebarSearchButton`
 * (`⌘K`) and still surface results under common synonyms.
 */
const commandGroups = [
  {
    heading: "Navigate",
    items: [
      {
        label: "Dashboard",
        icon: Home01Icon,
        shortcut: "⌘D",
        keywords: ["home", "overview"],
        onSelect: () => {},
      },
      {
        label: "Inbox",
        icon: InboxIcon,
        shortcut: "⌘I",
        keywords: ["mail", "messages"],
        onSelect: () => {},
      },
      {
        label: "Projects",
        icon: CubeIcon,
        keywords: ["workspaces"],
        onSelect: () => {},
      },
      {
        label: "Calendar",
        icon: Calendar01Icon,
        keywords: ["events", "schedule"],
        onSelect: () => {},
      },
      {
        label: "Reports",
        icon: ChartLineData02Icon,
        keywords: ["analytics", "metrics"],
        onSelect: () => {},
      },
    ],
  },
  {
    heading: "Create",
    items: [
      {
        label: "New project",
        icon: CubeIcon,
        shortcut: "⌘N",
        onSelect: () => {},
      },
      { label: "New document", icon: PencilEdit02Icon, onSelect: () => {} },
      { label: "Invite teammate", icon: UserGroup02Icon, onSelect: () => {} },
    ],
  },
  {
    heading: "Settings",
    items: [
      { label: "Account", icon: UserCircleIcon, onSelect: () => {} },
      { label: "Billing", icon: CreditCardIcon, onSelect: () => {} },
      {
        label: "Toggle theme",
        icon: MoonIcon,
        shortcut: "⌘T",
        keywords: ["dark mode", "light"],
        onSelect: () => {},
      },
      { label: "Sign out", icon: Logout01Icon, onSelect: () => {} },
    ],
  },
];

/**
 * Rich user-button dropdown that mirrors the shadcn `sidebar-07` block — the
 * canonical "account / billing / notifications / log out" footer menu.
 */
function FooterUserButton() {
  return (
    <SidebarUserButton
      avatar={<HugeiconsIcon icon={UserCircleIcon} />}
      email="ada@example.com"
      menu={
        <>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex size-7 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon className="size-4" icon={UserIcon} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate font-medium text-sm">Ada Lovelace</span>
              <span className="truncate text-muted-foreground text-xs">
                ada@example.com
              </span>
            </div>
          </div>
          <MenuPrimitive.Separator className="-mx-1 my-1 h-px bg-border" />
          <MenuPrimitive.Item className={userMenuItemClass}>
            <HugeiconsIcon className="size-4" icon={Rocket01Icon} />
            <span>Upgrade to Pro</span>
          </MenuPrimitive.Item>
          <MenuPrimitive.Separator className="-mx-1 my-1 h-px bg-border" />
          <MenuPrimitive.Item className={userMenuItemClass}>
            <HugeiconsIcon className="size-4" icon={UserCircleIcon} />
            <span>Account</span>
          </MenuPrimitive.Item>
          <MenuPrimitive.Item className={userMenuItemClass}>
            <HugeiconsIcon className="size-4" icon={CreditCardIcon} />
            <span>Billing</span>
          </MenuPrimitive.Item>
          <MenuPrimitive.Item className={userMenuItemClass}>
            <HugeiconsIcon className="size-4" icon={Notification01Icon} />
            <span>Notifications</span>
          </MenuPrimitive.Item>
          <MenuPrimitive.Separator className="-mx-1 my-1 h-px bg-border" />
          <MenuPrimitive.Item className={userMenuItemClass}>
            <HugeiconsIcon className="size-4" icon={Logout01Icon} />
            <span>Log out</span>
          </MenuPrimitive.Item>
        </>
      }
      name="Ada Lovelace"
    />
  );
}

/**
 * Flagship "everything wired" story mirroring shadcn's `sidebar-07` block —
 * team switcher, ⌘K search opening a real `CommandMenu`, multi-group navigation
 * with animated sub-menus, drag-to-reorder favourites, upgrade card, and a
 * rich user-button dropdown in the footer.
 */
function RealWorldDashboardRender() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [favourites, setFavourites] = useState([
    "design-system",
    "q4-roadmap",
    "onboarding-flow",
  ]);
  return (
    <Frame height={760}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarSwitcher
              current={{
                name: "Acme Inc.",
                meta: "Pro plan",
                logo: <HugeiconsIcon icon={Briefcase01Icon} />,
              }}
            >
              <SidebarSwitcherItem
                logo={<HugeiconsIcon icon={Briefcase01Icon} />}
                meta="Pro"
                name="Acme Inc."
                selected
              />
              <SidebarSwitcherItem
                logo={<HugeiconsIcon icon={Folder01Icon} />}
                meta="Free"
                name="Globex"
              />
              <SidebarSwitcherItem
                logo={<HugeiconsIcon icon={Layers02Icon} />}
                meta="Team"
                name="Stark Industries"
              />
            </SidebarSwitcher>
            <SidebarSearchButton onTrigger={() => setPaletteOpen(true)} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem value="playground">
                    <SidebarMenuButton hasSubMenu tooltip="Playground">
                      <HugeiconsIcon icon={MagicWand02Icon} />
                      <span>Playground</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub value="playground">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive>
                          History
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Starred</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Settings</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem value="models">
                    <SidebarMenuButton hasSubMenu tooltip="Models">
                      <HugeiconsIcon icon={BotIcon} />
                      <span>Models</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub value="models">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Genesis</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Explorer</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Quantum</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem value="documentation">
                    <SidebarMenuButton hasSubMenu tooltip="Documentation">
                      <HugeiconsIcon icon={BookOpen01Icon} />
                      <span>Documentation</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub value="documentation">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>
                          Introduction
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Get started</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Tutorials</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Changelog</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Calendar">
                      <HugeiconsIcon icon={Calendar01Icon} />
                      <span>Calendar</span>
                    </SidebarMenuButton>
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
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Team">
                      <HugeiconsIcon icon={UserGroup02Icon} />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup collapsible="favourites">
              <SidebarGroupLabel>Favourites</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu
                  items={favourites}
                  onReorder={setFavourites}
                  reorderable
                >
                  {favourites.map((slug) => (
                    <SidebarMenuItem key={slug} value={slug}>
                      <SidebarMenuButton tooltip={slug}>
                        <HugeiconsIcon icon={StarIcon} />
                        <span>{titleCase(slug)}</span>
                      </SidebarMenuButton>
                      <SidebarMenuDragHandle />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup collapsible="tags">
              <SidebarGroupLabel>Tags</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Design">
                      <HugeiconsIcon icon={Tag01Icon} />
                      <span>Design</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>8</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Engineering">
                      <HugeiconsIcon icon={GitBranchIcon} />
                      <span>Engineering</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>14</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Marketing">
                      <HugeiconsIcon icon={Bookmark02Icon} />
                      <span>Marketing</span>
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
                    Unlock unlimited workspaces and advanced reporting.
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
            <FooterUserButton />
          </SidebarFooter>
        </Sidebar>
        <InsetBody label="Real-world dashboard shell" />
        <CommandMenu
          groups={commandGroups}
          onOpenChange={setPaletteOpen}
          open={paletteOpen}
        />
      </SidebarProvider>
    </Frame>
  );
}

export const RealWorldDashboard: Story = {
  render: () => <RealWorldDashboardRender />,
};

/**
 * Variant of the flagship shell mirroring shadcn's `sidebar-08` block — the
 * footer keeps the user dropdown but pairs it with a pinned secondary group
 * containing dedicated "Support" and "Send feedback" rows above the upgrade
 * card.
 */
function RealWorldWithSupportRender() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  return (
    <Frame height={760}>
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <BrandHeader subtitle="Pro plan" />
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
                    <SidebarMenuButton tooltip="Mail">
                      <HugeiconsIcon icon={Mail01Icon} />
                      <span>Mail</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Projects">
                      <HugeiconsIcon icon={CubeIcon} />
                      <span>Projects</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Calendar">
                      <HugeiconsIcon icon={Calendar01Icon} />
                      <span>Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Documents">
                      <HugeiconsIcon icon={File01Icon} />
                      <span>Documents</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <HugeiconsIcon icon={Settings01Icon} />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Recent</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Design System">
                      <HugeiconsIcon icon={Layers02Icon} />
                      <span>Design system</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Marketing Site">
                      <HugeiconsIcon icon={Bookmark02Icon} />
                      <span>Marketing site</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Mobile App">
                      <HugeiconsIcon icon={Rocket01Icon} />
                      <span>Mobile app</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {/* Pinned bottom group: support + feedback above the user row. */}
            <SidebarGroup pinned>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Support">
                      <HugeiconsIcon icon={MessageQuestionIcon} />
                      <span>Support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Send feedback">
                      <HugeiconsIcon icon={Comment01Icon} />
                      <span>Send feedback</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Toggle theme">
                      <HugeiconsIcon icon={SunIcon} />
                      <span>Toggle theme</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Help">
                      <HugeiconsIcon icon={HelpCircleIcon} />
                      <span>Help</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSearchButton onTrigger={() => setPaletteOpen(true)} />
            <FooterUserButton />
          </SidebarFooter>
        </Sidebar>
        <InsetBody label="Real-world shell with support + feedback footer" />
        <CommandMenu
          groups={commandGroups}
          onOpenChange={setPaletteOpen}
          open={paletteOpen}
        />
      </SidebarProvider>
    </Frame>
  );
}

export const RealWorldWithSupport: Story = {
  render: () => <RealWorldWithSupportRender />,
};

/** Cheap title-case helper for the favourites demo. */
function titleCase(slug: string) {
  return slug
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
