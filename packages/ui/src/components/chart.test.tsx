import { fireEvent, render, renderHook } from "@testing-library/react";
import { BarChart } from "recharts";
import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  CHART_COLORS,
  Chart,
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartSeriesSelector,
  ChartStyle,
  ChartTooltip,
  constructCategoryColors,
  DEFAULT_COLORS,
  getColorValue,
  getPayloadConfigFromPayload,
  useChart,
  valueToPercent,
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
  revenue: { label: "Revenue", color: "chart-1" },
  cost: { label: "Cost", color: "#ff8800" },
};

const data = [
  { month: "Jan", revenue: 4000, cost: 2400 },
  { month: "Feb", revenue: 3000, cost: 1398 },
];

describe("ChartContainer", () => {
  it("renders with data-slot='chart' and a data-chart attribute", () => {
    render(
      <ChartContainer config={chartConfig}>
        <BarChart data={data} />
      </ChartContainer>
    );
    const root = document.querySelector("[data-slot='chart']");
    expect(root).toBeInTheDocument();
    expect(root?.getAttribute("data-chart")).toMatch(/^chart-/);
  });

  it("injects a <style> with resolved color variables", () => {
    const { container } = render(
      <ChartContainer config={chartConfig}>
        <BarChart data={data} />
      </ChartContainer>
    );
    const style = container.querySelector("style");
    expect(style?.innerHTML).toContain("--color-revenue: var(--chart-1)");
    expect(style?.innerHTML).toContain("--color-cost: #ff8800");
  });
});

