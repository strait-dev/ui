import {
  Delete02Icon,
  DragDropVerticalIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "./button";
import { Sortable, SortableItem, SortableItemHandle } from "./sortable";

const meta = {
  title: "Data Display/Sortable",
  component: Sortable,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Drag-to-reorder lists, rows, and grids built on dnd-kit. The list is",
          "controlled: pass `value`, `getItemValue`, and `onValueChange`, and",
          "render one `SortableItem` per entry.",
          "",
          "**Strategy** — `vertical` (default) for stacked lists, `horizontal`",
          "for rows, and `grid` for wrapped two-dimensional layouts.",
          "",
          "**Handle** — pointer drags start from a `SortableItemHandle`; wrap a",
          "grip icon for a dedicated handle or the whole row to drag anywhere.",
          "Keyboard users can reorder from the focused item with Space + arrows.",
        ].join("\n"),
      },
    },
  },
  // Stories drive their own controlled state, so supply inert defaults to
  // satisfy the required root props.
  args: {
    value: [],
    getItemValue: () => "",
    onValueChange: () => undefined,
  },
} satisfies Meta<typeof Sortable>;

export default meta;

type Story = StoryObj<typeof meta>;

type Track = { id: string; title: string };

const TRACKS: Track[] = [
  { id: "1", title: "Intro" },
  { id: "2", title: "Discovery" },
  { id: "3", title: "Build" },
  { id: "4", title: "Launch" },
];

const rowClass =
  "flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm shadow-xs";

const Grip = () => (
  <HugeiconsIcon
    className="size-4 shrink-0 text-muted-foreground"
    icon={DragDropVerticalIcon}
    strokeWidth={2}
  />
);

/** Vertical list with a dedicated grip handle — the canonical setup. */
function VerticalDemo() {
  const [items, setItems] = useState<Track[]>(TRACKS);
  return (
    <Sortable
      className="flex w-72 flex-col gap-2"
      getItemValue={(item) => item.id}
      onValueChange={setItems}
      value={items}
    >
      {items.map((item) => (
        <SortableItem className={rowClass} key={item.id} value={item.id}>
          <SortableItemHandle>
            <Grip />
          </SortableItemHandle>
          {item.title}
        </SortableItem>
      ))}
    </Sortable>
  );
}

export const Playground: Story = {
  render: () => <VerticalDemo />,
};

/** Horizontal row reordering via `strategy="horizontal"`. */
export const Horizontal: Story = {
  render: () => {
    function HorizontalDemo() {
      const [items, setItems] = useState<Track[]>(TRACKS);
      return (
        <Sortable
          className="flex gap-2"
          getItemValue={(item) => item.id}
          onValueChange={setItems}
          strategy="horizontal"
          value={items}
        >
          {items.map((item) => (
            <SortableItem
              className="flex w-24 flex-col items-center gap-1 rounded-lg border bg-card px-3 py-3 text-sm shadow-xs"
              key={item.id}
              value={item.id}
            >
              <SortableItemHandle>
                <Grip />
              </SortableItemHandle>
              {item.title}
            </SortableItem>
          ))}
        </Sortable>
      );
    }
    return <HorizontalDemo />;
  },
};

/** Two-dimensional grid reordering via `strategy="grid"`. */
export const Grid: Story = {
  render: () => {
    function GridDemo() {
      const [items, setItems] = useState<Track[]>([
        ...TRACKS,
        { id: "5", title: "Scale" },
        { id: "6", title: "Iterate" },
      ]);
      return (
        <Sortable
          className="grid grid-cols-3 gap-2"
          getItemValue={(item) => item.id}
          onValueChange={setItems}
          strategy="grid"
          value={items}
        >
          {items.map((item) => (
            <SortableItem
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border bg-card text-sm shadow-xs"
              key={item.id}
              value={item.id}
            >
              <SortableItemHandle>
                <Grip />
              </SortableItemHandle>
              {item.title}
            </SortableItem>
          ))}
        </Sortable>
      );
    }
    return <GridDemo />;
  },
};

/** The entire row acts as the drag handle (no separate grip). */
export const WholeItemDraggable: Story = {
  render: () => {
    function WholeItemDemo() {
      const [items, setItems] = useState<Track[]>(TRACKS);
      return (
        <Sortable
          className="flex w-72 flex-col gap-2"
          getItemValue={(item) => item.id}
          onValueChange={setItems}
          value={items}
        >
          {items.map((item) => (
            <SortableItem key={item.id} value={item.id}>
              <SortableItemHandle className={rowClass}>
                <Grip />
                {item.title}
              </SortableItemHandle>
            </SortableItem>
          ))}
        </Sortable>
      );
    }
    return <WholeItemDemo />;
  },
};

/** A `disabled` item stays put and is dimmed while the rest reorder. */
export const Disabled: Story = {
  render: () => {
    function DisabledDemo() {
      const [items, setItems] = useState<Track[]>(TRACKS);
      return (
        <Sortable
          className="flex w-72 flex-col gap-2"
          getItemValue={(item) => item.id}
          onValueChange={setItems}
          value={items}
        >
          {items.map((item) => (
            <SortableItem
              className={rowClass}
              disabled={item.id === "2"}
              key={item.id}
              value={item.id}
            >
              <SortableItemHandle>
                <Grip />
              </SortableItemHandle>
              {item.title}
            </SortableItem>
          ))}
        </Sortable>
      );
    }
    return <DisabledDemo />;
  },
};

/** Add, remove, and reorder a dynamic list. */
export const Dynamic: Story = {
  render: () => {
    function DynamicDemo() {
      const [items, setItems] = useState<Track[]>(TRACKS.slice(0, 3));
      const [nextId, setNextId] = useState(TRACKS.length + 1);
      return (
        <div className="flex w-72 flex-col gap-3">
          <Sortable
            className="flex flex-col gap-2"
            getItemValue={(item) => item.id}
            onValueChange={setItems}
            value={items}
          >
            {items.map((item) => (
              <SortableItem className={rowClass} key={item.id} value={item.id}>
                <SortableItemHandle>
                  <Grip />
                </SortableItemHandle>
                <span className="flex-1">{item.title}</span>
                <Button
                  aria-label={`Remove ${item.title}`}
                  onClick={() =>
                    setItems((prev) => prev.filter((i) => i.id !== item.id))
                  }
                  size="icon-xs"
                  variant="ghost"
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                </Button>
              </SortableItem>
            ))}
          </Sortable>
          <Button
            onClick={() => {
              setItems((prev) => [
                ...prev,
                { id: String(nextId), title: `Item ${nextId}` },
              ]);
              setNextId((n) => n + 1);
            }}
            size="sm"
            variant="outline"
          >
            <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
            Add item
          </Button>
        </div>
      );
    }
    return <DynamicDemo />;
  },
};
