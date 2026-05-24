import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a textarea carrying the textarea data-slot", () => {
    render(<Textarea placeholder="Bio" />);
    const textarea = screen.getByPlaceholderText("Bio");
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("data-slot", "textarea");
  });

  it("accepts typed text", async () => {
    render(<Textarea placeholder="Bio" />);
    const textarea = screen.getByPlaceholderText<HTMLTextAreaElement>("Bio");
    await userEvent.type(textarea, "Hello world");
    expect(textarea).toHaveValue("Hello world");
  });

  it("reflects the aria-invalid state", () => {
    render(<Textarea aria-invalid placeholder="Bio" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("does not accept input while disabled", async () => {
    render(<Textarea disabled placeholder="Bio" />);
    const textarea = screen.getByPlaceholderText<HTMLTextAreaElement>("Bio");
    expect(textarea).toBeDisabled();
    await userEvent.type(textarea, "nope");
    expect(textarea).toHaveValue("");
  });

  it("is associated with a label via htmlFor", () => {
    render(
      <>
        <label htmlFor="bio">Bio</label>
        <Textarea id="bio" placeholder="Tell us…" />
      </>
    );
    expect(screen.getByLabelText("Bio")).toHaveAttribute(
      "data-slot",
      "textarea"
    );
  });

  it("merges a custom className with the base styles", () => {
    render(<Textarea className="max-w-md" placeholder="Bio" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveClass(
      "max-w-md",
      "rounded-lg"
    );
  });

  // ------------------------------------------------------------------
  // size variant
  // ------------------------------------------------------------------

  it("applies min-h-16 class for size=sm", () => {
    render(<Textarea placeholder="Bio" size="sm" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveClass("min-h-16");
  });

  it("applies min-h-16 class for size=default (unchanged baseline)", () => {
    render(<Textarea placeholder="Bio" size="default" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveClass("min-h-16");
  });

  it("applies min-h-32 class for size=lg", () => {
    render(<Textarea placeholder="Bio" size="lg" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveClass("min-h-32");
  });

  it("defaults to size=default when size prop is omitted", () => {
    render(<Textarea placeholder="Bio" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveClass("min-h-16");
  });

  // ------------------------------------------------------------------
  // resize variant
  // ------------------------------------------------------------------

  it("applies resize-none class for resize=none", () => {
    render(<Textarea placeholder="Bio" resize="none" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveClass("resize-none");
  });

  it("applies resize-y class for resize=vertical", () => {
    render(<Textarea placeholder="Bio" resize="vertical" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveClass("resize-y");
  });

  it("applies resize class for resize=auto", () => {
    render(<Textarea placeholder="Bio" resize="auto" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveClass("resize");
  });

  it("defaults to resize=vertical when resize prop is omitted", () => {
    render(<Textarea placeholder="Bio" />);
    expect(screen.getByPlaceholderText("Bio")).toHaveClass("resize-y");
  });

  // ------------------------------------------------------------------
  // Combined axes
  // ------------------------------------------------------------------

  it("combines size=lg and resize=none correctly", () => {
    render(<Textarea placeholder="Bio" resize="none" size="lg" />);
    const textarea = screen.getByPlaceholderText("Bio");
    expect(textarea).toHaveClass("min-h-32");
    expect(textarea).toHaveClass("resize-none");
  });

  // ------------------------------------------------------------------
  // native rows attr is unaffected
  // ------------------------------------------------------------------

  it("forwards the native rows attribute without interference", () => {
    render(<Textarea placeholder="Bio" rows={8} />);
    expect(screen.getByPlaceholderText("Bio")).toHaveAttribute("rows", "8");
  });
});
