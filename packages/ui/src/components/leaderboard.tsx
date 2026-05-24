"use client";

import { cn } from "../utils/index";

/**
 * Root of a {@link Leaderboard}. A vertical stack of ranked rows, each with
 * a value-proportional fill bar behind its label.
 *
 * Compose as: `Leaderboard` → (`LeaderboardHeader`?) → `LeaderboardContent`
 * → many `LeaderboardItem` (each containing `LeaderboardStart` +
 * `LeaderboardEnd`).
 *
 * @example
 * ```tsx
 * <Leaderboard>
 *   <LeaderboardHeader>
 *     <LeaderboardTitle>Top pages</LeaderboardTitle>
 *   </LeaderboardHeader>
 *   <LeaderboardContent>
 *     <LeaderboardItem value={4200} maxValue={4200}>
 *       <LeaderboardStart>/home</LeaderboardStart>
 *       <LeaderboardEnd>4,200</LeaderboardEnd>
 *     </LeaderboardItem>
 *   </LeaderboardContent>
 * </Leaderboard>
 * ```
 */
function Leaderboard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-(--leaderboard-gutter,--spacing(4))",
        className
      )}
      data-slot="leaderboard"
      {...props}
    />
  );
}

/** Header region of a {@link Leaderboard} (title + optional action). */
function LeaderboardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 px-(--gutter) has-data-[slot=leaderboard-action]:grid-cols-[1fr_auto]",
        className
      )}
      data-slot="leaderboard-header"
      {...props}
    />
  );
}

/** Title shown in a {@link LeaderboardHeader}. */
function LeaderboardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-balance font-semibold text-base/6", className)}
      data-slot="leaderboard-title"
      {...props}
    />
  );
}

/** Trailing action region of a {@link LeaderboardHeader}. */
function LeaderboardAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      data-slot="leaderboard-action"
      {...props}
    />
  );
}

/** Scrollable list wrapper holding the {@link LeaderboardItem} rows. */
function LeaderboardContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex max-h-96 list-none flex-col gap-y-1", className)}
      data-slot="leaderboard-content"
      {...props}
    />
  );
}

type LeaderboardItemRenderProps = { value: number; percentage: number };

/** Props for {@link LeaderboardItem}. */
interface LeaderboardItemProps
  extends Omit<React.ComponentProps<"li">, "children"> {
  /** Row content, or a render-prop receiving `{ value, percentage }`. */
  children?:
    | React.ReactNode
    | ((values: LeaderboardItemRenderProps) => React.ReactNode);
  /** Upper bound of the scale. Defaults to `100`. */
  maxValue?: number;
  /** Lower bound of the scale. Defaults to `0`. */
  minValue?: number;
  /** Makes the row a button and fires on click/Enter/Space. */
  onAction?: () => void;
  /** The row's value, used to size the fill bar. */
  value: number;
}

function clampPercentage(value: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }
  const ratio = ((value - min) / (max - min)) * 100;
  return Math.min(100, Math.max(0, ratio));
}

/**
 * A single ranked row. Renders a value-proportional fill bar behind its
 * content; pass `onAction` to make the whole row keyboard-activatable.
 */
function LeaderboardItem({
  value,
  minValue = 0,
  maxValue = 100,
  className,
  children,
  onAction,
  ...props
}: LeaderboardItemProps) {
  const percentage = clampPercentage(value, minValue, maxValue);
  const renderValues: LeaderboardItemRenderProps = { value, percentage };
  const content =
    typeof children === "function" ? children(renderValues) : children;

  const baseClassName = cn(
    "relative overflow-hidden rounded-md px-1.5 py-1 text-sm/6 outline-hidden",
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
    className
  );

  const inner = (
    <>
      <span className="relative z-2 flex items-center justify-between font-medium">
        {content}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 start-0 z-1 rounded-e-md bg-secondary/60 transition-[width]",
          onAction && "group-hover:bg-secondary"
        )}
        style={{ width: `${percentage}%` }}
      />
    </>
  );

  return (
    <li className="group" data-slot="leaderboard-item" {...props}>
      {onAction ? (
        // biome-ignore lint/a11y/useSemanticElements: div+role keeps the fill-bar layout and lets the jsdom keydown test exercise activation (a native button does not translate keydown to click in jsdom)
        <div
          className={cn(
            baseClassName,
            "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          )}
          onClick={onAction}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onAction();
            }
          }}
          role="button"
          tabIndex={0}
        >
          {inner}
        </div>
      ) : (
        <div className={cn(baseClassName, "cursor-default")}>{inner}</div>
      )}
    </li>
  );
}

/** Leading region of a {@link LeaderboardItem} — typically icon + name. */
function LeaderboardStart({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("flex items-center gap-x-2", className)}
      data-slot="leaderboard-start"
      {...props}
    />
  );
}

/** Trailing region of a {@link LeaderboardItem} — typically the value. */
function LeaderboardEnd({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("tabular-nums", className)}
      data-slot="leaderboard-end"
      {...props}
    />
  );
}

export {
  Leaderboard,
  LeaderboardAction,
  LeaderboardContent,
  LeaderboardEnd,
  LeaderboardHeader,
  LeaderboardItem,
  type LeaderboardItemProps,
  LeaderboardStart,
  LeaderboardTitle,
};
