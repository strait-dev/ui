import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders an input carrying the input data-slot", () => {
    render(<Input placeholder="Email" />);
    const input = screen.getByPlaceholderText("Email");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("data-slot", "input");
  });

  it("default size applies h-8", () => {
    render(<Input placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toHaveClass("h-8");
  });

  it("size='sm' applies h-7", () => {
    render(<Input placeholder="Email" size="sm" />);
    expect(screen.getByPlaceholderText("Email")).toHaveClass("h-7");
  });

  it("size='lg' applies h-9", () => {
    render(<Input placeholder="Email" size="lg" />);
    expect(screen.getByPlaceholderText("Email")).toHaveClass("h-9");
  });

  it("forwards the type attribute", () => {
    render(<Input placeholder="Password" type="password" />);
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("merges a custom className with the base styles", () => {
    render(<Input className="max-w-xs" placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toHaveClass(
      "max-w-xs",
      "rounded-lg"
    );
  });

  it("reflects the aria-invalid state", () => {
    render(<Input aria-invalid placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("accepts typed text", async () => {
    render(<Input placeholder="Email" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Email");
    await userEvent.type(input, "hello@strait.dev");
    expect(input).toHaveValue("hello@strait.dev");
  });

  it("does not accept input while disabled", async () => {
    render(<Input disabled placeholder="Email" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Email");
    expect(input).toBeDisabled();
    await userEvent.type(input, "nope");
    expect(input).toHaveValue("");
  });
});
