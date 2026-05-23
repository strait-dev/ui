import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollArea, ScrollBar } from "./scroll-area";

describe("ScrollArea", () => {
  it("renders with data-slot='scroll-area'", () => {
    const { container } = render(
      <ScrollArea>
        <p>Hello world</p>
      </ScrollArea>
    );
    const root = container.querySelector("[data-slot='scroll-area']");
    expect(root).toBeInTheDocument();
  });

  it("renders child content inside the viewport", () => {
    render(
      <ScrollArea>
        <p>Scrollable content</p>
      </ScrollArea>
    );
    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });

  it("renders the viewport with data-slot='scroll-area-viewport'", () => {
    const { container } = render(
      <ScrollArea>
        <p>Content</p>
      </ScrollArea>
    );
    const viewport = container.querySelector(
      "[data-slot='scroll-area-viewport']"
    );
    expect(viewport).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ScrollArea className="my-custom-class">
        <p>Content</p>
      </ScrollArea>
    );
    const root = container.querySelector("[data-slot='scroll-area']");
    expect(root).toHaveClass("my-custom-class");
  });

  it("accepts a ScrollBar child with horizontal orientation without throwing", () => {
    expect(() =>
      render(
        <ScrollArea>
          <ScrollBar orientation="horizontal" />
          <p>Content</p>
        </ScrollArea>
      )
    ).not.toThrow();
  });
});
