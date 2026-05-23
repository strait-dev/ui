import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Shell } from "./shell";

describe("Shell", () => {
  it("renders with data-slot='shell'", () => {
    const { container } = render(<Shell>Content</Shell>);
    const shell = container.querySelector("[data-slot='shell']");
    expect(shell).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<Shell>Hello shell</Shell>);
    expect(screen.getByText("Hello shell")).toBeInTheDocument();
  });

  it("renders a div element", () => {
    const { container } = render(<Shell>Content</Shell>);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("applies default variant classes", () => {
    const { container } = render(<Shell>Content</Shell>);
    const shell = container.querySelector("[data-slot='shell']");
    expect(shell).toHaveClass("flex");
    expect(shell).toHaveClass("flex-col");
  });

  it("applies centered variant", () => {
    const { container } = render(<Shell variant="centered">Content</Shell>);
    const shell = container.querySelector("[data-slot='shell']");
    expect(shell).toHaveClass("items-center");
  });

  it("applies fluid variant", () => {
    const { container } = render(<Shell variant="fluid">Content</Shell>);
    const shell = container.querySelector("[data-slot='shell']");
    expect(shell).toHaveClass("w-full");
  });

  it("accepts and applies custom className", () => {
    const { container } = render(<Shell className="my-custom">Content</Shell>);
    const shell = container.querySelector("[data-slot='shell']");
    expect(shell).toHaveClass("my-custom");
  });
});
