import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "./timeline";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function TimelineFixture({
  value,
  onValueChange,
}: {
  value?: number;
  onValueChange?: (v: number) => void;
}) {
  return (
    <Timeline onValueChange={onValueChange} value={value}>
      <TimelineItem step={1}>
        <TimelineHeader>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineDate>Jan 1</TimelineDate>
        </TimelineHeader>
        <TimelineTitle>Step One</TimelineTitle>
        <TimelineContent>First step description.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={2}>
        <TimelineHeader>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineDate>Jan 2</TimelineDate>
        </TimelineHeader>
        <TimelineTitle>Step Two</TimelineTitle>
        <TimelineContent>Second step description.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={3}>
        <TimelineHeader>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineDate>Jan 3</TimelineDate>
        </TimelineHeader>
        <TimelineTitle>Step Three</TimelineTitle>
        <TimelineContent>Third step description.</TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}

// ---------------------------------------------------------------------------
// Existing baseline tests
// ---------------------------------------------------------------------------

describe("Timeline", () => {
  it("renders root with data-slot and default orientation", () => {
    render(<TimelineFixture value={1} />);
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-slot", "timeline");
    expect(root).toHaveAttribute("data-orientation", "vertical");
  });

  it("renders items with data-slot timeline-item", () => {
    render(<TimelineFixture value={1} />);
    const items = document.querySelectorAll("[data-slot=timeline-item]");
    expect(items.length).toBe(3);
  });

  it("marks completed steps with data-completed", () => {
    render(<TimelineFixture value={2} />);
    const items = document.querySelectorAll("[data-slot=timeline-item]");
    // step 1 and 2 should be completed (step <= activeStep=2)
    expect(items[0]).toHaveAttribute("data-completed", "true");
    expect(items[1]).toHaveAttribute("data-completed", "true");
    // step 3 should not be completed
    expect(items[2]).not.toHaveAttribute("data-completed");
  });

  it("renders title and content parts with data-slots", () => {
    render(<TimelineFixture value={1} />);
    expect(screen.getByText("Step One")).toHaveAttribute(
      "data-slot",
      "timeline-title"
    );
    expect(screen.getByText("First step description.")).toHaveAttribute(
      "data-slot",
      "timeline-content"
    );
  });

  it("renders separator and indicator with data-slots", () => {
    render(<TimelineFixture value={1} />);
    const separators = document.querySelectorAll(
      "[data-slot=timeline-separator]"
    );
    expect(separators.length).toBeGreaterThan(0);
    const indicators = document.querySelectorAll(
      "[data-slot=timeline-indicator]"
    );
    expect(indicators.length).toBeGreaterThan(0);
  });

  it("renders horizontal orientation", () => {
    render(
      <Timeline orientation="horizontal" value={1}>
        <TimelineItem step={1}>
          <TimelineTitle>H Step</TimelineTitle>
        </TimelineItem>
      </Timeline>
    );
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-orientation", "horizontal");
  });

  // ---------------------------------------------------------------------------
  // Controlled vs uncontrolled
  // ---------------------------------------------------------------------------

  it("controlled: respects value prop without internal state change", () => {
    const { rerender } = render(<TimelineFixture value={1} />);
    let items = document.querySelectorAll("[data-slot=timeline-item]");
    expect(items[0]).toHaveAttribute("data-completed", "true");
    expect(items[1]).not.toHaveAttribute("data-completed");

    rerender(<TimelineFixture value={3} />);
    items = document.querySelectorAll("[data-slot=timeline-item]");
    expect(items[2]).toHaveAttribute("data-completed", "true");
  });

  it("uncontrolled: uses defaultValue and internal state", () => {
    render(
      <Timeline defaultValue={2}>
        <TimelineItem step={1}>
          <TimelineTitle>A</TimelineTitle>
        </TimelineItem>
        <TimelineItem step={2}>
          <TimelineTitle>B</TimelineTitle>
        </TimelineItem>
        <TimelineItem step={3}>
          <TimelineTitle>C</TimelineTitle>
        </TimelineItem>
      </Timeline>
    );
    const items = document.querySelectorAll("[data-slot=timeline-item]");
    expect(items[0]).toHaveAttribute("data-completed", "true");
    expect(items[1]).toHaveAttribute("data-completed", "true");
    expect(items[2]).not.toHaveAttribute("data-completed");
  });

  // ---------------------------------------------------------------------------
  // line axis (solid | dotted)
  // ---------------------------------------------------------------------------

  it("defaults to data-line=solid on root", () => {
    render(<TimelineFixture value={1} />);
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-line", "solid");
  });

  it("sets data-line=dotted on root when line=dotted", () => {
    render(
      <Timeline line="dotted" value={1}>
        <TimelineItem step={1}>
          <TimelineSeparator />
          <TimelineTitle>Step</TimelineTitle>
        </TimelineItem>
      </Timeline>
    );
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-line", "dotted");
  });

  it("sets data-line=solid on root when line=solid", () => {
    render(
      <Timeline line="solid" value={1}>
        <TimelineItem step={1}>
          <TimelineSeparator />
          <TimelineTitle>Step</TimelineTitle>
        </TimelineItem>
      </Timeline>
    );
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-line", "solid");
  });

  // ---------------------------------------------------------------------------
  // variant axis
  // ---------------------------------------------------------------------------

  it("defaults to data-variant=primary on root", () => {
    render(<TimelineFixture value={1} />);
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-variant", "primary");
  });

  it("sets data-variant=success on root when variant=success", () => {
    render(
      <Timeline value={1} variant="success">
        <TimelineItem step={1}>
          <TimelineTitle>Step</TimelineTitle>
        </TimelineItem>
      </Timeline>
    );
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-variant", "success");
  });

  it.each([
    "info",
    "warning",
    "destructive",
  ] as const)("sets data-variant=%s on root", (variant) => {
    render(
      <Timeline value={1} variant={variant}>
        <TimelineItem step={1}>
          <TimelineTitle>Step</TimelineTitle>
        </TimelineItem>
      </Timeline>
    );
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-variant", variant);
  });

  // ---------------------------------------------------------------------------
  // size axis
  // ---------------------------------------------------------------------------

  it("defaults to data-size=default on root", () => {
    render(<TimelineFixture value={1} />);
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-size", "default");
  });

  it("sets data-size=sm on root when size=sm", () => {
    render(
      <Timeline size="sm" value={1}>
        <TimelineItem step={1}>
          <TimelineTitle>Step</TimelineTitle>
        </TimelineItem>
      </Timeline>
    );
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-size", "sm");
  });

  it("sets data-size=default on root when size=default", () => {
    render(
      <Timeline size="default" value={1}>
        <TimelineItem step={1}>
          <TimelineTitle>Step</TimelineTitle>
        </TimelineItem>
      </Timeline>
    );
    const root = document.querySelector("[data-slot=timeline]");
    expect(root).toHaveAttribute("data-size", "default");
  });

  // ---------------------------------------------------------------------------
  // icon-in-indicator
  // ---------------------------------------------------------------------------

  it("renders an svg inside the indicator when icon prop is provided", () => {
    // jsdom: HugeiconsIcon resolves icons to undefined; assert svg presence via
    // container.querySelector("svg") per project conventions.
    const { container } = render(
      <Timeline value={1}>
        <TimelineItem step={1}>
          <TimelineIndicator icon={CheckmarkCircle01Icon} />
        </TimelineItem>
      </Timeline>
    );

    const indicator = container.querySelector("[data-slot=timeline-indicator]");
    expect(indicator).not.toBeNull();
    // HugeiconsIcon renders an <svg> wrapper even in jsdom
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("renders children alongside icon inside indicator", () => {
    const { container } = render(
      <Timeline value={1}>
        <TimelineItem step={1}>
          <TimelineIndicator icon={CheckmarkCircle01Icon}>
            <span data-testid="child-span">●</span>
          </TimelineIndicator>
        </TimelineItem>
      </Timeline>
    );

    expect(container.querySelector("[data-testid=child-span]")).not.toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders children inside indicator without icon", () => {
    render(
      <Timeline value={1}>
        <TimelineItem step={1}>
          <TimelineIndicator>
            <span data-testid="indicator-child">✓</span>
          </TimelineIndicator>
        </TimelineItem>
      </Timeline>
    );
    expect(screen.getByTestId("indicator-child")).not.toBeNull();
  });
});
