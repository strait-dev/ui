import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import type { ChartConfig } from "./chart";
import { AreaChart, BarChart, DonutChart, LineChart, PieChart } from "./charts";

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

const salesData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 5000, expenses: 2800 },
];

const salesConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "chart-1" },
  expenses: { label: "Expenses", color: "chart-2" },
};

const pieData = [
  { name: "Chrome", value: 60 },
  { name: "Firefox", value: 25 },
  { name: "Safari", value: 15 },
];

const pieConfig: ChartConfig = {
  Chrome: { label: "Chrome", color: "chart-1" },
  Firefox: { label: "Firefox", color: "chart-2" },
  Safari: { label: "Safari", color: "chart-3" },
};

describe("AreaChart", () => {
  it("renders the chart root", () => {
    render(<AreaChart config={salesConfig} data={salesData} dataKey="month" />);
    expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("injects per-series color CSS variables", () => {
    const { container } = render(
      <AreaChart config={salesConfig} data={salesData} dataKey="month" />
    );
    const style = container.querySelector("style");
    expect(style?.innerHTML).toContain("--color-revenue");
    expect(style?.innerHTML).toContain("--color-expenses");
  });

  it("renders without throwing for every fill type", () => {
    for (const fillType of ["gradient", "solid", "none"] as const) {
      expect(() =>
        render(
          <AreaChart
            config={salesConfig}
            data={salesData}
            dataKey="month"
            fillType={fillType}
          />
        )
      ).not.toThrow();
    }
  });

  it("renders without throwing when stacked / percent", () => {
    for (const type of ["stacked", "percent"] as const) {
      expect(() =>
        render(
          <AreaChart
            config={salesConfig}
            data={salesData}
            dataKey="month"
            type={type}
          />
        )
      ).not.toThrow();
    }
  });

  it("accepts controlled and uncontrolled selection without throwing", () => {
    expect(() =>
      render(
        <AreaChart
          config={salesConfig}
          data={salesData}
          dataKey="month"
          onSelectedSeriesChange={() => undefined}
          selectedSeries="revenue"
        />
      )
    ).not.toThrow();
    expect(() =>
      render(
        <AreaChart
          config={salesConfig}
          data={salesData}
          dataKey="month"
          defaultSelectedSeries="expenses"
        />
      )
    ).not.toThrow();
  });
});

describe("BarChart", () => {
  it("renders the chart root", () => {
    render(<BarChart config={salesConfig} data={salesData} dataKey="month" />);
    expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("renders without throwing for vertical layout", () => {
    expect(() =>
      render(
        <BarChart
          config={salesConfig}
          data={salesData}
          dataKey="month"
          layout="vertical"
        />
      )
    ).not.toThrow();
  });

  it("renders without throwing when stacked", () => {
    expect(() =>
      render(
        <BarChart
          config={salesConfig}
          data={salesData}
          dataKey="month"
          type="stacked"
        />
      )
    ).not.toThrow();
  });

  it("injects per-series color CSS variables", () => {
    const { container } = render(
      <BarChart config={salesConfig} data={salesData} dataKey="month" />
    );
    const style = container.querySelector("style");
    expect(style?.innerHTML).toContain("--color-revenue");
    expect(style?.innerHTML).toContain("--color-expenses");
  });

  it("accepts a controlled selectedSeries without throwing", () => {
    expect(() =>
      render(
        <BarChart
          config={salesConfig}
          data={salesData}
          dataKey="month"
          onSelectedSeriesChange={() => undefined}
          selectedSeries="expenses"
        />
      )
    ).not.toThrow();
  });
});

describe("LineChart", () => {
  it("renders the chart root", () => {
    render(<LineChart config={salesConfig} data={salesData} dataKey="month" />);
    expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("accepts a valueFormatter without throwing", () => {
    expect(() =>
      render(
        <LineChart
          config={salesConfig}
          data={salesData}
          dataKey="month"
          valueFormatter={(v) => `$${v}`}
        />
      )
    ).not.toThrow();
  });

  it("injects per-series color CSS variables", () => {
    const { container } = render(
      <LineChart config={salesConfig} data={salesData} dataKey="month" />
    );
    const style = container.querySelector("style");
    expect(style?.innerHTML).toContain("--color-revenue");
    expect(style?.innerHTML).toContain("--color-expenses");
  });
});

describe("PieChart", () => {
  it("renders the chart root", () => {
    render(
      <PieChart
        config={pieConfig}
        data={pieData}
        dataKey="value"
        nameKey="name"
      />
    );
    expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("renders without throwing with custom colors", () => {
    expect(() =>
      render(
        <PieChart
          colors={["chart-3", "chart-4", "chart-5"]}
          config={pieConfig}
          data={pieData}
          dataKey="value"
          nameKey="name"
        />
      )
    ).not.toThrow();
  });

  it("injects per-slice color CSS variables", () => {
    const { container } = render(
      <PieChart
        config={pieConfig}
        data={pieData}
        dataKey="value"
        nameKey="name"
      />
    );
    const style = container.querySelector("style");
    expect(style?.innerHTML).toContain("--color-Chrome");
    expect(style?.innerHTML).toContain("--color-Safari");
  });
});

describe("DonutChart", () => {
  it("renders the chart root", () => {
    render(
      <DonutChart
        config={pieConfig}
        data={pieData}
        dataKey="value"
        nameKey="name"
      />
    );
    expect(document.querySelector("[data-slot='chart']")).toBeInTheDocument();
  });

  it("renders without throwing with a custom centre label", () => {
    expect(() =>
      render(
        <DonutChart
          config={pieConfig}
          data={pieData}
          dataKey="value"
          label="Total"
          nameKey="name"
        />
      )
    ).not.toThrow();
  });

  it("renders without throwing when the centre label is hidden", () => {
    expect(() =>
      render(
        <DonutChart
          config={pieConfig}
          data={pieData}
          dataKey="value"
          nameKey="name"
          showLabel={false}
        />
      )
    ).not.toThrow();
  });
});
