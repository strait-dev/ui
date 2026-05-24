import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonVariants } from "./button";

describe("Button", () => {
  it("renders its children inside a button with the button data-slot", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("applies the default variant and size classes", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveClass("bg-primary", "text-primary-foreground", "h-8");
  });

  it("merges a custom className with the variant classes", () => {
    render(<Button className="w-full">Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "w-full",
      "bg-primary"
    );
  });

  it("fires onClick when pressed", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick while disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders as a different element via the render prop", () => {
    render(
      // biome-ignore lint/a11y/useAnchorContent: Button injects its children into the rendered anchor at runtime.
      <Button render={<a href="/home" />} variant="link">
        Home
      </Button>
    );
    const link = screen.getByText("Home");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/home");
    expect(link).toHaveAttribute("data-slot", "button");
    // Polymorphism replaces the native <button> with the rendered <a>.
    expect(document.querySelector("button")).toBeNull();
  });

  it("exposes a variants helper that reflects the requested variant", () => {
    expect(buttonVariants({ variant: "ghost" })).toContain("hover:bg-muted");
    expect(buttonVariants({ size: "icon" })).toContain("size-8");
  });
});

// ---------------------------------------------------------------------------
// New variant assertions
// ---------------------------------------------------------------------------

describe("Button secondary-outline variant", () => {
  it("renders with the secondary border class", () => {
    render(<Button variant="secondary-outline">Secondary Outline</Button>);
    const button = screen.getByRole("button", { name: "Secondary Outline" });
    expect(button).toHaveClass("border-secondary");
  });

  it("renders with secondary foreground text class", () => {
    render(<Button variant="secondary-outline">Secondary Outline</Button>);
    const button = screen.getByRole("button", { name: "Secondary Outline" });
    expect(button).toHaveClass("text-secondary-foreground");
  });

  it("buttonVariants helper returns expected classes for secondary-outline", () => {
    const classes = buttonVariants({ variant: "secondary-outline" });
    expect(classes).toContain("border-secondary");
    expect(classes).toContain("text-secondary-foreground");
  });
});

describe("Button invert variants", () => {
  it("invert-solid has bg-invert and text-invert-foreground", () => {
    render(<Button variant="invert-solid">Invert</Button>);
    const button = screen.getByRole("button", { name: "Invert" });
    expect(button).toHaveClass("bg-invert");
    expect(button).toHaveClass("text-invert-foreground");
  });

  it("invert (soft) has bg-invert/10", () => {
    const classes = buttonVariants({ variant: "invert" });
    expect(classes).toContain("bg-invert/10");
  });

  it("invert-outline has border-invert/30", () => {
    const classes = buttonVariants({ variant: "invert-outline" });
    expect(classes).toContain("border-invert/30");
  });
});
