import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders with the separator data-slot", () => {
    const { container } = render(<Separator />);
    const sep = container.querySelector('[data-slot="separator"]');
    expect(sep).toBeInTheDocument();
  });

  it("defaults to horizontal orientation", () => {
    const { container } = render(<Separator />);
    const sep = container.querySelector('[data-slot="separator"]');
    expect(sep).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("accepts vertical orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const sep = container.querySelector('[data-slot="separator"]');
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
  });

  it("exposes the separator role to assistive technology", () => {
    const { container } = render(<Separator />);
    const sep = container.querySelector('[data-slot="separator"]');
    expect(sep).toHaveAttribute("role", "separator");
  });

  it("merges a custom className", () => {
    const { container } = render(<Separator className="my-sep" />);
    expect(container.querySelector('[data-slot="separator"]')).toHaveClass(
      "my-sep"
    );
  });
});
