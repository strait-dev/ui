"use client";

import { DragDropVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@strait/ui/components/sortable";
import { useState } from "react";

type Card = { id: string; title: string };

const initialCards: Card[] = [
  { id: "1", title: "Intro" },
  { id: "2", title: "Discovery" },
  { id: "3", title: "Build" },
  { id: "4", title: "Launch" },
  { id: "5", title: "Scale" },
  { id: "6", title: "Iterate" },
];

export default function SortableGridDemo() {
  const [items, setItems] = useState<Card[]>(initialCards);

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
            <HugeiconsIcon
              className="size-4 shrink-0 text-muted-foreground"
              icon={DragDropVerticalIcon}
            />
          </SortableItemHandle>
          {item.title}
        </SortableItem>
      ))}
    </Sortable>
  );
}
