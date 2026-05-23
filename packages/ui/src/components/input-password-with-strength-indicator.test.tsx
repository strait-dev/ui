import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { InputPasswordWithStrengthIndicator } from "./input-password-with-strength-indicator";

describe("InputPasswordWithStrengthIndicator", () => {
  it("renders the wrapper with the correct data-slot", () => {
    render(<InputPasswordWithStrengthIndicator />);
    expect(
      document.querySelector(
        "[data-slot='input-password-with-strength-indicator']"
      )
    ).toBeInTheDocument();
  });

  it("starts with type='password'", () => {
    render(<InputPasswordWithStrengthIndicator placeholder="Password" />);
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("renders the toggle button with aria-label='Show password'", () => {
    render(<InputPasswordWithStrengthIndicator />);
    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toBeInTheDocument();
  });

  it("toggle button starts with aria-pressed=false", () => {
    render(<InputPasswordWithStrengthIndicator />);
    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("reveals password after clicking the toggle", async () => {
    render(<InputPasswordWithStrengthIndicator placeholder="Password" />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "text"
    );
  });

  it("changes toggle aria-label to 'Hide password' when visible", async () => {
    render(<InputPasswordWithStrengthIndicator />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toBeInTheDocument();
  });

  it("renders a label element when label prop is provided", () => {
    render(<InputPasswordWithStrengthIndicator id="pw" label="Password" />);
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='label']")).toBeInTheDocument();
  });

  it("does not render a label when label prop is omitted", () => {
    render(<InputPasswordWithStrengthIndicator />);
    expect(
      document.querySelector("[data-slot='label']")
    ).not.toBeInTheDocument();
  });

  it("does not show the strength indicator before focus", () => {
    render(<InputPasswordWithStrengthIndicator />);
    expect(
      document.querySelector("[data-slot='strength-indicator']")
    ).not.toBeInTheDocument();
  });

  it("shows strength indicator after focus and typing", async () => {
    render(<InputPasswordWithStrengthIndicator placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    await userEvent.click(input);
    await userEvent.type(input, "Abc1");
    expect(
      document.querySelector("[data-slot='strength-indicator']")
    ).toBeInTheDocument();
  });

  it("renders the progress bar with role='progressbar'", async () => {
    render(<InputPasswordWithStrengthIndicator placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    await userEvent.click(input);
    await userEvent.type(input, "A1b");
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders requirement list after interaction", async () => {
    render(<InputPasswordWithStrengthIndicator placeholder="Password" />);
    const input = screen.getByPlaceholderText("Password");
    await userEvent.click(input);
    await userEvent.type(input, "Test1");
    expect(
      screen.getByRole("list", { name: "Password requirements" })
    ).toBeInTheDocument();
  });

  it("hides strength indicator when showStrengthIndicator=false", async () => {
    render(
      <InputPasswordWithStrengthIndicator
        placeholder="Password"
        showStrengthIndicator={false}
      />
    );
    const input = screen.getByPlaceholderText("Password");
    await userEvent.click(input);
    await userEvent.type(input, "TestPass1");
    expect(
      document.querySelector("[data-slot='strength-indicator']")
    ).not.toBeInTheDocument();
  });

  it("accepts user input", async () => {
    render(<InputPasswordWithStrengthIndicator placeholder="Password" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Password");
    await userEvent.type(input, "secret");
    expect(input).toHaveValue("secret");
  });
});
