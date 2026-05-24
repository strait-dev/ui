import {
  Home01Icon,
  Search01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "./button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  type CommandListSize,
  CommandSeparator,
  CommandShortcut,
} from "./command";

const meta: Meta<typeof Command> = {
  title: "Navigation/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A command palette for fast keyboard-driven navigation.",
          "",
          "Built on **cmdk** (`Command` primitive). Key composition:",
          "- `Command` — root container.",
          "- `CommandInput` — search input; wraps `InputGroup` for consistent styling.",
          "- `CommandList` — scrollable result list.",
          "- `CommandGroup` — labelled group of items.",
          "- `CommandItem` — individual result row; auto-renders a checkmark when checked.",
          "- `CommandShortcut` — keyboard shortcut label aligned to the right.",
          "- `CommandSeparator` — horizontal rule between groups.",
          "- `CommandEmpty` — shown when no results match.",
          "- `CommandDialog` — wraps the palette in a centred `Dialog`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    /** Passed to `CommandList`; controls item density for the whole palette. */
  },
  args: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — type to filter items. */
export const Playground: Story = {
  render: () => (
    <div className="w-full max-w-sm rounded-xl border shadow-sm">
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <HugeiconsIcon icon={Home01Icon} />
              Dashboard
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Search01Icon} />
              Search
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Settings01Icon} />
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

/** Multiple groups with separators and keyboard shortcuts. */
export const WithGroups: Story = {
  render: () => (
    <div className="w-full max-w-sm rounded-xl border shadow-sm">
      <Command>
        <CommandInput placeholder="Search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem>
              <HugeiconsIcon icon={Home01Icon} />
              Dashboard
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Search01Icon} />
              Search
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <HugeiconsIcon icon={UserIcon} />
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Settings01Icon} />
              Preferences
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

/** Selecting an item marks it with a checkmark via `data-checked`. */
export const WithSelection: Story = {
  render: () => {
    const options = ["React", "Vue", "Svelte", "Angular", "Solid"];
    const [selected, setSelected] = useState<string>("React");

    return (
      <div className="flex w-full max-w-sm flex-col gap-3">
        <p className="text-muted-foreground text-sm">
          Selected: <strong>{selected}</strong>
        </p>
        <div className="rounded-xl border shadow-sm">
          <Command>
            <CommandInput placeholder="Filter frameworks…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Frameworks">
                {options.map((opt) => (
                  <CommandItem
                    data-checked={selected === opt || undefined}
                    key={opt}
                    onSelect={() => setSelected(opt)}
                    value={opt}
                  >
                    {opt}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    );
  },
};

/** No input — static list only. */
export const StaticList: Story = {
  render: () => (
    <div className="w-full max-w-xs rounded-xl border shadow-sm">
      <Command>
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem>
              <HugeiconsIcon icon={Home01Icon} />
              Go to Dashboard
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={UserIcon} />
              View Profile
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Settings01Icon} />
              Open Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

/** Empty state — shown when the search returns no matches. */
export const EmptyState: Story = {
  render: () => (
    <div className="w-full max-w-sm rounded-xl border shadow-sm">
      <Command>
        <CommandInput
          placeholder="Search for something impossible…"
          value="zzz"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    </div>
  ),
};

/**
 * All three density sizes (`sm`, `default`, `lg`) side by side.
 * The `size` prop lives on `CommandList` and cascades via `data-size` so
 * every `CommandItem` inside responds automatically.
 */
export const Sizes: Story = {
  render: () => {
    const items = ["Dashboard", "Search", "Settings", "Profile"];
    const sizes: CommandListSize[] = ["sm", "default", "lg"];
    const labels: Record<CommandListSize, string> = {
      sm: "sm — compact",
      default: "default — standard",
      lg: "lg — spacious",
    };

    return (
      <div className="flex flex-wrap items-start gap-4">
        {sizes.map((size) => (
          <div className="flex flex-col gap-1" key={size}>
            <span className="font-medium text-muted-foreground text-xs">
              {labels[size]}
            </span>
            <div className="w-52 rounded-xl border shadow-sm">
              <Command>
                <CommandInput placeholder="Search…" />
                <CommandList size={size}>
                  <CommandEmpty>No results.</CommandEmpty>
                  <CommandGroup heading="Actions">
                    {items.map((item) => (
                      <CommandItem key={item} value={item.toLowerCase()}>
                        <HugeiconsIcon icon={Home01Icon} />
                        {item}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/** Open the command palette inside a Dialog via `CommandDialog`. */
export const DialogMode: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => setOpen(true)} variant="outline">
          <HugeiconsIcon data-icon="inline-start" icon={Search01Icon} />
          Open Command Palette
          <span className="ml-2 rounded border px-1 font-mono text-muted-foreground text-xs">
            ⌘K
          </span>
        </Button>

        <CommandDialog onOpenChange={setOpen} open={open}>
          <Command>
            <CommandInput placeholder="Type a command…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem onSelect={() => setOpen(false)}>
                  <HugeiconsIcon icon={Home01Icon} />
                  Go Home
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  <HugeiconsIcon icon={UserIcon} />
                  Profile
                </CommandItem>
                <CommandItem onSelect={() => setOpen(false)}>
                  <HugeiconsIcon icon={Settings01Icon} />
                  Settings
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
    );
  },
};
