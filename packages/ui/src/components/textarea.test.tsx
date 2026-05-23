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
});
