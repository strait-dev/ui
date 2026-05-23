import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

function Fixture() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger aria-label="Settings">Settings icon</TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  it("renders the trigger element", () => {
    render(<Fixture />);
    expect(screen.getByText("Settings icon")).toBeInTheDocument();
  });

  it("tooltip content is not in the document before hover", () => {
    render(<Fixture />);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("shows tooltip content when the trigger is focused", async () => {
    render(<Fixture />);
    await userEvent.tab();
    expect(await screen.findByText("Settings")).toBeInTheDocument();
  });

  it("applies correct data-slot to the content", async () => {
    render(<Fixture />);
    await userEvent.tab();
    const content = await screen.findByText("Settings");
    expect(
      content.closest("[data-slot='tooltip-content']")
    ).toBeInTheDocument();
  });

  it("renders content when open is controlled to true", async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip label</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    expect(await screen.findByText("Tooltip label")).toBeInTheDocument();
  });
});
