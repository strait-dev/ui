import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityFeed, type ActivityItem } from "./activity-feed";
import { getStatusConfig } from "./status-badge";

const baseItems: ActivityItem[] = [
  {
    id: "1",
    status: "completed",
    title: "Deployment succeeded",
    timestamp: new Date(Date.now() - 60_000),
    description: "prod-us-east-1",
  },
  {
    id: "2",
    status: "running",
    title: "Build started",
    timestamp: new Date(Date.now() - 120_000),
  },
  {
    id: "3",
    title: "No status item",
  },
];

describe("ActivityFeed", () => {
  it("has data-slot='activity-feed' on the root", () => {
    render(<ActivityFeed items={baseItems} />);
    expect(
      document.querySelector("[data-slot='activity-feed']")
    ).toBeInTheDocument();
  });

  it("renders one activity-feed-item row per item", () => {
    render(<ActivityFeed items={baseItems} />);
    const rows = document.querySelectorAll("[data-slot='activity-feed-item']");
    expect(rows).toHaveLength(baseItems.length);
  });

  it("renders each item's title text", () => {
    render(<ActivityFeed items={baseItems} />);
    expect(screen.getByText("Deployment succeeded")).toBeInTheDocument();
    expect(screen.getByText("Build started")).toBeInTheDocument();
    expect(screen.getByText("No status item")).toBeInTheDocument();
  });

  it("renders a relative time containing 'ago' for a timestamp", () => {
    const item: ActivityItem = {
      id: "ts-test",
      title: "Timestamp item",
      timestamp: new Date(Date.now() - 60_000),
    };
    render(<ActivityFeed items={[item]} />);
    // formatDistanceToNow with addSuffix: true produces e.g. "1 minute ago"
    const timeEl = screen.getByText(/ago/i);
    expect(timeEl).toBeInTheDocument();
  });

  it("accepts a string timestamp and renders a relative time", () => {
    const item: ActivityItem = {
      id: "str-ts",
      title: "String timestamp item",
      timestamp: new Date(Date.now() - 120_000).toISOString(),
    };
    render(<ActivityFeed items={[item]} />);
    expect(screen.getByText(/ago/i)).toBeInTheDocument();
  });

  it("shows the default empty state when items is empty", () => {
    render(<ActivityFeed items={[]} />);
    expect(screen.getByText(/no activity yet/i)).toBeInTheDocument();
  });

  it("shows a custom emptyState when provided and items is empty", () => {
    render(<ActivityFeed emptyState={<p>Nothing here</p>} items={[]} />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.queryByText(/no activity yet/i)).not.toBeInTheDocument();
  });

  it("uses renderItem escape hatch when provided", () => {
    const item: ActivityItem = { id: "custom", title: "Custom title" };
    render(
      <ActivityFeed
        items={[item]}
        renderItem={(i) => (
          <div
            data-slot="activity-feed-item"
            data-testid="custom-row"
            key={i.id}
          >
            custom-{String(i.id)}
          </div>
        )}
      />
    );
    expect(screen.getByTestId("custom-row")).toBeInTheDocument();
    expect(screen.getByText("custom-custom")).toBeInTheDocument();
    // Default renderer is NOT used
    expect(screen.queryByText("Custom title")).not.toBeInTheDocument();
  });

  it("status dot reflects 'completed' status via getStatusConfig", () => {
    const item: ActivityItem = {
      id: "dot-completed",
      status: "completed",
      title: "Completed item",
    };
    render(<ActivityFeed items={[item]} />);
    const row = document.querySelector("[data-slot='activity-feed-item']");
    expect(row).not.toBeNull();
    const dot = row?.querySelector("span[aria-hidden='true']");
    expect(dot).not.toBeNull();
    const { dotClassName } = getStatusConfig("completed");
    // dotClassName is "bg-success" — assert each class token is present
    for (const cls of dotClassName.split(" ")) {
      expect(dot).toHaveClass(cls);
    }
  });

  it("status dot reflects 'running' status (animated info dot)", () => {
    const item: ActivityItem = {
      id: "dot-running",
      status: "running",
      title: "Running item",
    };
    render(<ActivityFeed items={[item]} />);
    const row = document.querySelector("[data-slot='activity-feed-item']");
    const dot = row?.querySelector("span[aria-hidden='true']");
    expect(dot).not.toBeNull();
    const { dotClassName } = getStatusConfig("running");
    for (const cls of dotClassName.split(" ")) {
      expect(dot).toHaveClass(cls);
    }
  });

  it("falls back to neutral dot when no status is provided", () => {
    const item: ActivityItem = { id: "no-status", title: "No status" };
    render(<ActivityFeed items={[item]} />);
    const row = document.querySelector("[data-slot='activity-feed-item']");
    const dot = row?.querySelector("span[aria-hidden='true']");
    expect(dot).not.toBeNull();
    // getStatusConfig("") returns DEFAULT_STATUS_CONFIG with dotClassName "bg-muted-foreground"
    const { dotClassName } = getStatusConfig("");
    for (const cls of dotClassName.split(" ")) {
      expect(dot).toHaveClass(cls);
    }
  });

  it("renders the description when provided", () => {
    render(<ActivityFeed items={baseItems} />);
    expect(screen.getByText("prod-us-east-1")).toBeInTheDocument();
  });

  it("does not crash when no description or timestamp is provided", () => {
    const item: ActivityItem = { id: "bare", title: "Bare item" };
    render(<ActivityFeed items={[item]} />);
    expect(screen.getByText("Bare item")).toBeInTheDocument();
  });
});
