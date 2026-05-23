import { formatDistanceToNow } from "date-fns";
import type * as React from "react";

import { cn } from "../utils/index";
import { ScrollArea } from "./scroll-area";
import { getStatusConfig } from "./status-badge";

/**
 * A single entry in an {@link ActivityFeed}.
 *
 * All fields except `id` are optional so callers can supply a minimal item
 * (e.g. title-only) and progressively add richer data.
 */
type ActivityItem = {
  /** Stable identity used as the React `key` for each row. */
  id: string;
  /**
   * Status keyword resolved via {@link getStatusConfig} to derive the dot
   * colour — the same vocabulary used by `StatusBadge` (`"running"`,
   * `"completed"`, `"failed"`, …).
   */
  status?: string;
  /** Primary label rendered in `text-sm`. Accepts any React node. */
  title: React.ReactNode;
  /**
   * When the event occurred. A `Date` object or an ISO / epoch string — both
   * are accepted. Rendered as a relative phrase via `date-fns`
   * `formatDistanceToNow`.
   */
  timestamp?: Date | string;
  /** Optional supporting copy below the title, in `text-xs text-muted-foreground`. */
  description?: React.ReactNode;
};

/**
 * Props for {@link ActivityFeed}.
 *
 * @see {@link ActivityItem}
 */
type ActivityFeedProps = {
  /** Ordered list of activity entries to display. */
  items: ActivityItem[];
  /**
   * Height of the scrollable viewport. Accepts any CSS value (`"320px"`,
   * `"100%"`, …) or a bare number treated as pixels. Defaults to `320`.
   */
  height?: number | string;
  /**
   * Node rendered when `items` is empty. Defaults to a centred muted
   * "No activity yet" message.
   */
  emptyState?: React.ReactNode;
  /**
   * Escape hatch for full row customisation. When provided, it replaces the
   * default row renderer entirely; `data-slot="activity-feed-item"` is still
   * your responsibility inside the returned node.
   */
  renderItem?: (item: ActivityItem) => React.ReactNode;
  /** Extra classes merged onto the root `ScrollArea`. */
  className?: string;
};

/**
 * Coerces a `Date | string` timestamp to a relative phrase.
 *
 * Returns `null` when `ts` is `undefined` so callers can conditionally render.
 */
function formatTimestamp(ts: Date | string | undefined): string | null {
  if (ts === undefined) {
    return null;
  }
  const date = ts instanceof Date ? ts : new Date(ts);
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * The default empty-state slot shown when `items` is an empty array and no
 * custom `emptyState` has been supplied.
 */
function DefaultEmptyState() {
  return (
    <p className="py-6 text-center text-muted-foreground text-sm">
      No activity yet
    </p>
  );
}

/**
 * Default single-row renderer for an {@link ActivityItem}.
 */
function DefaultActivityRow({ item }: { item: ActivityItem }) {
  const { dotClassName } = getStatusConfig(item.status ?? "");
  const relativeTime = formatTimestamp(item.timestamp);

  return (
    <div
      className="flex items-start gap-2.5"
      data-slot="activity-feed-item"
      key={item.id}
    >
      <span
        aria-hidden="true"
        className={cn("mt-1.5 size-2 shrink-0 rounded-full", dotClassName)}
      />
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm">{item.title}</span>
          {relativeTime === null ? null : (
            <span className="shrink-0 text-muted-foreground text-xs">
              {relativeTime}
            </span>
          )}
        </div>
        {item.description === undefined ? null : (
          <p className="text-muted-foreground text-xs">{item.description}</p>
        )}
      </div>
    </div>
  );
}

/**
 * A presentational, scrollable list of timestamped activity entries with
 * status dots and relative times.
 *
 * The component is intentionally **data-free** — all entries arrive via
 * `items`; there is no internal polling or fetching.
 *
 * @remarks
 * - Status dot colours reuse {@link getStatusConfig} from `StatusBadge`, so
 *   the same vocabulary (`"running"`, `"completed"`, `"failed"`, …) drives
 *   both components.
 * - Timestamps accept `Date` objects **or** ISO / epoch strings; both are
 *   coerced to a relative phrase via `date-fns` `formatDistanceToNow`.
 * - Pass `renderItem` for full row customisation while keeping the
 *   `ScrollArea` viewport and empty-state behaviour.
 *
 * @example
 * ```tsx
 * const items: ActivityItem[] = [
 *   {
 *     id: "1",
 *     status: "completed",
 *     title: "Deployment succeeded",
 *     timestamp: new Date(Date.now() - 3 * 60_000),
 *     description: "prod-us-east-1",
 *   },
 * ];
 *
 * <ActivityFeed items={items} height={320} />
 * ```
 */
function ActivityFeed({
  items,
  height = 320,
  emptyState,
  renderItem,
  className,
}: ActivityFeedProps) {
  const viewportHeight = typeof height === "number" ? `${height}px` : height;

  const isEmpty = items.length === 0;

  const resolvedEmptyState =
    emptyState === undefined ? <DefaultEmptyState /> : emptyState;

  return (
    <ScrollArea
      className={cn("w-full", className)}
      data-slot="activity-feed"
      style={{ height: viewportHeight }}
    >
      {isEmpty ? (
        resolvedEmptyState
      ) : (
        <div className="flex flex-col gap-3 p-1">
          {items.map((item) => {
            if (renderItem !== undefined) {
              return renderItem(item);
            }
            return <DefaultActivityRow item={item} key={item.id} />;
          })}
        </div>
      )}
    </ScrollArea>
  );
}

export { ActivityFeed, type ActivityFeedProps, type ActivityItem };
