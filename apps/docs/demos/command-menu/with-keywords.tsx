"use client";

import {
  FileEditIcon,
  FolderLibraryIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@strait/ui/components/button";
import {
  CommandMenu,
  type CommandMenuProps,
} from "@strait/ui/components/command-menu";
import { useState } from "react";

const groups: CommandMenuProps["groups"] = [
  {
    heading: "Files",
    items: [
      {
        label: "Open file",
        icon: FolderLibraryIcon,
        keywords: ["document", "load", "import", "browse"],
        onSelect: () => undefined,
      },
      {
        label: "New document",
        icon: FileEditIcon,
        keywords: ["create", "write", "blank"],
        onSelect: () => undefined,
      },
      {
        label: "Search everything",
        icon: Search01Icon,
        shortcut: "⌘F",
        keywords: ["find", "lookup", "filter"],
        onSelect: () => undefined,
      },
    ],
  },
];

export default function CommandMenuWithKeywordsDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-muted-foreground text-sm">
        Try typing{" "}
        <kbd className="rounded border border-border bg-muted px-1 font-mono text-xs">
          document
        </kbd>{" "}
        or{" "}
        <kbd className="rounded border border-border bg-muted px-1 font-mono text-xs">
          find
        </kbd>{" "}
        — keywords broaden the search beyond the visible label.
      </p>
      <CommandMenu
        groups={groups}
        onOpenChange={setOpen}
        open={open}
        trigger={
          <Button size="sm" variant="outline">
            Open palette
          </Button>
        }
      />
    </div>
  );
}
