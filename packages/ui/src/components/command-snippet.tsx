"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/index";
import { Button } from "./button";
import { CopyButton } from "./copy-button";

/** Supported package-manager labels for {@link CommandSnippet}. */
type CommandSnippetManager = "bun" | "npm" | "pnpm" | "yarn";

/** Command map accepted by {@link CommandSnippet}. */
type CommandSnippetCommands = Partial<Record<CommandSnippetManager, string>>;

/** One selectable command option in a {@link CommandSnippet}. */
type CommandSnippetItem = {
  /** Stable selection value. Defaults to `label` when omitted. */
  value?: string;
  /** Visible label for the selector button. */
  label: string;
  /** Command displayed and copied when this item is selected. */
  command: string;
};

const defaultManagerOrder: CommandSnippetManager[] = [
  "bun",
  "npm",
  "pnpm",
  "yarn",
];

/** CVA recipe for the {@link CommandSnippet} root. */
const commandSnippetVariants = cva("overflow-hidden rounded-lg", {
  variants: {
    /** Surface treatment for the snippet chrome. */
    variant: {
      terminal:
        "bg-surface-terminal text-surface-terminal-foreground shadow-sm",
      card: "border bg-card text-foreground shadow-sm",
      muted: "border bg-muted/50 text-foreground shadow-sm",
      minimal:
        "border border-transparent bg-transparent text-foreground shadow-none",
    },
    /** Density preset for the snippet chrome and command line. */
    size: {
      xs: "text-xs",
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "terminal",
    size: "default",
  },
});

const commandPaddingClasses: Record<
  NonNullable<CommandSnippetProps["size"]>,
  string
> = {
  xs: "px-2.5 py-1.5",
  sm: "px-3 py-2",
  default: "px-4 py-3",
  lg: "px-4 py-3.5",
};

const headerPaddingClasses: Record<
  NonNullable<CommandSnippetProps["size"]>,
  string
> = {
  xs: "min-h-7 px-2 py-1",
  sm: "min-h-8 px-2.5 py-1.5",
  default: "min-h-9 px-3 py-1.5",
  lg: "min-h-10 px-3.5 py-2",
};

/** Props for {@link CommandSnippet}. */
type CommandSnippetProps = Omit<React.ComponentProps<"section">, "children"> &
  VariantProps<typeof commandSnippetVariants> & {
    /** Single command to display when selectable variants are unnecessary. */
    command?: string;
    /** Generic selectable commands, useful for Docker, curl, Homebrew, or CLIs. */
    items?: CommandSnippetItem[];
    /** Package-manager-specific commands, converted to selectable items. */
    commands?: CommandSnippetCommands;
    /** Order used when converting `commands` to package-manager items. */
    managerOrder?: CommandSnippetManager[];
    /** Initially selected package manager when `commands` is provided. */
    defaultManager?: CommandSnippetManager;
    /** Controlled selected item value. */
    value?: string;
    /** Initial selected item value for uncontrolled snippets. */
    defaultValue?: string;
    /** Called when a selectable command is chosen. */
    onValueChange?: (value: string, item: CommandSnippetItem) => void;
    /** Optional title shown in the header. */
    title?: string;
    /** Prompt prefix shown before the command. */
    prompt?: string;
    /** Whether to show the prompt prefix. */
    showPrompt?: boolean;
    /** Force the header on/off. Omit to derive from title, tabs, and copy. */
    showHeader?: boolean;
    /** Whether long commands wrap instead of scrolling horizontally. */
    wrap?: boolean;
    /** Constrains the body height; numeric values are treated as pixels. */
    maxHeight?: number | string;
    /** Whether to show a clipboard button for the active command. */
    copyable?: boolean;
    /** Accessible label for the copy button. */
    copyLabel?: string;
    /** Called after a command is copied. */
    onCopy?: (command: string) => void;
  };

/**
 * Terminal-style command snippet with optional selectable commands.
 *
 * Use `CommandSnippet` for install commands, CLI setup steps, and docs examples
 * that need one-click copy. Pass a single `command` for static usage, a generic
 * `items` array for arbitrary selectable commands, or a `commands` map for the
 * Bun/npm/pnpm/yarn shorthand.
 *
 * @remarks
 * - `variant="terminal"` uses `bg-surface-terminal` and
 *   `text-surface-terminal-foreground`, so it stays themeable and consistent
 *   with terminal-style `CodeBlock` usage.
 * - Selector buttons are real buttons with `aria-pressed`, so keyboard and
 *   screen-reader users can switch the active command.
 * - `items` takes precedence over `commands`; keep using `commands` for simple
 *   package-manager docs and switch to `items` for Docker, curl, or custom CLIs.
 *
 * @example
 * ```tsx
 * <CommandSnippet command="bun add @strait/ui" />
 *
 * <CommandSnippet
 *   items={[
 *     { label: "bun", command: "bun add @strait/ui" },
 *     { label: "docker", command: "docker run strait/ui" },
 *   ]}
 * />
 * ```
 */
function CommandSnippet({
  command,
  items,
  commands,
  managerOrder = defaultManagerOrder,
  defaultManager = "bun",
  value,
  defaultValue,
  onValueChange,
  title,
  prompt = "$",
  showPrompt = true,
  showHeader,
  wrap = false,
  maxHeight,
  copyable = true,
  copyLabel = "Copy command",
  onCopy,
  variant = "terminal",
  size = "default",
  className,
  "aria-label": ariaLabel = "Command snippet",
  ...props
}: CommandSnippetProps) {
  const resolvedItems = React.useMemo(
    () => getCommandItems(items, commands, managerOrder),
    [commands, items, managerOrder]
  );
  const selection = useCommandSelection({
    defaultValue: defaultValue ?? defaultManager,
    items: resolvedItems,
    onValueChange,
    value,
  });
  const activeCommand = selection.item?.command ?? command ?? "";
  const showTabs = resolvedItems.length > 1;
  const resolvedShowHeader =
    showHeader ?? Boolean(title || showTabs || copyable);
  const commandPadding = commandPaddingClasses[size ?? "default"];
  const bodyStyle = getMaxHeightStyle(maxHeight);

  return (
    <section
      aria-label={ariaLabel}
      className={cn(commandSnippetVariants({ variant, size }), className)}
      data-slot="command-snippet"
      {...props}
    >
      {resolvedShowHeader && (
        <CommandSnippetHeader
          copyable={copyable}
          copyLabel={copyLabel}
          items={resolvedItems}
          onCopy={onCopy}
          selectedValue={selection.value}
          setSelectedValue={selection.setValue}
          showTabs={showTabs}
          size={size}
          title={title}
          value={activeCommand}
          variant={variant}
        />
      )}

      <pre
        className={cn(
          "m-0 overflow-auto bg-transparent font-mono leading-relaxed",
          commandPadding
        )}
        data-slot="command-snippet-body"
        style={bodyStyle}
      >
        <code
          className={cn(
            "flex items-start gap-3",
            wrap ? "min-w-0 whitespace-pre-wrap break-all" : "min-w-max"
          )}
        >
          {showPrompt && (
            <span
              aria-hidden="true"
              className={cn(
                "select-none text-muted-foreground",
                variant === "terminal" && "text-surface-terminal-foreground/50"
              )}
              data-slot="command-snippet-prompt"
            >
              {prompt}
            </span>
          )}
          <span data-slot="command-snippet-command">{activeCommand}</span>
        </code>
      </pre>
    </section>
  );
}

type UseCommandSelectionInput = {
  defaultValue: string | undefined;
  items: CommandSnippetItem[];
  onValueChange: CommandSnippetProps["onValueChange"];
  value: string | undefined;
};

function useCommandSelection({
  defaultValue,
  items,
  onValueChange,
  value,
}: UseCommandSelectionInput) {
  const initialValue = getInitialValue(items, defaultValue);
  const [uncontrolledValue, setUncontrolledValue] =
    React.useState(initialValue);
  const selectedValue = value ?? uncontrolledValue;
  const selectedItem = getSelectedItem(items, selectedValue);

  React.useEffect(() => {
    if (value === undefined && !(selectedItem || items.length === 0)) {
      setUncontrolledValue(initialValue);
    }
  }, [initialValue, items.length, selectedItem, value]);

  const setValue = React.useCallback(
    (nextItem: CommandSnippetItem) => {
      const nextValue = getRequiredItemValue(nextItem);
      if (value === undefined) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue, nextItem);
    },
    [onValueChange, value]
  );

  return { item: selectedItem, setValue, value: getItemValue(selectedItem) };
}