describe("Chart", () => {
  it("renders with data-slot='chart'", () => {
    render(
      <Chart config={chartConfig} data={data} dataKey="month">
        <BarChart data={data} />
      </Chart>
    );
    expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("accepts controlled and uncontrolled selection props", () => {
    expect(() =>
      render(
        <Chart
          config={chartConfig}
          data={data}
          dataKey="month"
          onSelectedSeriesChange={() => undefined}
          selectedSeries="revenue"
        >
          <BarChart data={data} />
        </Chart>
      )
    ).not.toThrow();
    expect(() =>
      render(
        <Chart
          config={chartConfig}
          data={data}
          dataKey="month"
          defaultSelectedSeries="cost"
        >
          <BarChart data={data} />
        </Chart>
      )
    ).not.toThrow();
  });
});

describe("ChartStyle", () => {
  it("renders nothing when no series declares a color", () => {
    const { container } = render(
      <ChartStyle config={{ plain: { label: "Plain" } }} id="c" />
    );
    expect(container.querySelector("style")).not.toBeInTheDocument();
  });

  it("renders a style element when colors are present", () => {
    const { container } = render(<ChartStyle config={chartConfig} id="c" />);
    expect(container.querySelector("style")).toBeInTheDocument();
  });
});

describe("re-exports", () => {
  it("exposes the recharts tooltip and legend wrappers", () => {
    expect(ChartTooltip).toBeDefined();
    expect(ChartLegend).toBeDefined();
  });
});

describe("useChart", () => {
  it("throws when used outside a chart root", () => {
    expect(() => renderHook(() => useChart())).toThrow(
      /must be used within a <Chart/
    );
  });
});

describe("color helpers", () => {
  it("maps token keys to their CSS variable", () => {
    expect(getColorValue("chart-1")).toBe("var(--chart-1)");
    expect(getColorValue("chart-5")).toBe(CHART_COLORS["chart-5"]);
  });

  it("passes raw colors through and falls back when empty", () => {
    expect(getColorValue("#abc")).toBe("#abc");
    expect(getColorValue()).toBe("var(--chart-1)");
  });

  it("constructs a cycling category → color map", () => {
    const map = constructCategoryColors(["a", "b", "c"], DEFAULT_COLORS);
    expect(map.get("a")).toBe("chart-1");
    expect(map.get("b")).toBe("chart-2");
  });

  it("formats ratios as integer percentages", () => {
    expect(valueToPercent(0.42)).toBe("42%");
    expect(valueToPercent(1)).toBe("100%");
  });
});

describe("ChartSeriesSelector", () => {
  const selectorConfig: ChartConfig = {
    revenue: { label: "Revenue", color: "chart-1" },
    expenses: { label: "Expenses", color: "chart-2" },
  };
  const selectorData = [
    { month: "Jan", revenue: 100, expenses: 40 },
    { month: "Feb", revenue: 200, expenses: 60 },
  ];

  it("renders one toggle per configured series", () => {
    const { getByText, container } = render(
      <ChartSeriesSelector config={selectorConfig} />
    );
    expect(getByText("Revenue")).toBeInTheDocument();
    expect(getByText("Expenses")).toBeInTheDocument();
    expect(
      container.querySelectorAll("[data-slot='chart-series-selector-item']")
    ).toHaveLength(2);
  });

  it("tags the root with data-slot and a toolbar role", () => {
    const { container } = render(
      <ChartSeriesSelector config={selectorConfig} />
    );
    const root = container.querySelector("[data-slot='chart-series-selector']");
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("role", "toolbar");
  });

  it("reflects the controlled value via aria-pressed", () => {
    const { getByRole } = render(
      <ChartSeriesSelector config={selectorConfig} value="revenue" />
    );
    expect(getByRole("button", { name: /revenue/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(getByRole("button", { name: /expenses/i })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("fires onValueChange with the clicked series key", () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(
      <ChartSeriesSelector
        config={selectorConfig}
        onValueChange={onValueChange}
        value={null}
      />
    );
    fireEvent.click(getByRole("button", { name: /expenses/i }));
    expect(onValueChange).toHaveBeenCalledWith("expenses");
  });

  it("clears the selection when the active series is clicked again", () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(
      <ChartSeriesSelector
        config={selectorConfig}
        onValueChange={onValueChange}
        value="revenue"
      />
    );
    fireEvent.click(getByRole("button", { name: /revenue/i }));
    expect(onValueChange).toHaveBeenCalledWith(null);
  });

  it("keeps the active series when allowDeselect is false", () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(
      <ChartSeriesSelector
        allowDeselect={false}
        config={selectorConfig}
        onValueChange={onValueChange}
        value="revenue"
      />
    );
    fireEvent.click(getByRole("button", { name: /revenue/i }));
    expect(onValueChange).toHaveBeenCalledWith("revenue");
  });

  it("manages its own state when uncontrolled", () => {
    const { getByRole } = render(
      <ChartSeriesSelector config={selectorConfig} defaultValue={null} />
    );
    const expenses = getByRole("button", { name: /expenses/i });
    expect(expenses).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(expenses);
    expect(expenses).toHaveAttribute("aria-pressed", "true");
  });

  it("renders per-series totals summed from data when showTotal", () => {
    const { getByText } = render(
      <ChartSeriesSelector
        config={selectorConfig}
        data={selectorData}
        showTotal
        valueFormatter={(v) => `$${v}`}
      />
    );
    expect(getByText("$300")).toBeInTheDocument();
    expect(getByText("$100")).toBeInTheDocument();
  });

  it("restricts and orders series via the series prop", () => {
    const { container, queryByText } = render(
      <ChartSeriesSelector config={selectorConfig} series={["expenses"]} />
    );
    expect(
      container.querySelectorAll("[data-slot='chart-series-selector-item']")
    ).toHaveLength(1);
    expect(queryByText("Revenue")).not.toBeInTheDocument();
  });
});

describe("getPayloadConfigFromPayload", () => {
  it("resolves a config entry from the nested payload row", () => {
    const resolved = getPayloadConfigFromPayload(
      chartConfig,
      { dataKey: "revenue", payload: { revenue: 1 } },
      "revenue"
    );
    expect(resolved).toBe(chartConfig.revenue);
  });

  it("returns undefined for non-object payloads", () => {
    expect(
      getPayloadConfigFromPayload(chartConfig, null, "revenue")
    ).toBeUndefined();
  });
});
