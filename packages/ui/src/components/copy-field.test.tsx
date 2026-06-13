import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import copy from "copy-to-clipboard";
import { describe, expect, it, vi } from "vitest";
import { CopyField } from "./copy-field";

vi.mock("copy-to-clipboard", () => ({ default: vi.fn(() => true) }));

describe("CopyField", () => {
  it("renders label, value, description, and slots", () => {
    render(
      <CopyField
        description="Used by the public client."
        label="Environment variable"
        value="NEXT_PUBLIC_API_URL"
      />
    );

    expect(
      document.querySelector('[data-slot="copy-field"]')
    ).toBeInTheDocument();
    expect(screen.getByText("Environment variable")).toHaveAttribute(
      "data-slot",
      "copy-field-label"
    );
    expect(screen.getByText("NEXT_PUBLIC_API_URL")).toHaveAttribute(
      "data-slot",
      "copy-field-value"
    );
    expect(screen.getByText("Used by the public client.")).toHaveAttribute(
      "data-slot",
      "copy-field-description"
    );
  });

  it("renders prefix and suffix slots", () => {
    render(<CopyField prefix="env" suffix="required" value="API_URL" />);

    expect(screen.getByText("env")).toHaveAttribute(
      "data-slot",
      "copy-field-prefix"
    );
    expect(screen.getByText("required")).toHaveAttribute(
      "data-slot",
      "copy-field-suffix"
    );
  });

  it("copies the field value", async () => {
    render(<CopyField label="Run ID" value="run_8f3a91c2e7" />);

    await userEvent.click(screen.getByRole("button", { name: "Copy value" }));

    expect(copy).toHaveBeenCalledWith("run_8f3a91c2e7");
  });

  it("calls onCopy with the field value", async () => {
    const onCopy = vi.fn();
    render(<CopyField onCopy={onCopy} value="token" />);

    await userEvent.click(
      screen.getByRole("button", { name: "Copy field value" })
    );

    expect(onCopy).toHaveBeenCalledWith("token");
  });

  it("uses a generic copy label without a visible label", () => {
    render(<CopyField value="token" />);

    expect(
      screen.getByRole("button", { name: "Copy field value" })
    ).toBeInTheDocument();
  });

  it("honors a custom copy label", () => {
    render(<CopyField copyLabel="Copy API key" value="token" />);

    expect(
      screen.getByRole("button", { name: "Copy API key" })
    ).toBeInTheDocument();
  });

  it("can hide the copy button", () => {
    render(<CopyField copyable={false} value="token" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("can render a non-monospace value", () => {
    render(<CopyField monospace={false} value="Plain language value" />);

    expect(screen.getByText("Plain language value")).not.toHaveClass(
      "font-mono"
    );
  });

  it("masks and reveals sensitive values", async () => {
    render(<CopyField sensitive value="sk_live_secret" />);

    expect(screen.queryByText("sk_live_secret")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Show" }));

    expect(screen.getByText("sk_live_secret")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hide" })).toBeInTheDocument();
  });

  it("supports controlled reveal state", async () => {
    const onRevealChange = vi.fn();
    render(
      <CopyField
        onRevealChange={onRevealChange}
        revealed={false}
        sensitive
        value="secret"
      />
    );

    await userEvent.click(screen.getByRole("button", { name: "Show" }));

    expect(onRevealChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("copies sensitive values without requiring reveal", async () => {
    render(<CopyField sensitive value="sk_live_secret" />);

    await userEvent.click(
      screen.getByRole("button", { name: "Copy field value" })
    );

    expect(copy).toHaveBeenCalledWith("sk_live_secret");
  });
});
