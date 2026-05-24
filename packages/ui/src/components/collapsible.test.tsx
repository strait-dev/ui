import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

function Fixture() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Show details</CollapsibleTrigger>
      <CollapsibleContent>Hidden content here.</CollapsibleContent>
    </Collapsible>
  );
}

describe("Collapsible", () => {
  it("renders the trigger with correct data-slot", () => {
    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Show details" });
    expect(trigger).toHaveAttribute("data-slot", "collapsible-trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("does not show content when closed", () => {
    render(<Fixture />);
    // Base UI Collapsible removes the panel from the DOM when closed
    expect(screen.queryByText("Hidden content here.")).not.toBeInTheDocument();
  });

  it("expands the panel when the trigger is clicked", async () => {
    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Show details" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Hidden content here.")).toBeVisible();
  });

  it("collapses the panel when the trigger is clicked again", async () => {
    render(<Fixture />);
    const trigger = screen.getByRole("button", { name: "Show details" });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("starts open when defaultOpen is true", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Initially open content.</CollapsibleContent>
      </Collapsible>
    );
    expect(screen.getByText("Initially open content.")).toBeVisible();
  });
});
