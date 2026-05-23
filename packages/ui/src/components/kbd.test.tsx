import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd, KbdGroup } from "./kbd";

describe("Kbd", () => {
  it("renders a kbd element with the kbd data-slot", () => {
    const { container } = render(<Kbd>⌘</Kbd>);
    const kbd = container.querySelector("kbd");
    expect(kbd).toBeInTheDocument();
    expect(kbd).toHaveAttribute("data-slot", "kbd");
    expect(kbd).toHaveTextContent("⌘");
  });

  it("merges a custom className", () => {
    const { container } = render(<Kbd className="my-custom">K</Kbd>);
    expect(container.querySelector("kbd")).toHaveClass("my-custom");
  });

  it("renders KbdGroup with the kbd-group data-slot", () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    );
    const group = container.querySelector('[data-slot="kbd-group"]');
    expect(group).toBeInTheDocument();
    expect(group?.tagName).toBe("KBD");
  });

  it("KbdGroup contains the nested Kbd children", () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
      </KbdGroup>
    );
    const kbds = container.querySelectorAll('[data-slot="kbd"]');
    expect(kbds).toHaveLength(2);
  });

  it("forwards additional props to the underlying kbd element", () => {
    const { container } = render(<Kbd aria-label="Command key">⌘</Kbd>);
    expect(container.querySelector("kbd")).toHaveAttribute(
      "aria-label",
      "Command key"
    );
  });

  // --- size axis ---

  it("default size applies h-5 and text-xs classes", () => {
    const { container } = render(<Kbd>K</Kbd>);
    const kbd = container.querySelector("kbd");
    expect(kbd).toHaveClass("h-5");
    expect(kbd).toHaveClass("text-xs");
  });

  it("size='sm' applies h-4 class", () => {
    const { container } = render(<Kbd size="sm">K</Kbd>);
    const kbd = container.querySelector("kbd");
    expect(kbd).toHaveClass("h-4");
  });

  it("size='lg' applies h-6 and text-sm classes", () => {
    const { container } = render(<Kbd size="lg">Cmd</Kbd>);
    const kbd = container.querySelector("kbd");
    expect(kbd).toHaveClass("h-6");
    expect(kbd).toHaveClass("text-sm");
  });
});
