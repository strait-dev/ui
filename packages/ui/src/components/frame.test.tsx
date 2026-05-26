import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "./frame";

function Fixture({
  stacked,
  dense,
  variant,
}: {
  stacked?: boolean;
  dense?: boolean;
  variant?: "default" | "ghost";
}) {
  return (
    <Frame dense={dense} stacked={stacked} variant={variant}>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Title A</FrameTitle>
          <FrameDescription>Description A</FrameDescription>
        </FrameHeader>
        <FrameFooter>Footer A</FrameFooter>
      </FramePanel>
      <FramePanel>
        <FrameHeader>
          <FrameTitle>Title B</FrameTitle>
        </FrameHeader>
      </FramePanel>
    </Frame>
  );
}

describe("Frame", () => {
  it("renders every documented part with its data-slot", () => {
    render(<Fixture />);
    expect(document.querySelector('[data-slot="frame"]')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-slot="frame-panel"]').length).toBe(
      2
    );
    expect(
      document.querySelector('[data-slot="frame-header"]')
    ).toBeInTheDocument();
    expect(screen.getByText("Title A")).toHaveAttribute(
      "data-slot",
      "frame-title"
    );
    expect(screen.getByText("Description A")).toHaveAttribute(
      "data-slot",
      "frame-description"
    );
    expect(screen.getByText("Footer A")).toHaveAttribute(
      "data-slot",
      "frame-footer"
    );
  });

  it("sets data-stacked='true' when stacked", () => {
    render(<Fixture stacked />);
    expect(document.querySelector('[data-slot="frame"]')).toHaveAttribute(
      "data-stacked",
      "true"
    );
  });

  it("sets data-dense='true' when dense", () => {
    render(<Fixture dense />);
    expect(document.querySelector('[data-slot="frame"]')).toHaveAttribute(
      "data-dense",
      "true"
    );
  });

  it("drops the outer border under variant='ghost'", () => {
    render(<Fixture variant="ghost" />);
    const root = document.querySelector('[data-slot="frame"]');
    expect(root).toHaveAttribute("data-variant", "ghost");
    expect(root).toHaveClass("bg-transparent");
    expect(root).not.toHaveClass("border");
  });

  it("forwards className onto the root element", () => {
    render(
      <Frame className="custom-frame">
        <FramePanel>panel</FramePanel>
      </Frame>
    );
    expect(document.querySelector('[data-slot="frame"]')).toHaveClass(
      "custom-frame"
    );
  });
});
