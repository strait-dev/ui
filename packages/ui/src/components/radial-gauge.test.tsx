import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { RadialGauge } from "./radial-gauge";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  window.matchMedia ||= (q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
});

describe("RadialGauge", () => {
  it("renders with data-slot='radial-gauge'", () => {
    render(
      <div style={{ width: 160, height: 160 }}>
        <RadialGauge value={50} />
      </div>
    );
    expect(
      document.querySelector("[data-slot='radial-gauge']")
    ).toBeInTheDocument();
  });

  it("shows the rounded percentage in the center by default", () => {
    const { getByText } = render(
      <div style={{ width: 160, height: 160 }}>
        <RadialGauge value={65} />
      </div>
    );
    expect(getByText("65%")).toBeInTheDocument();
  });

  it("rounds the center percentage correctly", () => {
    const { getByText } = render(
      <div style={{ width: 160, height: 160 }}>
        <RadialGauge value={66.6} />
      </div>
    );
    // 66.6% rounds to 67%
    expect(getByText("67%")).toBeInTheDocument();
  });

  it("renders a custom centerLabel instead of the percentage", () => {
    const { getByText, queryByText } = render(
      <div style={{ width: 160, height: 160 }}>
        <RadialGauge centerLabel={<span>Custom</span>} value={50} />
      </div>
    );
    expect(getByText("Custom")).toBeInTheDocument();
    expect(queryByText("50%")).not.toBeInTheDocument();
  });

  it("renders the label beneath the center", () => {
    const { getByText } = render(
      <div style={{ width: 160, height: 160 }}>
        <RadialGauge label="CPU Usage" value={40} />
      </div>
    );
    expect(getByText("CPU Usage")).toBeInTheDocument();
  });

  it("clamps value above max to 100%", () => {
    const { getByText } = render(
      <div style={{ width: 160, height: 160 }}>
        <RadialGauge max={100} value={150} />
      </div>
    );
    expect(getByText("100%")).toBeInTheDocument();
  });

  it("clamps negative value to 0%", () => {
    const { getByText } = render(
      <div style={{ width: 160, height: 160 }}>
        <RadialGauge value={-10} />
      </div>
    );
    expect(getByText("0%")).toBeInTheDocument();
  });

  it("renders without throwing for a value at the danger threshold", () => {
    expect(() =>
      render(
        <div style={{ width: 160, height: 160 }}>
          <RadialGauge value={91} />
        </div>
      )
    ).not.toThrow();
  });

  it("renders without throwing for a value at the warning threshold", () => {
    expect(() =>
      render(
        <div style={{ width: 160, height: 160 }}>
          <RadialGauge value={72} />
        </div>
      )
    ).not.toThrow();
  });

  it("renders without throwing with a custom max", () => {
    expect(() =>
      render(
        <div style={{ width: 160, height: 160 }}>
          <RadialGauge label="Requests/s" max={200} value={140} />
        </div>
      )
    ).not.toThrow();
  });

  it("renders without throwing with an explicit color", () => {
    expect(() =>
      render(
        <div style={{ width: 160, height: 160 }}>
          <RadialGauge color="var(--chart-3)" value={55} />
        </div>
      )
    ).not.toThrow();
  });

  it("renders without throwing with custom thresholds", () => {
    expect(() =>
      render(
        <div style={{ width: 160, height: 160 }}>
          <RadialGauge thresholds={{ warning: 30, danger: 60 }} value={45} />
        </div>
      )
    ).not.toThrow();
  });

  it("applies a custom className to the wrapper", () => {
    render(
      <div style={{ width: 160, height: 160 }}>
        <RadialGauge className="custom-class" value={50} />
      </div>
    );
    const wrapper = document.querySelector("[data-slot='radial-gauge']");
    expect(wrapper).toHaveClass("custom-class");
  });
});
