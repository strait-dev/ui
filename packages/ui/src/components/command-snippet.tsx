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

const managerOrder: CommandSnippetManager[] = ["bun", "npm", "pnpm", "yarn"];

/** CVA recipe for the {@link CommandSnippet} root. */
const commandSnippetVariants = cva(
  "overflow-hidden rounded-lg bg-surface-terminal text-surface-terminal-foreground shadow-sm",
  {
    variants: {
      /** Density preset for the snippet chrome and command line. */
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const commandPaddingClasses: Record<
  NonNullable<CommandSnippetProps["size"]>,
  string
> = {
  sm: "px-3 py-2",
  default: "px-4 py-3",
  lg: "px-4 py-3.5",
};

/** Props for {@link CommandSnippet}. */
type CommandSnippetProps = Omit<React.ComponentProps<"section">, "children"> &
  VariantProps<typeof commandSnippetVariants> & {
    /** Single command to display when package-manager variants are unnecessary. */
    command?: string;
    /** Package-manager-specific commands, shown as selectable tabs. */
    commands?: CommandSnippetCommands;
    /** Initially selected package manager when `commands` is provided. */
    defaultManager?: CommandSnippetManager;
    /** Optional title shown in the header. */
    title?: string;
    /** Prompt prefix shown before the command. */
    prompt?: string;
    /** Whether to show a clipboard button for the active command. */
    copyable?: boolean;
  };

/**
 * Terminal-style command snippet with optional package-manager switching.
 *
 * Use `CommandSnippet` for install commands, CLI setup steps, and docs examples
 * that need one-click copy. Pass a single `command` for static usage, or a
 * `commands` map to expose Bun/npm/pnpm/yarn choices while keeping one active
 * command visible and copyable.
 *
 * @remarks
 * - The surface uses `bg-surface-terminal` and
 *   `text-surface-terminal-foreground`, so it stays themeable and consistent
 *   with terminal-style `CodeBlock` usage.
 * - Package-manager buttons are real buttons with `aria-pressed`, so keyboard
 *   and screen-reader users can switch the active command.
 * - If `defaultManager` is omitted or unavailable, the first manager in
 *   Bun → npm → pnpm → yarn order is selected.
 *
 * @example
 * ```tsx
 * <CommandSnippet command="bun add @strait/ui" />
 *
 * <CommandSnippet
 *   commands={{
 *     bun: "bun add @strait/ui",
 *     npm: "npm install @strait/ui",
 *     pnpm: "pnpm add @strait/ui",
 *     yarn: "yarn add @strait/ui",
 *   }}
 *   defaultManager="bun"
 *   title="Install"
 * />
 * ```
 */
function CommandSnippet({
  command,
  commands,
  defaultManager = "bun",
  title,
  prompt = "$",
  copyable = true,
  size = "default",
  className,
  "aria-label": ariaLabel = "Command snippet",
  ...props
}: CommandSnippetProps) {
  const availableManagers = React.useMemo(
    () => managerOrder.filter((manager) => commands?.[manager]),
    [commands]
  );
  const selectedManager = useSelectedManager(availableManagers, defaultManager);
  const resolvedCommand = getResolvedCommand(
    command,
    commands,
    selectedManager
  );
  const showTabs = availableManagers.length > 1;
  const showHeader = Boolean(title || showTabs || copyable);
  const commandPadding = commandPaddingClasses[size ?? "default"];

  return (
    <section
      aria-label={ariaLabel}
      className={cn(commandSnippetVariants({ size }), className)}
      data-slot="command-snippet"
      {...props}
    >
      {showHeader && (
        <CommandSnippetHeader
          availableManagers={availableManagers}
          copyable={copyable}
          resolvedCommand={resolvedCommand}
          selectedManager={selectedManager.value}
          setSelectedManager={selectedManager.set}
          showTabs={showTabs}
          title={title}
        />
      )}

      <pre
        className={cn(
          "m-0 overflow-x-auto bg-transparent font-mono leading-relaxed",
          commandPadding
        )}
        data-slot="command-snippet-body"
      >
        <code className="flex min-w-max items-start gap-3">
          <span
            aria-hidden="true"
            className="select-none text-surface-terminal-foreground/50"
            data-slot="command-snippet-prompt"
          >
            {prompt}
          </span>
          <span data-slot="command-snippet-command">{resolvedCommand}</span>
        </code>
      </pre>
    </section>
  );
}

type SelectedManagerState = {
  value: CommandSnippetManager | undefined;
  set: React.Dispatch<React.SetStateAction<CommandSnippetManager | undefined>>;
};

function useSelectedManager(
  availableManagers: CommandSnippetManager[],
  defaultManager: CommandSnippetManager
): SelectedManagerState {
  const initialManager = getInitialManager(availableManagers, defaultManager);
  const [selectedManager, setSelectedManager] = React.useState<
    CommandSnippetManager | undefined
  >(initialManager);

  React.useEffect(() => {
    if (!(selectedManager && availableManagers.includes(selectedManager))) {
      setSelectedManager(initialManager);
    }
  }, [availableManagers, initialManager, selectedManager]);

  return { value: selectedManager, set: setSelectedManager };
}

function getInitialManager(
  availableManagers: CommandSnippetManager[],
  defaultManager: CommandSnippetManager
) {
  return availableManagers.includes(defaultManager)
    ? defaultManager
    : availableManagers[0];
}

function getResolvedCommand(
  command: string | undefined,
  commands: CommandSnippetCommands | undefined,
  selectedManager: SelectedManagerState
) {
  const managerCommand = selectedManager.value
    ? commands?.[selectedManager.value]
    : undefined;

  return managerCommand ?? command ?? "";
}

type CommandSnippetHeaderProps = {
  availableManagers: CommandSnippetManager[];
  copyable: boolean;
  resolvedCommand: string;
  selectedManager: CommandSnippetManager | undefined;
  setSelectedManager: React.Dispatch<
    React.SetStateAction<CommandSnippetManager | undefined>
  >;
  showTabs: boolean;
  title: React.ReactNode;
};

function CommandSnippetHeader({
  availableManagers,
  copyable,
  resolvedCommand,
  selectedManager,
  setSelectedManager,
  showTabs,
  title,
}: CommandSnippetHeaderProps) {
  return (
    <div
      className="flex min-h-9 items-center justify-between gap-3 border-surface-terminal-foreground/10 border-b px-3 py-1.5"
      data-slot="command-snippet-header"
    >
      <div className="flex min-w-0 items-center gap-2">
        {title && (
          <span
            className="truncate font-medium text-surface-terminal-foreground"
            data-slot="command-snippet-title"
          >
            {title}
          </span>
        )}
        {showTabs && (
          <CommandSnippetManagers
            availableManagers={availableManagers}
            selectedManager={selectedManager}
            setSelectedManager={setSelectedManager}
          />
        )}
      </div>
      {copyable && (
        <CopyButton
          aria-label="Copy command"
          className="text-surface-terminal-foreground/75 hover:bg-surface-terminal-foreground/10 hover:text-surface-terminal-foreground"
          text={resolvedCommand}
        />
      )}
    </div>
  );
}

type CommandSnippetManagersProps = {
  availableManagers: CommandSnippetManager[];
  selectedManager: CommandSnippetManager | undefined;
  setSelectedManager: React.Dispatch<
    React.SetStateAction<CommandSnippetManager | undefined>
  >;
};

function CommandSnippetManagers({
  availableManagers,
  selectedManager,
  setSelectedManager,
}: CommandSnippetManagersProps) {
  return (
    <fieldset
      className="flex items-center gap-1"
      data-slot="command-snippet-manager-list"
    >
      <legend className="sr-only">Package manager</legend>
      {availableManagers.map((manager) => {
        const selected = manager === selectedManager;
        return (
          <Button
            aria-pressed={selected}
            className={cn(
              "h-6 px-2 text-surface-terminal-foreground/75 text-xs hover:bg-surface-terminal-foreground/10 hover:text-surface-terminal-foreground",
              selected &&
                "bg-surface-terminal-foreground/10 text-surface-terminal-foreground"
            )}
            data-slot="command-snippet-manager"
            key={manager}
            onClick={() => setSelectedManager(manager)}
            size="sm"
            type="button"
            variant="ghost"
          >
            {manager}
          </Button>
        );
      })}
    </fieldset>
  );
}

export {
  CommandSnippet,
  type CommandSnippetCommands,
  type CommandSnippetManager,
  type CommandSnippetProps,
  commandSnippetVariants,
};
