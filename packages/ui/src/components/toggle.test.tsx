import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toggle, toggleVariants } from "./toggle";

describe("Toggle", () => {
  it("renders a button with the toggle data-slot", () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("data-slot", "toggle");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles aria-pressed when clicked", async () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    const button = screen.getByRole("button", { name: "Bold" });
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onPressedChange with the new pressed state", async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" onPressedChange={onPressedChange}>
        B
      </Toggle>
    );
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("applies outline variant classes when variant is outline", () => {
    render(
      <Toggle aria-label="Italic" variant="outline">
        I
      </Toggle>
    );
    expect(screen.getByRole("button", { name: "Italic" })).toHaveClass(
      "border",
      "border-input"
    );
  });

  it("does not toggle while disabled", async () => {
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" disabled onPressedChange={onPressedChange}>
        B
      </Toggle>
    );
    const button = screen.getByRole("button", { name: "Bold" });
    await userEvent.click(button);
    expect(onPressedChange).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("exposes a toggleVariants helper", () => {
    expect(toggleVariants({ size: "lg" })).toContain("h-9");
    expect(toggleVariants({ variant: "outline" })).toContain("border-input");
  });
});
