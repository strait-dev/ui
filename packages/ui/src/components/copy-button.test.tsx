import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import copy from "copy-to-clipboard";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "./copy-button";

vi.mock("copy-to-clipboard", () => ({ default: vi.fn(() => true) }));

describe("CopyButton", () => {
  it("renders with data-slot='copy-button'", () => {
    render(<CopyButton text="hello" />);
    expect(
      document.querySelector("[data-slot='copy-button']")
    ).toBeInTheDocument();
  });

  it("starts with a 'Copy' aria-label", () => {
    render(<CopyButton text="hello" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Copy");
  });

  it("copies the text and flips to the copied state on click", async () => {
    render(<CopyButton text="my-secret" />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(copy).toHaveBeenCalledWith("my-secret");
    expect(button).toHaveAttribute("aria-label", "Copied");
    expect(button).toHaveAttribute("data-copied", "true");
  });

  it("calls onCopied with the text", async () => {
    const onCopied = vi.fn();
    render(<CopyButton onCopied={onCopied} text="payload" />);
    await userEvent.click(screen.getByRole("button"));
    expect(onCopied).toHaveBeenCalledWith("payload");
  });

  it("renders a label when children are provided", () => {
    render(<CopyButton text="x">Copy ID</CopyButton>);
    expect(
      screen.getByRole("button", { name: /copy id/i })
    ).toBeInTheDocument();
  });

  it("honours an explicit aria-label", () => {
    render(<CopyButton aria-label="Copy API key" text="x" />);
    expect(
      screen.getByRole("button", { name: "Copy API key" })
    ).toBeInTheDocument();
  });
});
