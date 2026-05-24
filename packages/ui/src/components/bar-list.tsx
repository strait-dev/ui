"use client";

import { useMemo } from "react";

import { cn } from "../utils/index";

/** A single row in a {@link BarList}. */
type BarListItem<T> = T & {
  /** Stable React key when `name` is not unique. */
  key?: string;
  /** Optional link; turns the row label into an anchor. */
  href?: string;
  /** Numeric value driving the bar width. */
  value: number;
  /** Display label. */
  name: string;
};

/** Props for {@link BarList}. */
interface BarListProps<T = unknown> extends React.ComponentProps<"div"> {
  /** Rows to render. */
  data: BarListItem<T>[];
  /** Makes rows interactive and fires with the clicked row. */
  onValueChange?: (payload: BarListItem<T>) => void;
  /** Sort direction by value. Defaults to `"descending"`. */
  sortOrder?: "ascending" | "descending" | "none";
  /** Formats the trailing value. */
  valueFormatter?: (value: number) => string;
}

const MIN_BAR_PERCENT = 2;

/**
 * A horizontal ranked bar list — labels overlaid on value-proportional bars,
 * with the formatted value in a trailing column.
 *
 * Great for "top referrers / pages / countries" style breakdowns. Pass
 * `onValueChange` to make each row a button, or `href` on a row to render its
 * label as a link.
 *
 * @remarks
 * - Bars are sized relative to the largest value; zero-value rows collapse,
 *   non-zero rows clamp to a small minimum width so they stay visible.
 * - For a tokenised, compound API with a header use {@link Leaderboard}.
 *
 * @example
 * ```tsx
 * <BarList
 *   data={[
 *     { name: "/home", value: 4200 },
 *     { name: "/pricing", value: 3100, href: "/pricing" },
 *   ]}
 *   valueFormatter={(v) => v.toLocaleString()}
 * />
 * ```
 */
function BarList<T>({
  data = [],
  valueFormatter = (value) => value.toString(),
  onValueChange,
  sortOrder = "descending",
  className,
  ref,
  ...props
}: BarListProps<T>) {
  const sortedData = useMemo(() => {
    if (sortOrder === "none") {
      return data;
    }
    return [...data].sort((a, b) =>
      sortOrder === "ascending" ? a.value - b.value : b.value - a.value
    );
  }, [data, sortOrder]);

  const maxValue = useMemo(
    () => Math.max(...sortedData.map((item) => item.value), 0),
    [sortedData]
  );

  const interactive = Boolean(onValueChange);
  const rowHeight = "h-8";

  return (
    <div
      className={cn("flex justify-between gap-x-6", className)}
      data-slot="bar-list"
      ref={ref}
      {...props}
    >
      <div className="relative w-full space-y-1.5">
        {sortedData.map((item) => {
          const width =
            item.value <= 0 || maxValue <= 0
              ? 0
              : Math.max((item.value / maxValue) * 100, MIN_BAR_PERCENT);
          const label = item.href ? (
            <a
              className={cn(
                "truncate whitespace-nowrap rounded-sm text-foreground text-sm/6",
                "hover:underline hover:underline-offset-2",
                "outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50"
              )}
              href={item.href}
              onClick={(event) => event.stopPropagation()}
              rel="noreferrer"
              target="_blank"
            >
              {item.name}
            </a>
          ) : (
            <p className="truncate whitespace-nowrap text-foreground text-sm/6">
              {item.name}
            </p>
          );

          const bar = (
            <div
              className={cn(
                "flex items-center rounded-sm bg-primary/25",
                rowHeight,
                interactive && "group-hover:bg-primary/35"
              )}
              style={{ width: `${width}%` }}
            >
              <div className="absolute start-2 flex max-w-full pe-3 sm:pe-2">
                {label}
              </div>
            </div>
          );

          if (interactive) {
            return (
              <button
                className={cn(
                  "group block w-full rounded-sm text-left",
                  "outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50"
                )}
                key={item.key ?? item.name}
                onClick={() => onValueChange?.(item)}
                type="button"
              >
                {bar}
              </button>
            );
          }

          return (
            <div className="w-full" key={item.key ?? item.name}>
              {bar}
            </div>
          );
        })}
      </div>
      <div>
        {sortedData.map((item) => (
          <div
            className={cn("mb-1.5 flex items-center justify-end", rowHeight)}
            key={item.key ?? item.name}
          >
            <p className="truncate whitespace-nowrap text-foreground text-sm leading-none">
              {valueFormatter(item.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export { BarList, type BarListItem, type BarListProps };
