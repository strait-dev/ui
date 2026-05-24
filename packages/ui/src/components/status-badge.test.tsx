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
    expect(STATUS_CONFIG.completed?.variant).toBe("success-light");
    expect(formatStatusLabel("dead_letter")).toBe("Dead letter");
  });

  /* ------------------------------------------------------------------ */
  /* pulse                                                               */
  /* ------------------------------------------------------------------ */

  it("renders an animate-ping sibling when pulse=true", () => {
    const { container } = render(<StatusBadge pulse status="running" />);
    const pingEl = container.querySelector(".animate-ping");
    expect(pingEl).toBeInTheDocument();
    // The solid dot is still present
    expect(
      container.querySelector("[data-slot='status-badge-dot']")
    ).toBeInTheDocument();
  });

  it("does not render an animate-ping element without pulse", () => {
    const { container } = render(<StatusBadge status="running" />);
    expect(container.querySelector(".animate-ping")).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /* dotOnly                                                             */
  /* ------------------------------------------------------------------ */

  it("hides the text label when dotOnly=true", () => {
    render(<StatusBadge dotOnly status="completed" />);
    expect(screen.queryByText("Completed")).toBeNull();
  });

  it("sets aria-label to the humanised status when dotOnly=true", () => {
    render(<StatusBadge dotOnly status="timed_out" />);
    const badge = document.querySelector("[data-slot='status-badge']");
    expect(badge).toHaveAttribute("aria-label", "Timed out");
  });

  it("still renders the dot when dotOnly=true", () => {
    render(<StatusBadge dotOnly status="running" />);
    expect(
      document.querySelector("[data-slot='status-badge-dot']")
    ).toBeInTheDocument();
  });

  it("allows aria-label override when dotOnly=true", () => {
    render(
      <StatusBadge aria-label="Job is running" dotOnly status="running" />
    );
    const badge = document.querySelector("[data-slot='status-badge']");
    expect(badge).toHaveAttribute("aria-label", "Job is running");
  });

  /* ------------------------------------------------------------------ */
  /* dot size scales with badge size                                     */
  /* ------------------------------------------------------------------ */

  it("applies size-1 dot class for xs badge size", () => {
    const { container } = render(<StatusBadge size="xs" status="running" />);
    const dot = container.querySelector("[data-slot='status-badge-dot']");
    expect(dot).toHaveClass("size-1");
  });

  it("applies size-2.5 dot class for xl badge size", () => {
    const { container } = render(<StatusBadge size="xl" status="running" />);
    const dot = container.querySelector("[data-slot='status-badge-dot']");
    expect(dot).toHaveClass("size-2.5");
  });

  /* ------------------------------------------------------------------ */
  /* New STATUS_CONFIG entries                                           */
  /* ------------------------------------------------------------------ */

  it("maps retrying to warning-light with animate-pulse dot", () => {
    const config = getStatusConfig("retrying");
    expect(config.variant).toBe("warning-light");
    expect(config.dotClassName).toContain("animate-pulse");
  });

  it("maps scheduled to info-light", () => {
    expect(getStatusConfig("scheduled").variant).toBe("info-light");
  });

  it("maps blocked to destructive-light", () => {
    expect(getStatusConfig("blocked").variant).toBe("destructive-light");
  });

  it("maps draft to secondary-light", () => {
    expect(getStatusConfig("draft").variant).toBe("secondary-light");
  });

  it("maps archived to secondary-light", () => {
    expect(getStatusConfig("archived").variant).toBe("secondary-light");
  });

  it("maps disabled to secondary-light", () => {
    expect(getStatusConfig("disabled").variant).toBe("secondary-light");
  });

  it("maps unknown to secondary-light", () => {
    expect(getStatusConfig("unknown").variant).toBe("secondary-light");
  });

  it("maps partial to warning-light", () => {
    expect(getStatusConfig("partial").variant).toBe("warning-light");
  });

  it("maps partial_success to warning-light", () => {
    expect(getStatusConfig("partial_success").variant).toBe("warning-light");
  });
});
