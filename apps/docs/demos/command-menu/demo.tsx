"use client";

import {
  Home01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@strait/ui/components/button";
import {
  CommandMenu,
  type CommandMenuProps,
} from "@strait/ui/components/command-menu";
import { useState } from "react";

const groups: CommandMenuProps["groups"] = [
  {
    heading: "Navigation",
    items: [
      {
        label: "Home",
        icon: Home01Icon,
        shortcut: "⌘H",
        onSelect: () => undefined,
      },
      {
        label: "Profile",
        icon: UserIcon,
        shortcut: "⌘P",
        onSelect: () => undefined,
      },
      {
        label: "Settings",
        icon: Settings01Icon,
        shortcut: "⌘,",
        onSelect: () => undefined,
      },
    ],
  },
];

export default function CommandMenuDemo() {
  const [open, setOpen] = useState(false);

  return (
    <CommandMenu
      groups={groups}
      onOpenChange={setOpen}
      open={open}
      trigger={
        <Button size="sm" variant="outline">
          Open command menu
          <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
            ⌘K
          </kbd>
        </Button>
      }
    />
  );
}
