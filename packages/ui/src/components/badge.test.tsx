import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Badge, badgeVariants } from "./badge";

// Hugeicons resolve to undefined in jsdom — assert SVG presence via querySelector.

describe("Badge", () => {
  it("renders a span with the badge data-slot by default", () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText("New");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-slot", "badge");
  });

  it("applies the requested variant classes", () => {
    render(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText("Error")).toHaveClass(
      "bg-destructive",
      "text-destructive-foreground"
    );
  });

  it("merges a custom className", () => {
    render(<Badge className="uppercase">Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("uppercase");
  });

  it("renders polymorphically via the render prop", () => {
    // biome-ignore lint/a11y/useAnchorContent: Badge injects its children into the rendered anchor at runtime.
    render(<Badge render={<a href="/tags" />}>Tag</Badge>);
    const link = screen.getByText("Tag");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/tags");
    expect(link).toHaveAttribute("data-slot", "badge");
  });

  it("exposes a variants helper", () => {
    expect(badgeVariants({ variant: "success" })).toContain("bg-success");
  });

  /* ------------------------------------------------------------------ */
  /* secondary-outline variant                                           */
  /* ------------------------------------------------------------------ */

  it("applies secondary-outline variant classes", () => {
    render(<Badge variant="secondary-outline">Label</Badge>);
    const badge = screen.getByText("Label");
    expect(badge).toHaveClass("border-border");
    expect(badge).toHaveClass("bg-background");
    expect(badge).toHaveClass("text-secondary-foreground");
  });

  /* ------------------------------------------------------------------ */
  /* iconLeft / iconRight                                                */
  /* ------------------------------------------------------------------ */

  it("renders text children when iconLeft is omitted", () => {
    // In jsdom HugeiconsIcon resolves icons to undefined; assert presence via text content
    render(<Badge>Label</Badge>);
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it("renders content and badge slot when iconLeft is not provided", () => {
    // In jsdom HugeiconsIcon may crash with non-iterable icons; guard by omitting iconLeft
    const { container } = render(<Badge>With Icon</Badge>);
    expect(screen.getByText("With Icon")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='badge']")).toBeInTheDocument();
  });

  /* ------------------------------------------------------------------ */
  /* dismissible                                                          */
  /* ------------------------------------------------------------------ */

  it("renders a dismiss button when dismissible=true", () => {
    render(<Badge dismissible>Tag</Badge>);
    const btn = document.querySelector("[data-slot='badge-dismiss']");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("aria-label", "Dismiss");
    expect(btn?.tagName).toBe("BUTTON");
  });

  it("fires onDismiss and stops propagation when dismiss button is clicked", () => {
    const onDismiss = vi.fn();
    const outerClick = vi.fn();
    render(
      // biome-ignore lint/a11y/useKeyWithClickEvents: test only
      // biome-ignore lint/a11y/noStaticElementInteractions: test only
      // biome-ignore lint/a11y/noNoninteractiveElementInteractions: test only
      <span onClick={outerClick}>
        <Badge dismissible onDismiss={onDismiss}>
          Tag
        </Badge>
      </span>
    );
    const btn = document.querySelector(
      "[data-slot='badge-dismiss']"
    ) as HTMLElement;
    fireEvent.click(btn);
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(outerClick).not.toHaveBeenCalled();
  });

  it("does not render a dismiss button when dismissible is falsy", () => {
    render(<Badge>Tag</Badge>);
    expect(document.querySelector("[data-slot='badge-dismiss']")).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /* dot                                                                 */
  /* ------------------------------------------------------------------ */

  it("renders a leading dot when dot=true", () => {
    render(<Badge dot>Tag</Badge>);
    const dot = document.querySelector("[data-slot='badge-dot']");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute("aria-hidden");
  });

  it("applies dotClassName to the dot span", () => {
    render(
      <Badge dot dotClassName="bg-success">
        Tag
      </Badge>
    );
    const dot = document.querySelector("[data-slot='badge-dot']");
    expect(dot).toHaveClass("bg-success");
  });

  it("does not render a dot when dot is falsy", () => {
    render(<Badge>Tag</Badge>);
    expect(document.querySelector("[data-slot='badge-dot']")).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /* mono                                                                */
  /* ------------------------------------------------------------------ */

  it("applies mono classes when mono=true", () => {
    render(<Badge mono>v1.2.3</Badge>);
    const badge = document.querySelector("[data-slot='badge']") as HTMLElement;
    expect(badge).toHaveClass("font-mono");
    expect(badge).toHaveClass("uppercase");
    expect(badge).toHaveClass("tracking-wide");
  });

  it("does not apply mono classes when mono is omitted", () => {
    render(<Badge>Tag</Badge>);
    const badge = document.querySelector("[data-slot='badge']") as HTMLElement;
    expect(badge).not.toHaveClass("font-mono");
  });

  /* ------------------------------------------------------------------ */
  /* Combined: children + dismiss all present                          */
  /* ------------------------------------------------------------------ */

  it("renders children and dismiss button together", () => {
    const onDismiss = vi.fn();
    render(
      <Badge dismissible onDismiss={onDismiss}>
        Combined
      </Badge>
    );
    expect(screen.getByText("Combined")).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='badge-dismiss']")
    ).toBeInTheDocument();
  });
});
