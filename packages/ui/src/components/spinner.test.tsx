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
    render(<Spinner className="size-6" />);
    expect(screen.getByRole("status")).toHaveClass("size-6");
  });

  it("accepts aria-label override", () => {
    render(<Spinner aria-label="Saving" />);
    expect(screen.getByRole("status", { name: "Saving" })).toBeInTheDocument();
  });
});
