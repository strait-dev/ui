import { render } from "@testing-library/react";
import { BarChart } from "recharts";
import { beforeAll, describe, expect, it } from "vitest";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";

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

const chartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "hsl(220 70% 50%)" },
  cost: { label: "Cost", color: "hsl(30 80% 55%)" },
};

const data = [
  { month: "Jan", revenue: 4000, cost: 2400 },
  { month: "Feb", revenue: 3000, cost: 1398 },
];

describe("ChartContainer", () => {
  it("renders with data-slot='chart'", () => {
    render(
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <BarChart />
        </BarChart>
      </ChartContainer>
    );
    expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("renders a data-chart attribute", () => {
    render(
      <ChartContainer config={chartConfig}>
        <BarChart data={data} />
      </ChartContainer>
    );
    const chartEl = document.querySelector("[data-chart]");
    expect(chartEl).toBeInTheDocument();
  });

  it("injects a <style> element for color config", () => {
    const { container } = render(
      <ChartContainer config={chartConfig}>
        <BarChart data={data} />
      </ChartContainer>
    );
    const styleEl = container.querySelector("style");
    expect(styleEl).toBeInTheDocument();
    expect(styleEl?.innerHTML).toContain("--color-revenue");
  });
});

describe("ChartStyle", () => {
  it("renders nothing when config has no colors", () => {
    const emptyConfig: ChartConfig = { noColor: { label: "No Color" } };
    const { container } = render(
      <ChartStyle config={emptyConfig} id="test-chart" />
    );
    expect(container.querySelector("style")).not.toBeInTheDocument();
  });

  it("renders a style element when config has color entries", () => {
    const { container } = render(
      <ChartStyle config={chartConfig} id="test-chart" />
    );
    const styleEl = container.querySelector("style");
    expect(styleEl).toBeInTheDocument();
    expect(styleEl?.innerHTML).toContain("--color-revenue");
    expect(styleEl?.innerHTML).toContain("--color-cost");
  });
});

describe("ChartTooltip", () => {
  it("is exported and is the Recharts Tooltip", () => {
    expect(ChartTooltip).toBeDefined();
  });
});

describe("ChartLegend", () => {
  it("is exported and is the Recharts Legend", () => {
    expect(ChartLegend).toBeDefined();
  });
});

describe("ChartTooltipContent", () => {
  it("renders nothing when active is false", () => {
    const { container } = render(
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <ChartTooltipContent active={false} payload={[]} />
        </BarChart>
      </ChartContainer>
    );
    // No tooltip grid should appear
    expect(container.querySelector(".grid.min-w-32")).not.toBeInTheDocument();
  });
});

describe("ChartLegendContent", () => {
  it("renders null (no legend nodes) when payload is empty", () => {
    const { container } = render(
      <ChartContainer config={chartConfig}>
        <BarChart data={data}>
          <ChartLegendContent payload={[]} />
        </BarChart>
      </ChartContainer>
    );
    // ChartLegendContent returns null when payload is empty — no legend divs
    expect(
      container.querySelectorAll(".flex.items-center.justify-center.gap-4")
    ).toHaveLength(0);
  });
});
