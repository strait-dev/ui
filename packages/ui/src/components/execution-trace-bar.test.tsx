import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExecutionTraceBar } from "./execution-trace-bar";

const twoEqualSegments = [
  { label: "Alpha", value: 50 },
  { label: "Beta", value: 50 },
];

const fourSegments = [
  { label: "Queue", value: 12 },
  { label: "Execution", value: 340 },
  { label: "Serialization", value: 28 },
  { label: "Network", value: 45 },
];

describe("ExecutionTraceBar", () => {
  it("renders the root bar with the correct data-slot", () => {
    render(<ExecutionTraceBar segments={twoEqualSegments} />);
    expect(
      document.querySelector('[data-slot="execution-trace-bar"]')
    ).toBeInTheDocument();
  });

  it("renders one visible segment div per segment above the 0.5% threshold", () => {
    render(<ExecutionTraceBar segments={twoEqualSegments} />);
    const segments = document.querySelectorAll(
      '[data-slot="execution-trace-bar-segment"]'
    );
    expect(segments).toHaveLength(2);
  });

  it("skips rendering segments whose width is below 0.5%", () => {
    const segmentsWithTiny = [
      { label: "Big", value: 999 },
      { label: "Tiny", value: 1 }, // 0.1% → below threshold
    ];
    render(<ExecutionTraceBar segments={segmentsWithTiny} total={1000} />);
    const segments = document.querySelectorAll(
      '[data-slot="execution-trace-bar-segment"]'
    );
    // Only "Big" is rendered (99.9%); "Tiny" at 0.1% is skipped
    expect(segments).toHaveLength(1);
  });

  it("assigns ~50% width to each segment when two segments share equal values", () => {
    render(<ExecutionTraceBar segments={twoEqualSegments} />);
    const segments = document.querySelectorAll(
      '[data-slot="execution-trace-bar-segment"]'
    );
    for (const seg of segments) {
      const width = (seg as HTMLElement).style.width;
      expect(width).toBe("50%");
    }
  });

  it("computes proportional widths from a known total override", () => {
    const segs = [
      { label: "A", value: 25 },
      { label: "B", value: 75 },
    ];
    render(<ExecutionTraceBar segments={segs} total={100} />);
    const segments = document.querySelectorAll(
      '[data-slot="execution-trace-bar-segment"]'
    );
    expect((segments[0] as HTMLElement).style.width).toBe("25%");
    expect((segments[1] as HTMLElement).style.width).toBe("75%");
  });

  it("renders the legend with data-slot by default", () => {
    render(<ExecutionTraceBar segments={twoEqualSegments} />);
    expect(
      document.querySelector('[data-slot="execution-trace-bar-legend"]')
    ).toBeInTheDocument();
  });

  it("renders a legend entry for every segment, including sub-threshold ones", () => {
    const segmentsWithTiny = [
      { label: "Big", value: 999 },
      { label: "Tiny", value: 1 },
    ];
    render(<ExecutionTraceBar segments={segmentsWithTiny} total={1000} />);
    // Both labels appear in the legend even if "Tiny" is not in the bar
    expect(screen.getByText("Big")).toBeInTheDocument();
    expect(screen.getByText("Tiny")).toBeInTheDocument();
  });

  it("hides the legend when showLegend is false", () => {
    render(
      <ExecutionTraceBar segments={twoEqualSegments} showLegend={false} />
    );
    expect(
      document.querySelector('[data-slot="execution-trace-bar-legend"]')
    ).not.toBeInTheDocument();
  });

  it("applies formatValue in the legend", () => {
    render(
      <ExecutionTraceBar
        formatValue={(n) => `${n}ms`}
        segments={fourSegments}
      />
    );
    // Each formatted value should appear in the legend
    expect(screen.getByText("12ms")).toBeInTheDocument();
    expect(screen.getByText("340ms")).toBeInTheDocument();
  });

  it("renders all four segment labels in the legend", () => {
    render(<ExecutionTraceBar segments={fourSegments} />);
    for (const seg of fourSegments) {
      expect(screen.getByText(seg.label)).toBeInTheDocument();
    }
  });

  it("applies custom per-segment colors as inline background-color", () => {
    const coloredSegments = [
      { label: "Red", value: 50, color: "#ff0000" },
      { label: "Blue", value: 50, color: "#0000ff" },
    ];
    render(<ExecutionTraceBar segments={coloredSegments} />);
    const segments = document.querySelectorAll(
      '[data-slot="execution-trace-bar-segment"]'
    );
    expect((segments[0] as HTMLElement).style.backgroundColor).toBe(
      "rgb(255, 0, 0)"
    );
    expect((segments[1] as HTMLElement).style.backgroundColor).toBe(
      "rgb(0, 0, 255)"
    );
  });

  // --- size axis ---

  it("default size applies h-6 class to the bar track", () => {
    render(<ExecutionTraceBar segments={twoEqualSegments} />);
    const bar = document.querySelector('[data-slot="execution-trace-bar"]');
    expect(bar).toHaveClass("h-6");
  });

  it("size='sm' applies h-3 class to the bar track", () => {
    render(<ExecutionTraceBar segments={twoEqualSegments} size="sm" />);
    const bar = document.querySelector('[data-slot="execution-trace-bar"]');
    expect(bar).toHaveClass("h-3");
  });

  it("size='lg' applies h-9 class to the bar track", () => {
    render(<ExecutionTraceBar segments={twoEqualSegments} size="lg" />);
    const bar = document.querySelector('[data-slot="execution-trace-bar"]');
    expect(bar).toHaveClass("h-9");
  });

  it("size prop is forwarded as data-size attribute on the bar track", () => {
    render(<ExecutionTraceBar segments={twoEqualSegments} size="lg" />);
    const bar = document.querySelector('[data-slot="execution-trace-bar"]');
    expect(bar).toHaveAttribute("data-size", "lg");
  });
});
