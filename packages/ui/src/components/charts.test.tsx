import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { BarChart, LineChart, MapChart, PieChart } from "./charts";

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

const lineBarData = [
  { month: "Jan", revenue: 4000, cost: 2400 },
  { month: "Feb", revenue: 3000, cost: 1398 },
  { month: "Mar", revenue: 5000, cost: 2800 },
];

const pieData = [
  { name: "Chrome", value: 60 },
  { name: "Firefox", value: 25 },
  { name: "Safari", value: 15 },
];

describe("LineChart", () => {
  it("renders with data-slot='line-chart'", () => {
    render(
      <LineChart
        categories={["revenue", "cost"]}
        data={lineBarData}
        index="month"
      />
    );
    expect(
      document.querySelector("[data-slot='line-chart']")
    ).toBeInTheDocument();
  });

  it("renders without throwing with minimal props", () => {
    expect(() =>
      render(
        <LineChart categories={["revenue"]} data={lineBarData} index="month" />
      )
    ).not.toThrow();
  });

  it("accepts valueFormatter without throwing", () => {
    expect(() =>
      render(
        <LineChart
          categories={["revenue"]}
          data={lineBarData}
          index="month"
          valueFormatter={(v) => `$${v}`}
        />
      )
    ).not.toThrow();
  });
});

describe("BarChart", () => {
  it("renders with data-slot='bar-chart'", () => {
    render(
      <BarChart
        categories={["revenue", "cost"]}
        data={lineBarData}
        index="month"
      />
    );
    expect(
      document.querySelector("[data-slot='bar-chart']")
    ).toBeInTheDocument();
  });

  it("renders without throwing with layout='vertical'", () => {
    expect(() =>
      render(
        <BarChart
          categories={["revenue"]}
          data={lineBarData}
          index="month"
          layout="vertical"
        />
      )
    ).not.toThrow();
  });

  it("accepts custom colors without throwing", () => {
    expect(() =>
      render(
        <BarChart
          categories={["revenue"]}
          colors={["#ff0000", "#00ff00"]}
          data={lineBarData}
          index="month"
        />
      )
    ).not.toThrow();
  });
});

describe("PieChart", () => {
  it("renders with data-slot='pie-chart'", () => {
    render(<PieChart category="value" data={pieData} index="name" />);
    expect(
      document.querySelector("[data-slot='pie-chart']")
    ).toBeInTheDocument();
  });

  it("renders without throwing", () => {
    expect(() =>
      render(<PieChart category="value" data={pieData} index="name" />)
    ).not.toThrow();
  });

  it("accepts custom colors without throwing", () => {
    expect(() =>
      render(
        <PieChart
          category="value"
          colors={["#ff0000", "#00ff00", "#0000ff"]}
          data={pieData}
          index="name"
        />
      )
    ).not.toThrow();
  });
});

describe("MapChart", () => {
  it("renders with data-slot='map-chart'", () => {
    render(<MapChart />);
    expect(
      document.querySelector("[data-slot='map-chart']")
    ).toBeInTheDocument();
  });

  it("renders the placeholder message", () => {
    const { getByText } = render(<MapChart />);
    expect(
      getByText("Map chart component not implemented yet")
    ).toBeInTheDocument();
  });
});
