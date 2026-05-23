import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InputWithInlineButton } from "./input-with-inline-button";

describe("InputWithInlineButton", () => {
  it("renders the wrapper with data-slot='input-with-inline-button'", () => {
    render(<InputWithInlineButton buttonText="Subscribe" />);
    expect(
      document.querySelector("[data-slot='input-with-inline-button']")
    ).toBeInTheDocument();
  });

  it("renders a text button with the buttonText label", () => {
    render(<InputWithInlineButton buttonText="Go" />);
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("button defaults to type='submit'", () => {
    render(<InputWithInlineButton buttonText="Submit" />);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "type",
      "submit"
    );
  });

  it("respects buttonType override", () => {
    render(<InputWithInlineButton buttonText="Reset" buttonType="reset" />);
    expect(screen.getByRole("button", { name: "Reset" })).toHaveAttribute(
      "type",
      "reset"
    );
  });

  it("calls onButtonClick when the button is clicked", async () => {
    const onButtonClick = vi.fn();
    render(
      <InputWithInlineButton buttonText="Go" onButtonClick={onButtonClick} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it("uses buttonAriaLabel when provided", () => {
    render(
      <InputWithInlineButton
        buttonAriaLabel="Subscribe to newsletter"
        buttonText="Subscribe"
      />
    );
    expect(
      screen.getByRole("button", { name: "Subscribe to newsletter" })
    ).toBeInTheDocument();
  });

  it("renders a custom button node when button prop is given", () => {
    render(
      <InputWithInlineButton button={<button type="button">Custom</button>} />
    );
    expect(screen.getByRole("button", { name: "Custom" })).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='button-container']")
    ).toBeInTheDocument();
  });

  it("accepts user input in the text field", async () => {
    render(<InputWithInlineButton buttonText="Search" placeholder="Search…" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Search…");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("disables the input when disabled prop is set", () => {
    render(<InputWithInlineButton buttonText="Go" disabled placeholder="q" />);
    expect(screen.getByPlaceholderText("q")).toBeDisabled();
  });
});
