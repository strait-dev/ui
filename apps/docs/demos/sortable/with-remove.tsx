"use client";

import {
  Delete02Icon,
  DragDropVerticalIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@strait/ui/components/sortable";
import { useState } from "react";

type Task = { id: string; title: string };

const initialTasks: Task[] = [
  { id: "1", title: "Write tests" },
  { id: "2", title: "Update docs" },
  { id: "3", title: "Code review" },
];

const rowClass =
  "flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-sm shadow-xs";

export default function SortableWithRemoveDemo() {
  const [items, setItems] = useState<Task[]>(initialTasks);
  const [nextId, setNextId] = useState(initialTasks.length + 1);

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
              <HugeiconsIcon
                className="size-4 shrink-0 text-muted-foreground"
                icon={DragDropVerticalIcon}
              />
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
              <HugeiconsIcon icon={Delete02Icon} />
            </Button>
          </SortableItem>
        ))}
      </Sortable>
      <Button
        onClick={() => {
          setItems((prev) => [
            ...prev,
            { id: String(nextId), title: `Task ${nextId}` },
          ]);
          setNextId((n) => n + 1);
        }}
        size="sm"
        variant="outline"
      >
        <HugeiconsIcon icon={PlusSignIcon} />
        Add task
      </Button>
    </div>
  );
}