function getCommandItems(
  items: CommandSnippetItem[] | undefined,
  commands: CommandSnippetCommands | undefined,
  managerOrder: CommandSnippetManager[]
) {
  if (items?.length) {
    return items;
  }

  return managerOrder.flatMap((manager) => {
    const command = commands?.[manager];
    return command ? [{ command, label: manager, value: manager }] : [];
  });
}

function getInitialValue(
  items: CommandSnippetItem[],
  defaultValue: string | undefined
) {
  if (
    defaultValue &&
    items.some((item) => getItemValue(item) === defaultValue)
  ) {
    return defaultValue;
  }

  return getItemValue(items[0]);
}

function getSelectedItem(
  items: CommandSnippetItem[],
  value: string | undefined
) {
  return items.find((item) => getItemValue(item) === value) ?? items[0];
}

function getItemValue(item: CommandSnippetItem | undefined) {
  return item?.value ?? item?.label;
}

function getRequiredItemValue(item: CommandSnippetItem) {
  return item.value ?? item.label;
}

function getMaxHeightStyle(maxHeight: CommandSnippetProps["maxHeight"]) {
  if (maxHeight === undefined) {
    return;
  }

  return {
    maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
  };
}

type CommandSnippetHeaderProps = {
  copyable: boolean;
  copyLabel: string;
  items: CommandSnippetItem[];
  onCopy: CommandSnippetProps["onCopy"];
  selectedValue: string | undefined;
  setSelectedValue: (item: CommandSnippetItem) => void;
  showTabs: boolean;
  size: CommandSnippetProps["size"];
  title: React.ReactNode;
  value: string;
  variant: CommandSnippetProps["variant"];
};

