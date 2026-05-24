import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AspectRatio } from "./aspect-ratio";

describe("AspectRatio", () => {
  it("renders a div with the aspect-ratio data-slot", () => {
    const { container } = render(<AspectRatio ratio={16 / 9} />);
    const el = container.querySelector('[data-slot="aspect-ratio"]');
    expect(el).toBeInTheDocument();
    expect(el?.tagName).toBe("DIV");
  });

  it("sets the --ratio CSS custom property from the ratio prop", () => {
    const { container } = render(<AspectRatio ratio={4 / 3} />);
    const el = container.querySelector<HTMLElement>(
      '[data-slot="aspect-ratio"]'
    );
    expect(el?.style.getPropertyValue("--ratio")).toBe(String(4 / 3));
  });

  it("includes the relative class for positioned children", () => {
    const { container } = render(<AspectRatio ratio={1} />);
    expect(container.querySelector('[data-slot="aspect-ratio"]')).toHaveClass(
      "relative"
    );
  });

  it("merges a custom className", () => {
    const { container } = render(
      <AspectRatio className="overflow-hidden" ratio={16 / 9} />
    );
    expect(container.querySelector('[data-slot="aspect-ratio"]')).toHaveClass(
      "overflow-hidden"
    );
  });

  it("renders children inside the container", () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9}>
        <img alt="Hero" src="/hero.jpg" />
      </AspectRatio>
    );
    expect(
      container.querySelector('[data-slot="aspect-ratio"] img')
    ).toHaveAttribute("alt", "Hero");
  });
});
