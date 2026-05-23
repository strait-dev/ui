import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import {
  MetricCard,
  MetricCardDelta,
  MetricCardHeader,
  MetricCardSparkline,
  MetricCardValue,
} from "./metric-card";

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

describe("MetricCard", () => {
  it("renders with data-slot='metric-card'", () => {
    render(<MetricCard title="Revenue" value="$48,295" />);
    expect(
      document.querySelector("[data-slot='metric-card']")
    ).toBeInTheDocument();
  });

  it("renders the title text", () => {
    const { getByText } = render(
      <MetricCard title="Active Users" value="1,284" />
    );
    expect(getByText("Active Users")).toBeInTheDocument();
  });

  it("renders the value text", () => {
    const { getByText } = render(
      <MetricCard title="Revenue" value="$12,345" />
    );
    expect(getByText("$12,345")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    const { getByText } = render(
      <MetricCard
        description="Last 30 days."
        title="Conversions"
        value="4.6%"
      />
    );
    expect(getByText("Last 30 days.")).toBeInTheDocument();
  });

  it("renders the sparkline when data is provided", () => {
    render(
      <MetricCard data={[10, 20, 15, 30, 25]} title="Views" value="8,000" />
    );
    expect(
      document.querySelector("[data-slot='metric-card-sparkline']")
    ).toBeInTheDocument();
  });

  it("does not render the sparkline when data is not provided", () => {
    render(<MetricCard title="Views" value="8,000" />);
    expect(
      document.querySelector("[data-slot='metric-card-sparkline']")
    ).not.toBeInTheDocument();
  });

  it("does not render the delta when not provided", () => {
    render(<MetricCard title="Views" value="8,000" />);
    expect(
      document.querySelector("[data-slot='metric-card-delta']")
    ).not.toBeInTheDocument();
  });

  it("renders children inside the card", () => {
    const { getByText } = render(
      <MetricCard title="Test" value="42">
        <span>extra content</span>
      </MetricCard>
    );
    expect(getByText("extra content")).toBeInTheDocument();
  });
});

describe("MetricCard delta", () => {
  it("renders positive delta with text-success-accent class", () => {
    render(<MetricCard delta={{ value: 12 }} title="Revenue" value="$48k" />);
    const delta = document.querySelector("[data-slot='metric-card-delta']");
    expect(delta).toBeInTheDocument();
    expect(delta).toHaveClass("text-success-accent");
  });

  it("renders negative delta with text-destructive-accent class", () => {
    render(<MetricCard delta={{ value: -3 }} title="Churn" value="3.2%" />);
    const delta = document.querySelector("[data-slot='metric-card-delta']");
    expect(delta).toBeInTheDocument();
    expect(delta).toHaveClass("text-destructive-accent");
  });

  it("renders positive delta with a + prefix", () => {
    const { getByText } = render(
      <MetricCard delta={{ value: 5 }} title="Revenue" value="$48k" />
    );
    expect(getByText("+5%")).toBeInTheDocument();
  });

  it("renders negative delta without + prefix", () => {
    const { getByText } = render(
      <MetricCard delta={{ value: -3 }} title="Churn" value="3%" />
    );
    expect(getByText("-3%")).toBeInTheDocument();
  });

  it("respects an explicit direction override", () => {
    render(
      <MetricCard
        delta={{ value: 5, direction: "down" }}
        title="Errors"
        value="10"
      />
    );
    const delta = document.querySelector("[data-slot='metric-card-delta']");
    expect(delta).toHaveClass("text-destructive-accent");
  });

  it("renders delta label when provided", () => {
    const { getByText } = render(
      <MetricCard
        delta={{ value: 5, label: "vs last month" }}
        title="Revenue"
        value="$48k"
      />
    );
    expect(getByText("vs last month")).toBeInTheDocument();
  });
});

describe("MetricCardHeader", () => {
  it("renders with data-slot='metric-card-header'", () => {
    render(<MetricCardHeader title="Revenue" />);
    expect(
      document.querySelector("[data-slot='metric-card-header']")
    ).toBeInTheDocument();
  });

  it("renders the title", () => {
    const { getByText } = render(<MetricCardHeader title="Page Views" />);
    expect(getByText("Page Views")).toBeInTheDocument();
  });
});

describe("MetricCardValue", () => {
  it("renders with data-slot='metric-card-value'", () => {
    render(<MetricCardValue>$42</MetricCardValue>);
    expect(
      document.querySelector("[data-slot='metric-card-value']")
    ).toBeInTheDocument();
  });

  it("renders children", () => {
    const { getByText } = render(<MetricCardValue>$42</MetricCardValue>);
    expect(getByText("$42")).toBeInTheDocument();
  });
});

describe("MetricCardDelta", () => {
  it("renders with data-slot='metric-card-delta'", () => {
    render(<MetricCardDelta value={5} />);
    expect(
      document.querySelector("[data-slot='metric-card-delta']")
    ).toBeInTheDocument();
  });

  it("applies text-success-accent for positive value", () => {
    render(<MetricCardDelta value={10} />);
    expect(
      document.querySelector("[data-slot='metric-card-delta']")
    ).toHaveClass("text-success-accent");
  });

  it("applies text-destructive-accent for negative value", () => {
    render(<MetricCardDelta value={-5} />);
    expect(
      document.querySelector("[data-slot='metric-card-delta']")
    ).toHaveClass("text-destructive-accent");
  });

  it("applies text-success-accent for zero", () => {
    render(<MetricCardDelta value={0} />);
    expect(
      document.querySelector("[data-slot='metric-card-delta']")
    ).toHaveClass("text-success-accent");
  });
});

describe("MetricCardSparkline", () => {
  it("renders with data-slot='metric-card-sparkline'", () => {
    render(<MetricCardSparkline data={[10, 20, 15]} />);
    expect(
      document.querySelector("[data-slot='metric-card-sparkline']")
    ).toBeInTheDocument();
  });

  it("renders without throwing with empty data", () => {
    expect(() => render(<MetricCardSparkline data={[]} />)).not.toThrow();
  });
});

describe("MetricCard size='sm'", () => {
  it("adds data-size='sm' on the root card element", () => {
    render(<MetricCard size="sm" title="Compact" value="42" />);
    const card = document.querySelector("[data-slot='metric-card']");
    expect(card).toHaveAttribute("data-size", "sm");
  });

  it("value uses text-xl class when size is sm", () => {
    render(<MetricCard size="sm" title="Compact" value="42" />);
    const val = document.querySelector("[data-slot='metric-card-value']");
    expect(val).toHaveClass("text-xl");
  });

  it("default size keeps text-2xl class", () => {
    render(<MetricCard title="Normal" value="42" />);
    const val = document.querySelector("[data-slot='metric-card-value']");
    expect(val).toHaveClass("text-2xl");
  });
});

describe("MetricCard neutral delta", () => {
  it("neutral direction applies text-muted-foreground", () => {
    render(
      <MetricCard
        delta={{ value: 0, direction: "neutral" }}
        title="Flat"
        value="100"
      />
    );
    const delta = document.querySelector("[data-slot='metric-card-delta']");
    expect(delta).toHaveClass("text-muted-foreground");
  });

  it("neutral direction does not apply success or destructive accent class", () => {
    render(
      <MetricCard
        delta={{ value: 0, direction: "neutral" }}
        title="Flat"
        value="100"
      />
    );
    const delta = document.querySelector("[data-slot='metric-card-delta']");
    expect(delta).not.toHaveClass("text-success-accent");
    expect(delta).not.toHaveClass("text-destructive-accent");
  });

  it("MetricCardDelta with direction='neutral' applies text-muted-foreground", () => {
    render(<MetricCardDelta direction="neutral" value={0} />);
    const delta = document.querySelector("[data-slot='metric-card-delta']");
    expect(delta).toHaveClass("text-muted-foreground");
  });
});
