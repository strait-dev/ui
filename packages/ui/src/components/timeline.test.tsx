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
});
