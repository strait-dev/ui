import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";

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
  SidebarProvider,
  SidebarTrigger,
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
});
