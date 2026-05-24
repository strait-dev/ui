import { GlobeIcon } from "@hugeicons/core-free-icons";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ConfigRow } from "./config-row";

describe("ConfigRow", () => {
  it("renders the label text", () => {
    render(<ConfigRow label="Region" value="us-east-1" />);
    expect(screen.getByText("Region")).toBeInTheDocument();
  });

  it("renders the value text", () => {
    render(<ConfigRow label="Region" value="us-east-1" />);
    expect(screen.getByText("us-east-1")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(
      <ConfigRow
        description="The AWS region for this project"
        label="Region"
        value="us-east-1"
      />
    );
    expect(
      screen.getByText("The AWS region for this project")
    ).toBeInTheDocument();
  });

  it("does not render a description element when omitted", () => {
    render(<ConfigRow label="Region" value="us-east-1" />);
    expect(
      screen.queryByText("The AWS region for this project")
    ).not.toBeInTheDocument();
  });

  it("has data-slot='config-row' on the root element", () => {
    const { container } = render(
      <ConfigRow label="Region" value="us-east-1" />
    );
    expect(
      container.querySelector("[data-slot='config-row']")
    ).toBeInTheDocument();
  });

  it("children overrides value when both are provided", () => {
    render(
      <ConfigRow label="Key" value="from-value">
        from-children
      </ConfigRow>
    );
    expect(screen.getByText("from-children")).toBeInTheDocument();
    expect(screen.queryByText("from-value")).not.toBeInTheDocument();
  });

  it("renders the action node when provided", () => {
    render(
      <ConfigRow
        action={<button type="button">Copy</button>}
        label="API Key"
        value="sk-123"
      />
    );
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("renders the icon when provided", () => {
    const { container } = render(
      <ConfigRow icon={GlobeIcon} label="API Key" value="sk-123" />
    );
    // HugeiconsIcon renders an <svg>; verify at least one SVG is present.
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies the className to the root element", () => {
    const { container } = render(
      <ConfigRow className="custom-class" label="Region" value="us-east-1" />
    );
    expect(container.querySelector("[data-slot='config-row']")).toHaveClass(
      "custom-class"
    );
  });

  it("renders without a value when neither value nor children are provided", () => {
    render(<ConfigRow label="Empty" />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });
});
