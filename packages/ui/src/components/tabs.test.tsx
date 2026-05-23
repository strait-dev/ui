import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ||= () => {};
});

function Fixture() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings panel.</TabsContent>
      <TabsContent value="security">Security settings panel.</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders the tab list with correct data-slot", () => {
    render(<Fixture />);
    expect(screen.getByRole("tablist")).toHaveAttribute(
      "data-slot",
      "tabs-list"
    );
  });

  it("shows the default active panel and hides the inactive one", () => {
    render(<Fixture />);
    expect(screen.getByText("Account settings panel.")).toBeVisible();
    // Base UI Tabs removes inactive panels from the DOM
    expect(
      screen.queryByText("Security settings panel.")
    ).not.toBeInTheDocument();
  });

  it("switches the active panel when another trigger is clicked", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByRole("tab", { name: "Security" }));
    expect(screen.getByText("Security settings panel.")).toBeVisible();
    // Account panel is removed from DOM when not active
    expect(
      screen.queryByText("Account settings panel.")
    ).not.toBeInTheDocument();
  });

  it("marks the active trigger with data-active", async () => {
    render(<Fixture />);
    const accountTab = screen.getByRole("tab", { name: "Account" });
    const securityTab = screen.getByRole("tab", { name: "Security" });
    expect(accountTab).toHaveAttribute("data-active");
    expect(securityTab).not.toHaveAttribute("data-active");
    await userEvent.click(securityTab);
    expect(securityTab).toHaveAttribute("data-active");
    expect(accountTab).not.toHaveAttribute("data-active");
  });

  it("renders triggers with the correct data-slot", () => {
    render(<Fixture />);
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveAttribute("data-slot", "tabs-trigger");
    }
  });

  describe("variant axis", () => {
    it("applies data-variant='default' by default", () => {
      render(<Fixture />);
      expect(screen.getByRole("tablist")).toHaveAttribute(
        "data-variant",
        "default"
      );
    });

    it("applies data-variant='underline' when variant='underline'", () => {
      render(
        <Tabs defaultValue="a">
          <TabsList variant="underline">
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel A</TabsContent>
          <TabsContent value="b">Panel B</TabsContent>
        </Tabs>
      );
      expect(screen.getByRole("tablist")).toHaveAttribute(
        "data-variant",
        "underline"
      );
    });

    it("applies data-variant='line' when variant='line'", () => {
      render(
        <Tabs defaultValue="a">
          <TabsList variant="line">
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel A</TabsContent>
        </Tabs>
      );
      expect(screen.getByRole("tablist")).toHaveAttribute(
        "data-variant",
        "line"
      );
    });
  });

  describe("size axis", () => {
    it("applies data-size='default' by default", () => {
      render(<Fixture />);
      expect(screen.getByRole("tablist")).toHaveAttribute(
        "data-size",
        "default"
      );
    });

    it("applies data-size='sm' when size='sm'", () => {
      render(
        <Tabs defaultValue="a">
          <TabsList size="sm">
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel A</TabsContent>
        </Tabs>
      );
      expect(screen.getByRole("tablist")).toHaveAttribute("data-size", "sm");
    });

    it("applies data-size='lg' when size='lg'", () => {
      render(
        <Tabs defaultValue="a">
          <TabsList size="lg">
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Panel A</TabsContent>
        </Tabs>
      );
      expect(screen.getByRole("tablist")).toHaveAttribute("data-size", "lg");
    });

    it("underline variant + lg size sets both data attributes", () => {
      render(
        <Tabs defaultValue="x">
          <TabsList size="lg" variant="underline">
            <TabsTrigger value="x">X</TabsTrigger>
          </TabsList>
          <TabsContent value="x">Panel X</TabsContent>
        </Tabs>
      );
      const list = screen.getByRole("tablist");
      expect(list).toHaveAttribute("data-variant", "underline");
      expect(list).toHaveAttribute("data-size", "lg");
    });
  });
});
