import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Sortable, SortableItem, SortableItemHandle } from "./sortable";

type Item = { id: string; label: string };

const ITEMS: Item[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Bravo" },
  { id: "c", label: "Charlie" },
];

function Harness({
  items = ITEMS,
  disabledId,
  rootClassName,
  itemClassName,
}: {
  items?: Item[];
  disabledId?: string;
  rootClassName?: string;
  itemClassName?: string;
}) {
  const [value, setValue] = useState(items);
  return (
    <Sortable
      className={rootClassName}
      getItemValue={(item) => item.id}
      onValueChange={setValue}
      value={value}
    >
      {value.map((item) => (
        <SortableItem
          className={itemClassName}
          disabled={item.id === disabledId}
          key={item.id}
          value={item.id}
        >
          <SortableItemHandle aria-label={`Drag ${item.label}`}>
            ⠿
          </SortableItemHandle>
          {item.label}
        </SortableItem>
      ))}
    </Sortable>
  );
}

describe("Sortable", () => {
  it("renders the root with the sortable data-slot", () => {
    const { container } = render(<Harness />);
    expect(container.querySelector('[data-slot="sortable"]')).not.toBeNull();
  });

  it("renders each item with data-slot and its data-value", () => {
    const { container } = render(<Harness />);
    const items = container.querySelectorAll('[data-slot="sortable-item"]');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveAttribute("data-value", "a");
    expect(items[2]).toHaveAttribute("data-value", "c");
  });

  it("renders a handle with the sortable-item-handle data-slot", () => {
    const { container } = render(<Harness />);
    const handles = container.querySelectorAll(
      '[data-slot="sortable-item-handle"]'
    );
    expect(handles).toHaveLength(3);
  });

  it("exposes a focusable button role on each item for keyboard dragging", () => {
    render(<Harness />);
    const items = screen.getAllByRole("button");
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveAttribute("tabindex", "0");
  });

  it("forwards className to the root and to items", () => {
    const { container } = render(
      <Harness itemClassName="item-x" rootClassName="root-x" />
    );
    expect(container.querySelector('[data-slot="sortable"]')).toHaveClass(
      "root-x"
    );
    expect(container.querySelector('[data-slot="sortable-item"]')).toHaveClass(
      "item-x"
    );
  });

  it("marks a disabled item with data-disabled and dims it", () => {
    const { container } = render(<Harness disabledId="b" />);
    const items = container.querySelectorAll('[data-slot="sortable-item"]');
    expect(items[1]).toHaveAttribute("data-disabled", "true");
    expect(items[1]).toHaveClass("opacity-50");
    expect(items[0]).not.toHaveAttribute("data-disabled");
  });

  it("reflects the drag state on the root via data-dragging", () => {
    const { container } = render(<Harness />);
    expect(container.querySelector('[data-slot="sortable"]')).toHaveAttribute(
      "data-dragging",
      "false"
    );
  });
});
