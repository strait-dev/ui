"use client";

import { cn } from "../utils/index";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/** Semantic colour states for {@link Tracker} blocks. */
type TrackerStatus = "muted" | "success" | "warning" | "info" | "destructive";

const trackerStatusColors: Record<TrackerStatus, string> = {
  muted: "bg-secondary",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
};

/**
 * A single cell in a {@link Tracker}.
 *
 * Each block represents one observation (e.g. a day of uptime, a build, a
 * deployment). Prefer `status` for design-system semantic colours; `color`
 * remains as an escape hatch for custom token-backed classes.
 */
interface TrackerBlockProps {
  /** Custom Tailwind background class escape hatch for this block. */
  color?: string;
  /** Background class used when `status`, `color`, and `defaultStatus` are omitted. */
  defaultBackgroundColor?: string;
  /** Semantic background used when `status` and `color` are omitted. */
  defaultStatus?: TrackerStatus;
  /** Skip the tooltip entirely for this block. */
  disabledTooltip?: boolean;
  /** Stable React key when the data has no natural id. */
  key?: string | number;
  /** Semantic colour for this block. Prefer this over `color`. */
  status?: TrackerStatus;
  /** Tooltip label shown on hover/focus. */
  tooltip?: string;
}

const blockOuter =
  "h-full min-w-0 flex-1 overflow-hidden rounded-[2px] first:rounded-s-md last:rounded-e-md";

const Block = ({
  color,
  status,
  tooltip,
  disabledTooltip,
  defaultStatus,
  defaultBackgroundColor,
}: TrackerBlockProps) => {
  const fillColor =
    color ??
    (status
      ? trackerStatusColors[status]
      : (defaultBackgroundColor ??
        trackerStatusColors[defaultStatus ?? "muted"]));

  const fill = (
    <div
      className={cn("size-full transition hover:opacity-70", fillColor)}
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
          "outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50"
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
  /** Background class escape hatch for blocks that omit `status`, `color`, and `defaultStatus`. */
  defaultBackgroundColor?: string;
  /** Semantic background used when a block omits `status` and `color`. */
  defaultStatus?: TrackerStatus;
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
 * - `status` maps blocks to semantic design tokens. Use `color` only as a
 *   custom token-backed escape hatch.
 *
 * @example
 * ```tsx
 * <Tracker
 *   data={[
 *     { status: "success", tooltip: "Operational" },
 *     { status: "warning", tooltip: "Degraded" },
 *     { status: "destructive", tooltip: "Outage" },
 *   ]}
 * />
 * ```
 */
const Tracker = ({
  data = [],
  disabledTooltip = false,
  defaultStatus = "muted",
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
          defaultStatus={defaultStatus}
          disabledTooltip={disabledTooltip || block.disabledTooltip}
          key={block.key ?? index}
          {...block}
        />
      ))}
    </div>
  </TooltipProvider>
);

export {
  Tracker,
  type TrackerBlockProps,
  type TrackerProps,
  type TrackerStatus,
};
