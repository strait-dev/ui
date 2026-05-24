"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/index";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

/** Pluralise `word` against `n` ("1 minute" / "2 minutes"). */
function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * Build a human relative-time string ("just now", "in 3 minutes",
 * "2 hours ago") from `date` relative to now.
 *
 * Falls back to a locale date string once the distance exceeds a week so the
 * label stays meaningful for old/far-future timestamps.
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const isInFuture = diff < 0;
  const absDiff = Math.abs(diff);

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 5) {
    return "just now";
  }

  if (isInFuture) {
    if (seconds < 60) {
      return `in ${pluralize(seconds, "second")}`;
    }
    if (minutes < 60) {
      return `in ${pluralize(minutes, "minute")}`;
    }
    if (hours < 24) {
      return `in ${pluralize(hours, "hour")}`;
    }
    if (days < 7) {
      return `in ${pluralize(days, "day")}`;
    }
    return date.toLocaleDateString();
  }

  if (seconds < 60) {
    return `${pluralize(seconds, "second")} ago`;
  }
  if (minutes < 60) {
    return `${pluralize(minutes, "minute")} ${pluralize(seconds % 60, "second")} ago`;
  }
  if (hours < 24) {
    return `${pluralize(hours, "hour")} ago`;
  }
  if (days < 7) {
    return `${pluralize(days, "day")} ago`;
  }
  return date.toLocaleDateString();
}

type TimezoneRowProps = React.ComponentProps<"li"> & {
  date: Date;
  /** IANA identifier. When omitted, the viewer's resolved timezone is used. */
  timezone?: string;
};

/**
 * A single timezone row inside the card: a name chip on the left and the
 * formatted date + time on the right. With no `timezone`, it resolves the
 * viewer's local short-offset name (e.g. "GMT-5").
 */
function TimezoneRow({
  date,
  timezone,
  className,
  ...props
}: TimezoneRowProps) {
  const locale = React.useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().locale,
    []
  );

  const timezoneName = React.useMemo(
    () =>
      timezone ??
      new Intl.DateTimeFormat(locale, { timeZoneName: "shortOffset" })
        .formatToParts(date)
        .find((part) => part.type === "timeZoneName")?.value,
    [date, timezone, locale]
  );

  const { formattedDate, formattedTime } = React.useMemo(
    () => ({
      formattedDate: new Intl.DateTimeFormat(locale, {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: timezone,
      }).format(date),
      formattedTime: new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: timezone,
      }).format(date),
    }),
    [date, timezone, locale]
  );

  return (
    <li
      aria-label={`Time in ${timezoneName}: ${formattedDate} ${formattedTime}`}
      {...props}
      className={cn(
        "flex items-center justify-between gap-2 text-muted-foreground text-sm",
        className
      )}
    >
      <span className="w-fit rounded bg-accent px-1 font-medium text-xs">
        {timezoneName}
      </span>
      <div className="flex items-center gap-2">
        <time dateTime={date.toISOString()}>{formattedDate}</time>
        <time className="tabular-nums" dateTime={date.toISOString()}>
          {formattedTime}
        </time>
      </div>
    </li>
  );
}

