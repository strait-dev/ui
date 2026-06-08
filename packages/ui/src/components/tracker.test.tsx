import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { Tracker, type TrackerBlockProps } from "./tracker";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const blocks: TrackerBlockProps[] = [
  { status: "success", tooltip: "Operational" },
  { status: "warning", tooltip: "Degraded" },
  { status: "destructive", tooltip: "Outage" },
];

describe("Tracker", () => {
  it("renders the tracker root", () => {
    const { container } = render(<Tracker data={blocks} />);
    expect(
      container.querySelector("[data-slot='tracker']")
    ).toBeInTheDocument();
  });

  it("renders one block per data entry", () => {
    const { container } = render(<Tracker data={blocks} />);
    expect(
      container.querySelectorAll("[data-slot='tracker-block']")
    ).toHaveLength(blocks.length);
  });

  it("applies the semantic status class", () => {
    const { container } = render(<Tracker data={[{ status: "success" }]} />);
    const block = container.querySelector("[data-slot='tracker-block']");
    expect(block?.className).toContain("bg-success");
  });

  it("keeps color as a custom class escape hatch", () => {
    const { container } = render(<Tracker data={[{ color: "bg-brand" }]} />);
    const block = container.querySelector("[data-slot='tracker-block']");
    expect(block?.className).toContain("bg-brand");
  });

  it("falls back to a default status when no color is given", () => {
    const { container } = render(<Tracker data={[{}]} disabledTooltip />);
    const block = container.querySelector("[data-slot='tracker-block']");
    expect(block?.className).toContain("bg-secondary");
  });

  it("keeps defaultBackgroundColor as a custom fallback escape hatch", () => {
    const { container } = render(
      <Tracker data={[{}]} defaultBackgroundColor="bg-brand" disabledTooltip />
    );
    const block = container.querySelector("[data-slot='tracker-block']");
    expect(block?.className).toContain("bg-brand");
  });

  it("renders without throwing when tooltips are disabled", () => {
    expect(() =>
      render(<Tracker data={blocks} disabledTooltip />)
    ).not.toThrow();
  });

  it("forwards className to the root", () => {
    const { container } = render(
      <Tracker className="custom-tracker" data={blocks} />
    );
    expect(
      container.querySelector("[data-slot='tracker']")?.className
    ).toContain("custom-tracker");
  });
});
