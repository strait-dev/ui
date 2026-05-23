import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton";

describe("Skeleton", () => {
  it("renders a div with the skeleton data-slot", () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).toBeInTheDocument();
    expect(el?.tagName).toBe("DIV");
  });

  it("includes the animate-pulse and bg-muted classes by default", () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).toHaveClass("animate-pulse", "bg-muted");
  });

  it("merges a custom className", () => {
    const { container } = render(<Skeleton className="h-10 w-10" />);
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).toHaveClass("h-10", "w-10", "animate-pulse");
  });

  it("forwards additional props to the underlying div", () => {
    const { container } = render(
      <Skeleton aria-hidden="true" data-testid="skel" />
    );
    const el = container.querySelector('[data-slot="skeleton"]');
    expect(el).toHaveAttribute("data-testid", "skel");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders children inside the skeleton div", () => {
    const { container } = render(
      <Skeleton>
        <span>inner</span>
      </Skeleton>
    );
    expect(
      container.querySelector('[data-slot="skeleton"] span')
    ).toHaveTextContent("inner");
  });
});