function CommandSnippetHeader({
  copyable,
  copyLabel,
  items,
  onCopy,
  selectedValue,
  setSelectedValue,
  showTabs,
  size,
  title,
  value,
  variant,
}: CommandSnippetHeaderProps) {
  const headerPadding = headerPaddingClasses[size ?? "default"];

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b",
        variant === "terminal" && "border-surface-terminal-foreground/10",
        variant === "minimal" && "border-transparent",
        headerPadding
      )}
      data-slot="command-snippet-header"
    >
      <div className="flex min-w-0 items-center gap-2">
        {title && (
          <span
            className={cn(
              "truncate font-medium text-foreground",
              variant === "terminal" && "text-surface-terminal-foreground"
            )}
            data-slot="command-snippet-title"
          >
            {title}
          </span>
        )}
        {showTabs && (
          <CommandSnippetItems
            items={items}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            variant={variant}
          />
        )}
      </div>
      {copyable && (
        <CopyButton
          aria-label={copyLabel}
          className={cn(
            variant === "terminal" &&
              "text-surface-terminal-foreground/75 hover:bg-surface-terminal-foreground/10 hover:text-surface-terminal-foreground"
          )}
          onCopied={onCopy}
          text={value}
        />
      )}
    </div>
  );
}

type CommandSnippetItemsProps = {
  items: CommandSnippetItem[];
  selectedValue: string | undefined;
  setSelectedValue: (item: CommandSnippetItem) => void;
  variant: CommandSnippetProps["variant"];
};

function CommandSnippetItems({
  items,
  selectedValue,
  setSelectedValue,
  variant,
}: CommandSnippetItemsProps) {
  return (
    <fieldset
      className="flex items-center gap-1"
      data-slot="command-snippet-item-list"
    >
      <legend className="sr-only">Command variant</legend>
      {items.map((item) => {
        const itemValue = getItemValue(item);
        const selected = itemValue === selectedValue;
        return (
          <Button
            aria-pressed={selected}
            className={cn(
              "h-6 px-2 text-xs",
              variant === "terminal" &&
                "text-surface-terminal-foreground/75 hover:bg-surface-terminal-foreground/10 hover:text-surface-terminal-foreground",
              variant !== "terminal" && "text-muted-foreground",
              selected &&
                (variant === "terminal"
                  ? "bg-surface-terminal-foreground/10 text-surface-terminal-foreground"
                  : "bg-muted text-foreground")
            )}
            data-slot="command-snippet-item"
            key={itemValue}
            onClick={() => setSelectedValue(item)}
            size="sm"
            type="button"
            variant="ghost"
          >
            {item.label}
          </Button>
        );
      })}
    </fieldset>
  );
}

export {
  CommandSnippet,
  type CommandSnippetCommands,
  type CommandSnippetItem,
  type CommandSnippetManager,
  type CommandSnippetProps,
  commandSnippetVariants,
};
