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

  it("appends an aria-hidden asterisk when required=true", () => {
    render(<Label required>Password</Label>);
    const label = screen.getByText("Password").closest("label");
    const asterisk = label?.querySelector("[aria-hidden='true']");
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveTextContent("*");
  });

  it("does not render an asterisk when required is omitted", () => {
    render(<Label>Username</Label>);
    const label = screen.getByText("Username").closest("label");
    expect(label?.querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("applies text-xs class when size=sm", () => {
    render(<Label size="sm">Small</Label>);
    expect(screen.getByText("Small")).toHaveClass("text-xs");
  });

  it("applies text-base class when size=lg", () => {
    render(<Label size="lg">Large</Label>);
    expect(screen.getByText("Large")).toHaveClass("text-base");
  });
});
