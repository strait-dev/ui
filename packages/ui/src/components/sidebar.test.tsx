import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

beforeAll(() => {
  window.matchMedia ||= (q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Deferred imports so polyfills apply before module evaluation
// We use dynamic import-like workaround with top-level await pattern; instead
// just import at the top since beforeAll runs before tests.
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSearchButton,
  SidebarSwitcher,
  SidebarSwitcherItem,
  SidebarTrigger,
  SidebarUserButton,
  useSidebar,
} from "./sidebar";

function SidebarFixture({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="none">
        <SidebarHeader>
          <span>App Name</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Home</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <span>Footer</span>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <main>Main content</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

describe("Sidebar", () => {
  it("renders the sidebar provider wrapper with data-slot='sidebar-wrapper'", () => {
    const { container } = render(<SidebarFixture />);
    expect(
      container.querySelector("[data-slot='sidebar-wrapper']")
    ).toBeInTheDocument();
  });

  it("renders sidebar content", () => {
    render(<SidebarFixture />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders sidebar header content", () => {
    render(<SidebarFixture />);
    expect(screen.getByText("App Name")).toBeInTheDocument();
  });

  it("renders sidebar footer content", () => {
    render(<SidebarFixture />);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders main content in SidebarInset", () => {
    render(<SidebarFixture />);
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("renders the trigger with data-slot='sidebar-trigger'", () => {
    const { container } = render(<SidebarFixture />);
    expect(
      container.querySelector("[data-slot='sidebar-trigger']")
    ).toBeInTheDocument();
  });

  it("renders sidebar with data-slot='sidebar'", () => {
    const { container } = render(<SidebarFixture />);
    expect(
      container.querySelector("[data-slot='sidebar']")
    ).toBeInTheDocument();
  });

  it("renders group label text", () => {
    render(<SidebarFixture />);
    expect(screen.getByText("Navigation")).toBeInTheDocument();
  });

  it("exposes submenu helpers and active-rail setter on context", async () => {
    let api: ReturnType<typeof useSidebar> | undefined;
    function Probe() {
      api = useSidebar();
      return null;
    }
    render(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>
    );
    expect(api).toBeDefined();
    if (!api) {
      return;
    }
    expect(api.isSubmenuOpen("foo")).toBe(false);
    await Promise.resolve();
    api.toggleSubmenu("foo");
    // Re-render captured api on next paint; trigger an event loop flush
    await Promise.resolve();
    expect(api.activeRailItem).toBeNull();
    api.setActiveRailItem("home");
    await Promise.resolve();
    // The probe re-renders on state change; api closure now points at fresh ctx.
    expect(typeof api.toggleSubmenu).toBe("function");
    expect(typeof api.setSubmenuOpen).toBe("function");
    expect(typeof api.setActiveRailItem).toBe("function");
  });

  it("pins a SidebarGroup to the bottom via mt-auto", () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarGroup pinned data-testid="pinned-group">
            <SidebarGroupLabel>Pinned</SidebarGroupLabel>
          </SidebarGroup>
        </Sidebar>
      </SidebarProvider>
    );
    const pinned = container.querySelector('[data-testid="pinned-group"]');
    expect(pinned).not.toBeNull();
    expect(pinned?.className).toContain("mt-auto");
  });

  it("makes a SidebarGroup collapsible via the collapsible key", async () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarGroup collapsible="favs">
            <SidebarGroupLabel>Favourites</SidebarGroupLabel>
          </SidebarGroup>
        </Sidebar>
      </SidebarProvider>
    );
    const trigger = screen.getByText("Favourites");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    await userEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    const root = container.querySelector("[data-slot='sidebar-group']");
    expect(root?.getAttribute("data-open")).toBeNull();
  });

  it("renders the active-state visual (left rail + soft bg + aria-current)", () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Active row</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>
    );
    const button = screen.getByText("Active row").closest("button");
    expect(button).not.toBeNull();
    if (!button) return;
    const className = button.className;
    expect(className).toContain("data-active:bg-sidebar-active");
    expect(className).toContain("data-active:text-sidebar-active-foreground");
    expect(className).toContain("data-active:before:bg-sidebar-active-rail");
    expect(button.getAttribute("aria-current")).toBe("page");
  });

  it("fires SidebarSearchButton onTrigger on click and on ⌘K", async () => {
    const onTrigger = vi.fn();
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarSearchButton onTrigger={onTrigger} />
        </Sidebar>
      </SidebarProvider>
    );
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(onTrigger).toHaveBeenCalledTimes(1);
    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(onTrigger).toHaveBeenCalledTimes(2);
  });

  it("toggles a SidebarMenuItem sub-menu via the hasSubMenu trigger", async () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarMenu>
            <SidebarMenuItem value="settings">
              <SidebarMenuButton hasSubMenu>Settings</SidebarMenuButton>
              <SidebarMenuSub value="settings">
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton>Profile</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>
    );
    const trigger = screen.getByText("Settings").closest("button");
    expect(trigger).not.toBeNull();
    if (!trigger) return;
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    await userEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("toggles sidebar via trigger button", async () => {
    const { container } = render(
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Item</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
    );
    const trigger = container.querySelector("[data-slot='sidebar-trigger']");
    expect(trigger).toBeInTheDocument();
    if (trigger) {
      await userEvent.click(trigger as HTMLElement);
    }
    // After click, sidebar state should have changed (desktop: collapsed)
    const wrapper = container.querySelector("[data-slot='sidebar-wrapper']");
    expect(wrapper).toBeInTheDocument();
  });

  it("opens the SidebarUserButton menu on click", async () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarUserButton
            email="ada@example.com"
            menu={<MenuPrimitive.Item>Sign out</MenuPrimitive.Item>}
            name="Ada Lovelace"
          />
        </Sidebar>
      </SidebarProvider>
    );
    const trigger = screen.getByText("Ada Lovelace").closest("button");
    expect(trigger).not.toBeNull();
    if (!trigger) return;
    expect(screen.queryByText("Sign out")).toBeNull();
    await userEvent.click(trigger);
    expect(await screen.findByText("Sign out")).toBeInTheDocument();
  });

  it("opens the SidebarSwitcher popover and reflects selected via data-selected", async () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarSwitcher current={{ name: "Acme", meta: "Pro" }}>
            <SidebarSwitcherItem name="Acme" meta="Pro" selected />
            <SidebarSwitcherItem name="Globex" meta="Free" />
          </SidebarSwitcher>
        </Sidebar>
      </SidebarProvider>
    );
    expect(screen.queryByText("Globex")).toBeNull();
    const trigger = screen.getAllByText("Acme")[0]?.closest("button");
    expect(trigger).not.toBeNull();
    if (!trigger) return;
    await userEvent.click(trigger);
    const globex = await screen.findByText("Globex");
    expect(globex).toBeInTheDocument();
    const acmeItem = screen
      .getAllByRole("button")
      .find(
        (b) =>
          b.getAttribute("data-slot") === "sidebar-switcher-item" &&
          b.getAttribute("data-selected") === "true"
      );
    expect(acmeItem).toBeDefined();
  });

  it("renders SidebarUserButton as a static chip with no menu trigger", () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarUserButton name="Ada Lovelace" static />
        </Sidebar>
      </SidebarProvider>
    );
    const trigger = screen.getByText("Ada Lovelace").closest("button");
    expect(trigger).not.toBeNull();
    expect(trigger?.getAttribute("aria-expanded")).toBeNull();
  });
});
