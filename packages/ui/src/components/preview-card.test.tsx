import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  PreviewCard,
  PreviewCardArrow,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardTrigger,
} from "./preview-card";

// PreviewCard is pointer/hover driven by default (Base UI PreviewCard).
// jsdom does not fully support hover events for lazy open, so we use the
// controlled `open` prop on the root to assert content is rendered.

describe("PreviewCard", () => {
  it("renders the trigger element", () => {
    render(
      <PreviewCard>
        <PreviewCardTrigger>
          <a href="/user">@user</a>
        </PreviewCardTrigger>
        <PreviewCardPortal>
          <PreviewCardPositioner>
            <PreviewCardPopup>Content</PreviewCardPopup>
          </PreviewCardPositioner>
        </PreviewCardPortal>
      </PreviewCard>
    );
    expect(screen.getByText("@user")).toBeInTheDocument();
  });

  it("renders without crashing when given a trigger child", () => {
    // Base UI PreviewCard.Root is renderless (no DOM element of its own)
    render(
      <PreviewCard>
        <PreviewCardTrigger>Trigger</PreviewCardTrigger>
      </PreviewCard>
    );
    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("applies data-slot to the trigger", () => {
    render(
      <PreviewCard>
        <PreviewCardTrigger>Hover me</PreviewCardTrigger>
      </PreviewCard>
    );
    expect(screen.getByText("Hover me")).toHaveAttribute(
      "data-slot",
      "preview-card-trigger"
    );
  });

  it("does not show popup content when closed (default)", () => {
    render(
      <PreviewCard>
        <PreviewCardTrigger>Trigger</PreviewCardTrigger>
        <PreviewCardPortal>
          <PreviewCardPositioner>
            <PreviewCardPopup>Hidden popup</PreviewCardPopup>
          </PreviewCardPositioner>
        </PreviewCardPortal>
      </PreviewCard>
    );
    expect(screen.queryByText("Hidden popup")).not.toBeInTheDocument();
  });

  it("renders popup content when open is true", async () => {
    render(
      <PreviewCard open>
        <PreviewCardTrigger>Trigger</PreviewCardTrigger>
        <PreviewCardPortal>
          <PreviewCardPositioner>
            <PreviewCardPopup>Visible popup</PreviewCardPopup>
          </PreviewCardPositioner>
        </PreviewCardPortal>
      </PreviewCard>
    );
    expect(await screen.findByText("Visible popup")).toBeInTheDocument();
  });

  it("applies data-slot to the popup when open", async () => {
    render(
      <PreviewCard open>
        <PreviewCardTrigger>Trigger</PreviewCardTrigger>
        <PreviewCardPortal>
          <PreviewCardPositioner>
            <PreviewCardPopup>Popup content</PreviewCardPopup>
          </PreviewCardPositioner>
        </PreviewCardPortal>
      </PreviewCard>
    );
    const content = await screen.findByText("Popup content");
    expect(
      content.closest("[data-slot='preview-card-popup']")
    ).toBeInTheDocument();
  });

  it("renders the positioner with data-slot when open", async () => {
    render(
      <PreviewCard open>
        <PreviewCardTrigger>Trigger</PreviewCardTrigger>
        <PreviewCardPortal>
          <PreviewCardPositioner>
            <PreviewCardPopup>Positioned content</PreviewCardPopup>
          </PreviewCardPositioner>
        </PreviewCardPortal>
      </PreviewCard>
    );
    await screen.findByText("Positioned content");
    expect(
      document.querySelector("[data-slot='preview-card-positioner']")
    ).toBeInTheDocument();
  });

  it("renders the arrow inside an open popup", async () => {
    render(
      <PreviewCard open>
        <PreviewCardTrigger>Trigger</PreviewCardTrigger>
        <PreviewCardPortal>
          <PreviewCardPositioner>
            <PreviewCardPopup>
              <PreviewCardArrow />
              Arrow content
            </PreviewCardPopup>
          </PreviewCardPositioner>
        </PreviewCardPortal>
      </PreviewCard>
    );
    await screen.findByText("Arrow content");
    expect(
      document.querySelector("[data-slot='preview-card-arrow']")
    ).toBeInTheDocument();
  });

  it("renders rich content inside the popup when open", async () => {
    render(
      <PreviewCard open>
        <PreviewCardTrigger>@jane</PreviewCardTrigger>
        <PreviewCardPortal>
          <PreviewCardPositioner>
            <PreviewCardPopup>
              <p className="font-medium">Jane Doe</p>
              <p>Member since 2021</p>
            </PreviewCardPopup>
          </PreviewCardPositioner>
        </PreviewCardPortal>
      </PreviewCard>
    );
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Member since 2021")).toBeInTheDocument();
  });
});
