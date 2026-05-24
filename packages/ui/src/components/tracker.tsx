"use client";

import { cn } from "../utils/index";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/**
 * A single cell in a {@link Tracker}.
 *
 * Each block represents one observation (e.g. a day of uptime, a build, a
 * deployment). `color` is a Tailwind background class (`bg-success`,
 * `bg-destructive`, …) so blocks stay on the design-system palette.
 */
interface TrackerBlockProps {
  /** Tailwind background class for this block (e.g. `"bg-success"`). */
  color?: string;
  /** Background class used when `color` is omitted. */
  defaultBackgroundColor?: string;
  /** Skip the tooltip entirely for this block. */
  disabledTooltip?: boolean;
  /** Stable React key when the data has no natural id. */
  key?: string | number;
  /** Tooltip label shown on hover/focus. */
  tooltip?: string;
}

const blockOuter =
  "h-full min-w-0 flex-1 overflow-hidden rounded-[2px] first:rounded-s-md last:rounded-e-md";

const Block = ({
  color,
  tooltip,
  disabledTooltip,
  defaultBackgroundColor = "bg-secondary",
}: TrackerBlockProps) => {
  const fill = (
    <div
      className={cn(
        "size-full transition hover:opacity-70",
        color || defaultBackgroundColor
      )}
      data-slot="tracker-block"
    />
  );

  if (disabledTooltip || !tooltip) {
    return <div className={blockOuter}>{fill}</div>;
  }

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          blockOuter,
          "outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50"
        )}
        render={<div />}
      >
        {fill}
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1.5 text-xs" side="top" sideOffset={8}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};

/** Props for {@link Tracker}. */
interface TrackerProps
  extends React.ComponentProps<"div">,
    Pick<TrackerBlockProps, "disabledTooltip"> {
  /** Ordered list of blocks to render left-to-right. */
  data: TrackerBlockProps[];
  /** Background class for blocks that omit their own `color`. */
  defaultBackgroundColor?: string;
}

/**
 * A compact status timeline — a row of small colored blocks, each with an
 * optional hover tooltip. Ideal for uptime, build history, or any per-period
 * status strip (à la a status-page incident bar).
 *
 * @remarks
 * - Blocks stretch to fill the available width; the first/last are rounded.
 * - Pass `disabledTooltip` on the root to suppress all tooltips, or per-block
 *   via the data entry.
 * - Colors are Tailwind background classes so the strip stays on-palette and
 *   theme-aware.
 *
 * @example
 * ```tsx
 * <Tracker
 *   data={[
 *     { color: "bg-success", tooltip: "Operational" },
 *     { color: "bg-warning", tooltip: "Degraded" },
 *     { color: "bg-destructive", tooltip: "Outage" },
 *   ]}
 * />
 * ```
 */
const Tracker = ({
  data = [],
  disabledTooltip = false,
  defaultBackgroundColor,
  className,
  ref,
  ...props
}: TrackerProps) => (
  <TooltipProvider>
    <div
      className={cn("group flex h-8 w-full items-stretch gap-0.5", className)}
      data-slot="tracker"
      ref={ref}
      {...props}
    >
      {data.map((block, index) => (
        <Block
          defaultBackgroundColor={defaultBackgroundColor}
          disabledTooltip={disabledTooltip || block.disabledTooltip}
          key={block.key ?? index}
          {...block}
        />
      ))}
    </div>
  </TooltipProvider>
);

export { Tracker, type TrackerBlockProps, type TrackerProps };
