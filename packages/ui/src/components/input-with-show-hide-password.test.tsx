import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { InputWithShowHidePassword } from "./input-with-show-hide-password";

describe("InputWithShowHidePassword", () => {
  it("renders the wrapper with data-slot='input-with-show-hide-password'", () => {
    render(<InputWithShowHidePassword placeholder="Password" />);
    expect(
      document.querySelector("[data-slot='input-with-show-hide-password']")
    ).toBeInTheDocument();
  });

  it("starts with type='password' (masked)", () => {
    render(<InputWithShowHidePassword placeholder="Password" />);
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("toggle button starts with aria-label='Show password'", () => {
    render(<InputWithShowHidePassword />);
    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toBeInTheDocument();
  });

  it("toggle button starts with aria-pressed=false", () => {
    render(<InputWithShowHidePassword />);
    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("reveals password text after clicking the toggle", async () => {
    render(<InputWithShowHidePassword placeholder="Password" />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "text"
    );
  });

  it("changes aria-label to 'Hide password' after toggle", async () => {
    render(<InputWithShowHidePassword />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toBeInTheDocument();
  });

  it("sets aria-pressed=true when password is visible", async () => {
    render(<InputWithShowHidePassword />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("masks password again after a second toggle", async () => {
    render(<InputWithShowHidePassword placeholder="Password" />);
    const toggle = screen.getByRole("button", { name: "Show password" });
    await userEvent.click(toggle);
    await userEvent.click(
      screen.getByRole("button", { name: "Hide password" })
    );
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("accepts user input", async () => {
    render(<InputWithShowHidePassword placeholder="Password" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Password");
    await userEvent.type(input, "secret123");
    expect(input).toHaveValue("secret123");
  });
});
