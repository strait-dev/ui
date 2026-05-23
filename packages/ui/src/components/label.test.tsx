import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./label";

describe("Label", () => {
  it("renders a label carrying the label data-slot", () => {
    render(<Label>Full name</Label>);
    const label = screen.getByText("Full name");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("data-slot", "label");
  });

  it("associates with a control via htmlFor", () => {
    render(
      <>
        <Label htmlFor="name">Full name</Label>
        <input id="name" />
      </>
    );
    const input = screen.getByLabelText("Full name");
    expect(input.tagName).toBe("INPUT");
  });

  it("merges a custom className with the base styles", () => {
    render(<Label className="text-red-500">Email</Label>);
    const label = screen.getByText("Email");
    expect(label).toHaveClass("text-red-500", "font-medium");
  });

  it("renders children including nested elements", () => {
    render(
      <Label>
        Accept <span>terms</span>
      </Label>
    );
    expect(screen.getByText("terms")).toBeInTheDocument();
  });
});
