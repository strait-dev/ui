"use client";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@strait/ui/components/context-menu";
import { useState } from "react";

export default function ContextMenuWithCheckboxes() {
  const [ruler, setRuler] = useState(true);
  const [grid, setGrid] = useState(false);
  const [snapping, setSnapping] = useState(true);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
          Right-click for view options
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>View</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked={ruler} onCheckedChange={setRuler}>
          Show ruler
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
          Show grid
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={snapping}
          onCheckedChange={setSnapping}
        >
          Enable snapping
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