const triggerVariants = cva(
  "inline-flex w-fit cursor-default items-center justify-center text-foreground/70 text-sm transition-colors hover:text-foreground/90 focus-visible:rounded-sm focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default: "",
        muted: "text-foreground/50 hover:text-foreground/70",
        ghost: "hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/** Props for {@link RelativeTimeCard}. */
type RelativeTimeCardProps = Omit<React.ComponentProps<"button">, "children"> &
  VariantProps<typeof triggerVariants> &
  Pick<
    React.ComponentProps<typeof HoverCard>,
    "open" | "defaultOpen" | "onOpenChange"
  > &
  Pick<React.ComponentProps<typeof HoverCardTrigger>, "delay" | "closeDelay"> &
  Pick<
    React.ComponentProps<typeof HoverCardContent>,
    "side" | "align" | "sideOffset" | "alignOffset"
  > & {
    /**
     * The date to display. Accepts a `Date`, an ISO string, or a numeric epoch
     * timestamp — all are normalised via `new Date(date)`.
     */
    date: Date | string | number;
    /**
     * IANA time-zone identifiers shown as rows in the card. The viewer's local
     * timezone is always appended as a final row.
     *
     * @default ["UTC"]
     */
    timezones?: string[];
    /**
     * How often (ms) the relative-time string in the card refreshes.
     *
     * @default 1000
     */
    updateInterval?: number;
    /**
     * Custom trigger label. When omitted, the trigger shows the formatted
     * absolute timestamp (e.g. "Jun 1, 2024, 12:00 PM").
     */
    children?: React.ReactNode;
  };

/**
 * Shows a compact, formatted timestamp that — on hover — reveals a card with
 * the live relative time and the same instant rendered across one or more
 * timezones (plus the viewer's local zone).
 *
 * Built on {@link HoverCard}. The relative string in the card auto-refreshes on
 * a configurable interval via an internal `setInterval`.
 *
 * @remarks
 * - The trigger renders as a `<button>` so it is focusable; the hover card is
 *   still pointer-driven, so keep card-only information supplemental.
 * - `variant` styles the trigger: `default`, `muted` (dimmer), or `ghost`
 *   (underline on hover).
 * - `timezones` defaults to `["UTC"]`; the viewer's local timezone is always
 *   appended as the last row.
 * - Positioning (`side`, `align`, `sideOffset`, `alignOffset`) and open-state
 *   props (`open`, `defaultOpen`, `onOpenChange`, `delay`, `closeDelay`) are
 *   forwarded to the underlying {@link HoverCard}.
 *
 * @example
 * ```tsx
 * // Default — trigger shows the absolute time, card adds relative + zones
 * <RelativeTimeCard date={new Date("2024-06-01T12:00:00Z")} />
 *
 * // Multiple timezones + muted trigger
 * <RelativeTimeCard
 *   date={post.createdAt}
 *   timezones={["America/New_York", "Europe/Berlin", "Asia/Tokyo"]}
 *   variant="muted"
 * />
 *
 * // Custom trigger label
 * <RelativeTimeCard date={event.startsAt}>Starts soon</RelativeTimeCard>
 * ```
 */
function RelativeTimeCard({
  date: dateProp,
  variant,
  timezones = ["UTC"],
  updateInterval = 1000,
  open,
  defaultOpen,
  onOpenChange,
  delay = 500,
  closeDelay = 300,
  side,
  align,
  sideOffset,
  alignOffset,
  className,
  children,
  ...triggerProps
}: RelativeTimeCardProps) {
  const date = React.useMemo(
    () => (dateProp instanceof Date ? dateProp : new Date(dateProp)),
    [dateProp]
  );

  const locale = React.useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().locale,
    []
  );

  const [relativeTime, setRelativeTime] = React.useState<string>(() =>
    date.toLocaleDateString()
  );

  React.useEffect(() => {
    setRelativeTime(formatRelativeTime(date));
    const timer = setInterval(() => {
      setRelativeTime(formatRelativeTime(date));
    }, updateInterval);

    return () => clearInterval(timer);
  }, [date, updateInterval]);

  const absoluteLabel = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date),
    [date, locale]
  );

  return (
    <HoverCard
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      open={open}
    >
      <HoverCardTrigger
        closeDelay={closeDelay}
        delay={delay}
        render={
          <button
            className={cn(triggerVariants({ variant }), className)}
            data-slot="relative-time-card-trigger"
            type="button"
            {...triggerProps}
          />
        }
      >
        {children ?? (
          <time dateTime={date.toISOString()} suppressHydrationWarning>
            {absoluteLabel}
          </time>
        )}
      </HoverCardTrigger>

      <HoverCardContent
        align={align}
        alignOffset={alignOffset}
        className="flex w-auto max-w-[420px] flex-col gap-2 p-3"
        data-slot="relative-time-card-content"
        side={side}
        sideOffset={sideOffset}
      >
        <time
          className="text-muted-foreground text-sm"
          dateTime={date.toISOString()}
        >
          {relativeTime}
        </time>
        <ul className="flex list-none flex-col gap-1">
          {timezones.map((timezone) => (
            <TimezoneRow date={date} key={timezone} timezone={timezone} />
          ))}
          <TimezoneRow date={date} />
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}

export { RelativeTimeCard, type RelativeTimeCardProps };
