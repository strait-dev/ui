"use client";

import { DragDropVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@strait/ui/components/sortable";
import { useState } from "react";

type Step = { id: string; title: string };

const initialSteps: Step[] = [
  { id: "1", title: "Discovery" },
  { id: "2", title: "Design" },
  { id: "3", title: "Build" },
  { id: "4", title: "Launch" },
];

const rowClass =
  "flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm shadow-xs";

export default function SortableVerticalDemo() {
  const [items, setItems] = useState<Step[]>(initialSteps);

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
