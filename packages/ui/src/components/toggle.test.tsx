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

  it("applies outline emphasis classes when emphasis is outline", () => {
    render(
      <Toggle aria-label="Italic" emphasis="outline">
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
    expect(toggleVariants({ emphasis: "outline" })).toContain("border-input");
  });

  /* ------------------------------------------------------------------ */
  /* Size variant — xs and xl                                            */
  /* ------------------------------------------------------------------ */

  it("applies xs size class when size=xs", () => {
    render(
      <Toggle aria-label="Extra small" size="xs">
        X
      </Toggle>
    );
    expect(screen.getByRole("button", { name: "Extra small" })).toHaveClass(
      "h-6"
    );
  });

  it("applies xl size class when size=xl", () => {
    render(
      <Toggle aria-label="Extra large" size="xl">
        XL
      </Toggle>
    );
    expect(screen.getByRole("button", { name: "Extra large" })).toHaveClass(
      "h-10"
    );
  });

  it("toggleVariants emits xs and xl size classes", () => {
    expect(toggleVariants({ size: "xs" })).toContain("h-6");
    expect(toggleVariants({ size: "xl" })).toContain("h-10");
  });

  /* ------------------------------------------------------------------ */
  /* Variant axis                                                        */
  /* ------------------------------------------------------------------ */

  it("includes destructive pressed class when variant=destructive", () => {
    const classes = toggleVariants({ variant: "destructive" });
    expect(classes).toContain("aria-pressed:bg-destructive");
  });

  it("includes success pressed class when variant=success", () => {
    const classes = toggleVariants({ variant: "success" });
    expect(classes).toContain("aria-pressed:bg-success");
  });

  it("includes warning pressed class when variant=warning", () => {
    const classes = toggleVariants({ variant: "warning" });
    expect(classes).toContain("aria-pressed:bg-warning");
  });

  it("includes info pressed class when variant=info", () => {
    const classes = toggleVariants({ variant: "info" });
    expect(classes).toContain("aria-pressed:bg-info");
  });
});
