import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import {
  AreaChart,
  BarChart,
  ComboChart,
  DonutChart,
  LineChart,
  MapChart,
  PieChart,
} from "./charts";

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

describe("BarChart stacked", () => {
  it("renders with data-slot='bar-chart' when stacked", () => {
    render(
      <BarChart
        categories={["revenue", "expenses"]}
        data={lineBarData}
        index="month"
        stacked
      />
    );
    expect(
      document.querySelector("[data-slot='bar-chart']")
    ).toBeInTheDocument();
  });

  it("renders without throwing with stacked=false (default)", () => {
    expect(() =>
      render(
        <BarChart
          categories={["revenue"]}
          data={lineBarData}
          index="month"
          stacked={false}
        />
      )
    ).not.toThrow();
  });
});

describe("AreaChart", () => {
  it("renders with data-slot='area-chart'", () => {
    render(
      <AreaChart
        categories={["revenue", "cost"]}
        data={lineBarData}
        index="month"
      />
    );
    expect(
      document.querySelector("[data-slot='area-chart']")
    ).toBeInTheDocument();
  });

  it("renders without throwing with stacked=true", () => {
    expect(() =>
      render(
        <AreaChart
          categories={["revenue", "cost"]}
          data={lineBarData}
          index="month"
          stacked
        />
      )
    ).not.toThrow();
  });

  it("accepts fillOpacity without throwing", () => {
    expect(() =>
      render(
        <AreaChart
          categories={["revenue"]}
          data={lineBarData}
          fillOpacity={0.4}
          index="month"
        />
      )
    ).not.toThrow();
  });
});

describe("DonutChart", () => {
  it("renders with data-slot='donut-chart'", () => {
    render(<DonutChart category="value" data={pieData} index="name" />);
    expect(
      document.querySelector("[data-slot='donut-chart']")
    ).toBeInTheDocument();
  });

  it("renders without throwing", () => {
    expect(() =>
      render(<DonutChart category="value" data={pieData} index="name" />)
    ).not.toThrow();
  });

  it("renders a center label when provided", () => {
    const { getByText } = render(
      <DonutChart
        category="value"
        centerLabel={<span>Total</span>}
        data={pieData}
        index="name"
      />
    );
    expect(getByText("Total")).toBeInTheDocument();
  });

  it("accepts custom innerRadius and outerRadius without throwing", () => {
    expect(() =>
      render(
        <DonutChart
          category="value"
          data={pieData}
          index="name"
          innerRadius={40}
          outerRadius={70}
        />
      )
    ).not.toThrow();
  });
});

describe("ComboChart", () => {
  it("renders with data-slot='combo-chart'", () => {
    render(
      <ComboChart
        barCategories={["revenue"]}
        data={lineBarData}
        index="month"
        lineCategories={["cost"]}
      />
    );
    expect(
      document.querySelector("[data-slot='combo-chart']")
    ).toBeInTheDocument();
  });

  it("renders without throwing with rightAxis=false", () => {
    expect(() =>
      render(
        <ComboChart
          barCategories={["revenue"]}
          data={lineBarData}
          index="month"
          lineCategories={["cost"]}
          rightAxis={false}
        />
      )
    ).not.toThrow();
  });

  it("renders without throwing with multiple bar and line categories", () => {
    expect(() =>
      render(
        <ComboChart
          barCategories={["revenue", "cost"]}
          data={lineBarData}
          index="month"
          lineCategories={["revenue"]}
        />
      )
    ).not.toThrow();
  });
});
