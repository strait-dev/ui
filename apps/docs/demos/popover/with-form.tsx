"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@strait/ui/components/popover";
import { useState } from "react";

export default function PopoverWithForm() {
  const [tag, setTag] = useState("");

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button size="sm" variant="outline">
            <HugeiconsIcon icon={Add01Icon} />
            Add tag
          </Button>
        }
      />
      <PopoverContent align="start" side="bottom" size="lg">
        <PopoverHeader>
          <PopoverTitle>New tag</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-2">
          <input
            className="h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. bug, feature, docs"
            type="text"
            value={tag}
          />
          <Button disabled={tag.trim().length === 0} size="sm">
            Create tag
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
