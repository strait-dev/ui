import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type * as React from "react";

import { cn } from "../utils/index";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/**
 * A single action displayed in {@link BulkActionBar}.
 *
 * When `icon` is provided the action is rendered as an icon-only {@link Button}
 * wrapped in a {@link Tooltip} so the `label` remains accessible. When no
 * `icon` is provided a labelled `Button` is rendered instead.
 */
type BulkAction = {
  /** Visible label — shown as button text (no icon) or tooltip content (with icon). */
  label: string;
  /** Hugeicons icon value; renders the action as an icon-only button with a tooltip. */
  icon?: IconSvgElement;
  /** Callback fired when the action button is pressed. */
  onClick: () => void;
  /** Visual variant forwarded to the underlying {@link Button}. Defaults to `"ghost"`. */
  variant?: NonNullable<React.ComponentProps<typeof Button>["variant"]>;
};

/**
 * Props for {@link BulkActionBar}.
 */
type BulkActionBarProps = {
  /** Number of currently-selected items, shown as `"N selected"`. */
  selectedCount: number;
  /** Called when the user presses the clear-selection (×) button. */
  onClearSelection: () => void;
  /** Action buttons rendered in the toolbar. */
  actions: BulkAction[];
  /**
   * Positioning strategy.
   *
   * - `"static"` — no position utility applied; the consumer controls placement.
   * - `"fixed"` — `fixed bottom-6 left-1/2 -translate-x-1/2 z-50`.
   *
   * Defaults to `"static"`.
   */
  position?: "fixed" | "static";
  /** Additional class names merged onto the root element. */
  className?: string;
  /**
   * Extra content rendered between the selected-count label and the action
   * buttons. Use this slot for supplementary controls (e.g. a "Select all"
   * checkbox).
   */
  children?: React.ReactNode;
};

/**
 * Floating toolbar that appears when one or more table / list rows are
 * selected, exposing bulk actions and a way to clear the selection.
 *
 * The bar is intentionally **presentational** — it holds no selection state.
 * Pass `selectedCount`, `actions`, and `onClearSelection` from whatever state
 * management layer owns the selection.
 *
 * @remarks
 * - Each action with an `icon` is rendered as an icon-only {@link Button}
 *   wrapped in a {@link Tooltip}; actions without an icon render a labelled
 *   `Button`. Both delegate `variant` down to the underlying `Button`.
 * - A `h-4 w-px bg-border` divider visually separates the actions from the
 *   clear button.
 * - With `position="fixed"` the bar is centred horizontally 24 px above the
 *   bottom of the viewport. Wrap it in a portal if you need to escape an
 *   `overflow: hidden` ancestor.
 * - The `data-slot="bulk-action-bar"` attribute is set on the root element for
 *   reliable selection in tests and CSS.
 *
 * @example
 * ```tsx
 * <BulkActionBar
 *   selectedCount={selectedRows.length}
 *   onClearSelection={() => setSelectedRows([])}
 *   position="fixed"
 *   actions={[
 *     {
 *       label: "Delete",
 *       icon: Delete01Icon,
 *       variant: "destructive",
 *       onClick: handleDelete,
 *     },
 *     {
 *       label: "Archive",
 *       onClick: handleArchive,
 *     },
 *   ]}
 * />
 * ```
 */
function BulkActionBar({
  selectedCount,
  onClearSelection,
  actions,
  position = "static",
  className,
  children,
}: BulkActionBarProps) {
  const isFixed = position === "fixed";

  return (
    <TooltipProvider delay={0}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 shadow-lg",
          isFixed && "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
          className
        )}
        data-slot="bulk-action-bar"
      >
        <span className="select-none text-muted-foreground text-sm tabular-nums">
          {selectedCount} selected
        </span>

        {children}

        {actions.map((action) => {
          const hasIcon = action.icon !== undefined;
          const variant = action.variant ?? "ghost";

          if (hasIcon) {
            return (
              <Tooltip key={action.label}>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={action.label}
                      onClick={() => action.onClick()}
                      size="icon-sm"
                      variant={variant}
                    />
                  }
                >
                  <HugeiconsIcon
                    icon={action.icon as IconSvgElement}
                    size={14}
                  />
                </TooltipTrigger>
                <TooltipContent>{action.label}</TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Button
              key={action.label}
              onClick={() => action.onClick()}
              size="sm"
              variant={variant}
            >
              {action.label}
            </Button>
          );
        })}

        <div aria-hidden="true" className="h-4 w-px bg-border" />

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Clear selection"
                onClick={() => onClearSelection()}
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </TooltipTrigger>
          <TooltipContent>Clear selection</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export { type BulkAction, BulkActionBar, type BulkActionBarProps };
