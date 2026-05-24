"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";

import { cn } from "../utils/index";

/** Props for {@link Separator}. */
export type SeparatorProps = SeparatorPrimitive.Props;

/**
 * A thin dividing line between sections of content.
 *
 * Built on Base UI's `Separator` primitive, which renders
 * `role="separator"` for assistive technology. Orientation defaults to
 * `"horizontal"` (full-width 1 px rule); set `orientation="vertical"` for
 * a 1 px column divider that stretches to the cross-axis of its flex
 * container.
 *
 * @remarks
 * Used internally by {@link ButtonGroupSeparator} with vertical
 * orientation.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" className="h-4" />
 * ```
 */
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      data-slot="separator"
      orientation={orientation}
      {...props}
    />
  );
}

export { Separator };
