"use client";

import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@strait/ui/components/dropdown-menu";
import { useState } from "react";

export default function DropdownMenuWithCheckboxItems() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="sm" variant="outline">
            <HugeiconsIcon icon={Settings01Icon} />
            View options
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuLabel>Layout</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showSidebar}
          onCheckedChange={setShowSidebar}
        >
          Show sidebar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showToolbar}
          onCheckedChange={setShowToolbar}
        >
          Show toolbar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={compactMode}
          onCheckedChange={setCompactMode}
        >
          Compact mode
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
