import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PasswordInput } from "./password-input";

describe("PasswordInput", () => {
  it("renders the wrapper with data-slot='password-input'", () => {
    render(<PasswordInput placeholder="Password" />);
    expect(
      document.querySelector("[data-slot='password-input']")
    ).toBeInTheDocument();
  });

  it("starts with type='password'", () => {
    render(<PasswordInput placeholder="Password" />);
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("renders a label when label prop is provided", () => {
    render(
      <PasswordInput id="pw" label="Enter Password" placeholder="Password" />
    );
    expect(screen.getByText("Enter Password")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='label']")).toBeInTheDocument();
  });

  it("links label htmlFor to the input id", () => {
    render(
      <PasswordInput id="my-pw" label="Password" placeholder="Password" />
    );
    const label = document.querySelector("[data-slot='label']");
    expect(label).toHaveAttribute("for", "my-pw");
  });

  it("does not render a label when label prop is omitted", () => {
    render(<PasswordInput placeholder="Password" />);
    expect(
      document.querySelector("[data-slot='label']")
    ).not.toBeInTheDocument();
  });

  it("renders the toggle button with default 'Show password' label", () => {
    render(<PasswordInput />);
    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toBeInTheDocument();
  });

  it("toggle button starts with aria-pressed=false", () => {
    render(<PasswordInput />);
    expect(
      screen.getByRole("button", { name: "Show password" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("reveals password after clicking the toggle", async () => {
    render(<PasswordInput placeholder="Password" />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "text"
    );
  });

  it("changes toggle label to 'Hide password' after reveal", async () => {
    render(<PasswordInput />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toBeInTheDocument();
  });

  it("sets aria-pressed=true when password is visible", async () => {
    render(<PasswordInput />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );
    expect(
      screen.getByRole("button", { name: "Hide password" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("masks password again after second toggle", async () => {
    render(<PasswordInput placeholder="Password" />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show password" })
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Hide password" })
    );
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("respects custom showPasswordLabel and hidePasswordLabel", async () => {
    render(
      <PasswordInput hidePasswordLabel="Conceal" showPasswordLabel="Reveal" />
    );
    expect(screen.getByRole("button", { name: "Reveal" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Reveal" }));
    expect(screen.getByRole("button", { name: "Conceal" })).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    render(<PasswordInput placeholder="Password" />);
    const input = screen.getByPlaceholderText<HTMLInputElement>("Password");
    await userEvent.type(input, "mySecretPass");
    expect(input).toHaveValue("mySecretPass");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<PasswordInput disabled placeholder="Password" />);
    expect(screen.getByPlaceholderText("Password")).toBeDisabled();
  });
});
