import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// Base UI uses ResizeObserver internally for positioning — polyfill in jsdom.
beforeAll(() => {
  if (typeof window !== "undefined" && !window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

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

  // ── variant axis ──────────────────────────────────────────────────────────

  it("default variant applies bg-foreground class to the popup", async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent variant="default">Default tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const popup = (await screen.findByText("Default tooltip")).closest(
      "[data-slot='tooltip-content']"
    );
    expect(popup).toHaveClass("bg-foreground");
    expect(popup).toHaveClass("text-background");
  });

  it("light variant applies bg-popover class to the popup", async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent variant="light">Light tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const popup = (await screen.findByText("Light tooltip")).closest(
      "[data-slot='tooltip-content']"
    );
    expect(popup).toHaveClass("bg-popover");
    expect(popup).toHaveClass("text-popover-foreground");
    expect(popup).toHaveClass("border");
  });

  // ── size axis ─────────────────────────────────────────────────────────────

  it("default size applies px-3 py-1.5 text-xs to the popup", async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent size="default">Default size</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const popup = (await screen.findByText("Default size")).closest(
      "[data-slot='tooltip-content']"
    );
    expect(popup).toHaveClass("px-3");
    expect(popup).toHaveClass("py-1.5");
    expect(popup).toHaveClass("text-xs");
  });

  it("sm size applies px-2 py-1 to the popup", async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent size="sm">Small tooltip</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const popup = (await screen.findByText("Small tooltip")).closest(
      "[data-slot='tooltip-content']"
    );
    expect(popup).toHaveClass("px-2");
    expect(popup).toHaveClass("py-1");
  });

  it("light + sm combination applies both class sets", async () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent size="sm" variant="light">
            Combined
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const popup = (await screen.findByText("Combined")).closest(
      "[data-slot='tooltip-content']"
    );
    expect(popup).toHaveClass("bg-popover");
    expect(popup).toHaveClass("px-2");
    expect(popup).toHaveClass("py-1");
    expect(popup).toHaveClass("border");
  });
});
