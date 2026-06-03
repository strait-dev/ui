"use client";

import { DragDropVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@strait/ui/components/sortable";
import { useState } from "react";

type Track = { id: string; title: string };

const initial: Track[] = [
  { id: "1", title: "Intro" },
  { id: "2", title: "Discovery" },
  { id: "3", title: "Build" },
  { id: "4", title: "Launch" },
];

export default function SortableDemo() {
  const [items, setItems] = useState<Track[]>(initial);

  return (
    <Sortable
      className="flex w-72 flex-col gap-2"
      getItemValue={(item) => item.id}
      onValueChange={setItems}
      value={items}
    >
      {items.map((item) => (
        <SortableItem
          className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm shadow-xs"
          key={item.id}
          value={item.id}
        >
          <SortableItemHandle>
            <HugeiconsIcon
              className="size-4 shrink-0 text-muted-foreground"
              icon={DragDropVerticalIcon}
              strokeWidth={2}
            />
          </SortableItemHandle>
          <span>{item.title}</span>
        </SortableItem>
      ))}
    </Sortable>
  );
}
