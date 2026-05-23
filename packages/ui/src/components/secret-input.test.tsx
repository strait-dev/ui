import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SecretInput } from "./secret-input";

vi.mock("copy-to-clipboard", () => ({ default: vi.fn(() => true) }));

describe("SecretInput", () => {
  it("renders masked by default (type=password)", () => {
    render(<SecretInput value="sk_live_secret123" />);
    const input = screen.getByDisplayValue("sk_live_secret123");
    expect(input).toHaveAttribute("type", "password");
  });

  it("toggles to type=text when the reveal button is clicked", async () => {
    const user = userEvent.setup();
    render(<SecretInput value="sk_live_secret123" />);
    const input = screen.getByDisplayValue("sk_live_secret123");
    expect(input).toHaveAttribute("type", "password");

    const revealBtn = screen.getByRole("button", { name: "Reveal" });
    await user.click(revealBtn);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide" })).toBeInTheDocument();
  });

  it("toggles back to type=password when the hide button is clicked", async () => {
    const user = userEvent.setup();
    render(<SecretInput value="sk_live_secret123" />);
    const input = screen.getByDisplayValue("sk_live_secret123");

    const revealBtn = screen.getByRole("button", { name: "Reveal" });
    await user.click(revealBtn);
    expect(input).toHaveAttribute("type", "text");

    const hideBtn = screen.getByRole("button", { name: "Hide" });
    await user.click(hideBtn);
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders the copy button by default", () => {
    render(<SecretInput value="sk_live_secret123" />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("hides the reveal button when revealable={false}", () => {
    render(<SecretInput revealable={false} value="sk_live_secret123" />);
    expect(
      screen.queryByRole("button", { name: "Reveal" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Hide" })
    ).not.toBeInTheDocument();
  });

  it("hides the copy button when copyable={false}", () => {
    render(<SecretInput copyable={false} value="sk_live_secret123" />);
    expect(
      screen.queryByRole("button", { name: "Copy" })
    ).not.toBeInTheDocument();
  });

  it("renders no trailing buttons when both revealable and copyable are false", () => {
    render(
      <SecretInput
        copyable={false}
        revealable={false}
        value="sk_live_secret123"
      />
    );
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);
  });

  it("still masks the input when copyable={false} and revealable={true}", async () => {
    const user = userEvent.setup();
    render(<SecretInput copyable={false} value="secret" />);
    const input = screen.getByDisplayValue("secret");
    expect(input).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Reveal" }));
    expect(input).toHaveAttribute("type", "text");
  });
});
