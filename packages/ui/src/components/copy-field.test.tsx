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

  it("copies the field value", async () => {
    render(<CopyField label="Run ID" value="run_8f3a91c2e7" />);

    await userEvent.click(screen.getByRole("button", { name: "Copy value" }));

    expect(copy).toHaveBeenCalledWith("run_8f3a91c2e7");
  });

  it("uses a generic copy label without a visible label", () => {
    render(<CopyField value="token" />);

    expect(
      screen.getByRole("button", { name: "Copy field value" })
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
});
