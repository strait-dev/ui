import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "./badge";

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
});
