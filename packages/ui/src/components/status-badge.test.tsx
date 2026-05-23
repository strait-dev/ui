import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  formatStatusLabel,
  getStatusConfig,
  STATUS_CONFIG,
  StatusBadge,
} from "./status-badge";

describe("StatusBadge", () => {
  it("renders with data-slot='status-badge'", () => {
    render(<StatusBadge status="running" />);
    expect(
      document.querySelector("[data-slot='status-badge']")
    ).toBeInTheDocument();
  });

  it("humanises the status into the label", () => {
    render(<StatusBadge status="timed_out" />);
    expect(screen.getByText("Timed out")).toBeInTheDocument();
  });

  it("derives the variant from the status (info-light for running)", () => {
    render(<StatusBadge status="running" />);
    expect(screen.getByText("Running")).toHaveClass("bg-info/10");
  });

  it("uses the destructive variant for failures", () => {
    render(<StatusBadge status="failed" />);
    expect(screen.getByText("Failed")).toHaveClass("bg-destructive/10");
  });

  it("renders a decorative dot by default and hides it on demand", () => {
    const { rerender } = render(<StatusBadge status="completed" />);
    expect(
      document.querySelector("[data-slot='status-badge-dot']")
    ).toBeInTheDocument();
    rerender(<StatusBadge showDot={false} status="completed" />);
    expect(
      document.querySelector("[data-slot='status-badge-dot']")
    ).not.toBeInTheDocument();
  });

  it("accepts a custom label and variant override", () => {
    render(<StatusBadge label="Done" status="completed" variant="outline" />);
    const badge = screen.getByText("Done");
    expect(badge).toHaveClass("border-border");
  });

  it("falls back to a neutral config for unknown statuses", () => {
    const config = getStatusConfig("totally-unknown");
    expect(config.variant).toBe("secondary-light");
  });

  it("exposes the status map and label helper", () => {
    expect(STATUS_CONFIG.completed.variant).toBe("success-light");
    expect(formatStatusLabel("dead_letter")).toBe("Dead letter");
  });
});
