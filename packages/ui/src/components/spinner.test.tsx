import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("renders with role status and aria-label Loading", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status", { name: "Loading" });
    expect(spinner).toBeInTheDocument();
  });

  it("has the spinner data-slot attribute", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("data-slot", "spinner");
  });

  it("includes the animate-spin class by default", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass("animate-spin");
  });

  it("merges a custom className", () => {
    render(<Spinner className="text-primary" />);
    expect(screen.getByRole("status")).toHaveClass("text-primary");
  });

  it("accepts aria-label override", () => {
    render(<Spinner aria-label="Saving" />);
    expect(screen.getByRole("status", { name: "Saving" })).toBeInTheDocument();
  });

  // ── size variant ──────────────────────────────────────────────────────────

  it("renders size-4 (default) when no size prop is given", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveClass("size-4");
  });

  it("renders size-3 for size='xs'", () => {
    render(<Spinner size="xs" />);
    expect(screen.getByRole("status")).toHaveClass("size-3");
  });

  it("renders size-3.5 for size='sm'", () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole("status")).toHaveClass("size-3.5");
  });

  it("renders size-4 for size='default'", () => {
    render(<Spinner size="default" />);
    expect(screen.getByRole("status")).toHaveClass("size-4");
  });

  it("renders size-6 for size='lg'", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("size-6");
  });

  it("renders size-8 for size='xl'", () => {
    render(<Spinner size="xl" />);
    expect(screen.getByRole("status")).toHaveClass("size-8");
  });

  it("className can override size by adding extra classes alongside the variant", () => {
    // Consumers can still force an arbitrary size by passing className
    render(<Spinner className="text-muted-foreground" size="sm" />);
    const el = screen.getByRole("status");
    expect(el).toHaveClass("size-3.5");
    expect(el).toHaveClass("text-muted-foreground");
  });
});
