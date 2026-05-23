"use client";

import { format, formatDistanceToNow } from "date-fns";
import * as React from "react";

import { cn } from "../utils/index";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

/**
 * Props for {@link RelativeTimeCard}.
 */
type RelativeTimeCardProps = {
  /**
   * The date to display. Accepts a `Date` object, an ISO string, or a numeric
   * epoch timestamp — all are normalised via `new Date(date)`.
   */
  date: Date | string | number;
  /**
   * IANA time-zone identifiers to show as additional rows in the hover card,
   * e.g. `["America/New_York", "Europe/London", "Asia/Tokyo"]`.
   *
   * Rows whose timezone identifier is invalid are silently skipped.
   *
   * @default []
   */
  timezones?: string[];
  /**
   * How often (in milliseconds) the relative-time string refreshes.
   *
   * @default 60000
   */
  updateInterval?: number;
  /**
   * Which side of the trigger the hover card opens on.
   *
   * @default "bottom"
   */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Alignment of the hover card relative to the trigger.
   *
   * @default "center"
   */
  align?: "start" | "center" | "end";
  /** Extra classes merged onto the trigger `<span>`. */
  className?: string;
  /**
   * When provided, replaces the live relative-time string as the trigger label.
   * The hover card still shows the absolute time and timezone rows.
   */
  children?: React.ReactNode;
};

/**
 * Formats `target` in the given IANA `timezone` using `Intl.DateTimeFormat`.
 *
 * Returns `null` when the timezone identifier is invalid so callers can skip
 * the row instead of crashing.
 */
function formatInTimezone(target: Date, timezone: string): string | null {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
      dateStyle: "medium",
      timeStyle: "short",
    }).format(target);
  } catch {
    return null;
  }
}

/**
 * An inline trigger that displays a live relative timestamp ("3 minutes ago")
 * and, on hover, reveals a floating card with the full absolute time plus
 * optional per-timezone rows.
 *
 * The relative string auto-refreshes on a configurable interval (default every
 * 60 seconds) via an internal `setInterval` — no external timer management is
 * needed.
 *
 * @remarks
 * - The trigger is rendered as a `<span>` (not an `<a>`) so it can be embedded
 *   inline without introducing an unexpected anchor in the DOM.
 * - Supply `timezones` to add secondary time-zone rows to the card. Invalid
 *   IANA identifiers are silently skipped.
 * - Pass `children` to use custom text as the trigger label while keeping the
 *   card content intact (useful for semantic labels like "just now" or a user's
 *   local phrase).
 * - The component is pointer-driven (hover-card). Information shown exclusively
 *   inside the card is not keyboard-accessible; keep it supplemental.
 *
 * @example
 * ```tsx
 * // Basic — trigger shows live relative time
 * <RelativeTimeCard date={new Date("2024-06-01T12:00:00Z")} />
 *
 * // With timezones
 * <RelativeTimeCard
 *   date={new Date()}
 *   timezones={["America/New_York", "Europe/Berlin", "Asia/Tokyo"]}
 * />
 *
 * // Custom trigger label
 * <RelativeTimeCard date={event.createdAt}>
 *   Created recently
 * </RelativeTimeCard>
 * ```
 */
function RelativeTimeCard({
  date,
  timezones = [],
  updateInterval = 60_000,
  side = "bottom",
  align = "center",
  className,
  children,
}: RelativeTimeCardProps) {
  const target = new Date(date);

  // Tick state — incrementing it forces a re-render so the relative string
  // is recomputed even though date-fns itself is not reactive.
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, updateInterval);
    return () => {
      clearInterval(id);
    };
  }, [updateInterval]);

  // Recomputed on every render (including ticks).
  const relative = formatDistanceToNow(target, { addSuffix: true });

  // Full absolute local time, e.g. "Jun 1, 2024, 12:00:00 PM"
  const absolute = format(target, "PPpp");

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <span
            className={cn(
              "cursor-default underline decoration-dotted underline-offset-2",
              className
            )}
            data-slot="relative-time-card-trigger"
          />
        }
      >
        {children ?? relative}
      </HoverCardTrigger>

      <HoverCardContent
        align={align}
        data-slot="relative-time-card-content"
        side={side}
      >
        {/* Absolute local time heading */}
        <p className="font-medium text-foreground text-sm">{absolute}</p>

        {/* Per-timezone rows */}
        {timezones.length > 0 && (
          <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            {timezones.map((tz) => {
              const formatted = formatInTimezone(target, tz);
              if (formatted === null) {
                return null;
              }
              return (
                <React.Fragment key={tz}>
                  <span className="text-muted-foreground">{tz}</span>
                  <span className="text-foreground">{formatted}</span>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

export { RelativeTimeCard, type RelativeTimeCardProps };
