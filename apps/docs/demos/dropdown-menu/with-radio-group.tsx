"use client";

import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@strait/ui/components/dropdown-menu";
import { useState } from "react";

export default function DropdownMenuWithRadioGroup() {
  const [sort, setSort] = useState("newest");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="sm" variant="outline">
            <HugeiconsIcon icon={Settings01Icon} />
            Sort: {sort}
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup onValueChange={setSort} value={sort}>
          <DropdownMenuRadioItem value="newest">
            Newest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">
            Oldest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">Name A–Z</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name-desc">
            Name Z–A
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
