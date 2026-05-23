import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

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
});
