"use client";

import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import copy from "copy-to-clipboard";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "../utils/index";
import { Button } from "./button";
import { toast } from "./toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

/** Props for {@link IdCell}. */
export interface IdCellProps {
  /** Additional classes merged onto the outermost wrapper `div`. */
  className?: string;
  /** Full identifier string to display and copy. */
  id: string;
  /**
   * Number of characters to show before the trailing ellipsis.
   *
   * Defaults to `6` to preserve the original behaviour. Useful when the
   * column is wider (increase) or extremely narrow (decrease).
   *
   * @example
   * ```tsx
   * // Show first 8 chars instead of 6
   * <IdCell id={row.original.id} length={8} />
   * ```
   */
  length?: number;
}

/**
 * Table cell that displays a truncated identifier with a copy-to-clipboard
 * button, intended for use inside a data table column definition.
 *
 * The `id` is shortened to its first {@link IdCellProps.length} characters
 * (followed by `…`); defaults to `6` for backwards compatibility. A tooltip
 * on the truncated text reveals the full value on hover. A ghost icon button
 * copies the full `id` to the system clipboard and shows a success toast,
 * with an animated icon swap (copy → checkmark) that resets after 2 seconds.
 *
 * @remarks
 * - The copy button carries `aria-label="Copy ID"` for screen-reader
 *   accessibility.
 * - The icon transition uses `motion/react` `AnimatePresence` with
 *   `mode="wait"` so the exit animation completes before the enter plays.
 *
 * @example
 * ```tsx
 * // Inside a TanStack Table column definition:
 * {
 *   accessorKey: "id",
 *   cell: ({ row }) => <IdCell id={row.original.id} />,
 * }
 * ```
 */
export function IdCell({ id, className, length = 6 }: IdCellProps) {
  const [isCopied, setIsCopied] = useState(false);
  // Show only the first `length` chars to keep the column narrow.
  const truncatedId = id.slice(0, length);

  const handleCopy = () => {
    copy(id);
    setIsCopied(true);
    toast.success("ID copied to clipboard");
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const Icon = isCopied ? Tick01Icon : Copy01Icon;

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-slot="id-cell"
    >
      <Tooltip>
        <TooltipTrigger
          render={<span className="font-mono text-muted-foreground text-sm" />}
        >
          {truncatedId}...
        </TooltipTrigger>
        <TooltipContent>
          <span className="font-mono">{id}</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              aria-label="Copy ID"
              className="size-7"
              onClick={handleCopy}
              size="icon"
              variant="ghost"
            />
          }
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center"
              exit={{ scale: 0, opacity: 0 }}
              initial={{ scale: 0, opacity: 0 }}
              key={isCopied ? "check" : "copy"}
              transition={{ duration: 0.15 }}
            >
              <HugeiconsIcon icon={Icon} size={12} />
            </motion.span>
          </AnimatePresence>
        </TooltipTrigger>
        <TooltipContent>Copy ID</TooltipContent>
      </Tooltip>
    </div>
  );
}
