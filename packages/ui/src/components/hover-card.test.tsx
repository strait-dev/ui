import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

// HoverCard uses Base UI's PreviewCard which is pointer/hover driven.
// jsdom does not fully support pointer events for hover-triggered open,
// so all tests use the controlled `open` prop to assert rendered content.

describe("HoverCard", () => {
  it("renders the trigger element", () => {
    render(
      <HoverCard>
        <HoverCardTrigger>
          <a href="/profile">@username</a>
        </HoverCardTrigger>
        <HoverCardContent>
          <p>Full Name</p>
        </HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByText("@username")).toBeInTheDocument();
  });

  it("does not show content when closed", () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent>
          <p>Preview content</p>
        </HoverCardContent>
      </HoverCard>
    );
    expect(screen.queryByText("Preview content")).not.toBeInTheDocument();
  });

  it("renders hover card content when open is true", async () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>
          <a href="/profile">@username</a>
        </HoverCardTrigger>
        <HoverCardContent>
          <p className="font-medium">Full Name</p>
          <p>Member since 2021</p>
        </HoverCardContent>
      </HoverCard>
    );
    expect(await screen.findByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Member since 2021")).toBeInTheDocument();
  });

  it("applies the correct data-slot to the content popup", async () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>Trigger</HoverCardTrigger>
        <HoverCardContent>
          <p>Slotted content</p>
        </HoverCardContent>
      </HoverCard>
    );
    const content = await screen.findByText("Slotted content");
    expect(
      content.closest("[data-slot='hover-card-content']")
    ).toBeInTheDocument();
  });

  it("applies the correct data-slot to the trigger", () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Hover target</HoverCardTrigger>
        <HoverCardContent>
          <p>Content</p>
        </HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByText("Hover target")).toHaveAttribute(
      "data-slot",
      "hover-card-trigger"
    );
  });
});
