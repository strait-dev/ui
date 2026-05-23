import type * as React from "react";

import { cn } from "../utils/index";
import { Badge, type BadgeProps } from "./badge";

/**
 * Visual treatment for a single status: the {@link Badge} `variant` plus the
 * Tailwind classes for the leading dot.
 */
type StatusConfig = {
  /** {@link Badge} variant applied to the status pill. */
  variant: NonNullable<BadgeProps["variant"]>;
  /** Classes for the leading dot (colour, and animation for live states). */
  dotClassName: string;
};

/** Fallback used when a status is not present in {@link STATUS_CONFIG}. */
const DEFAULT_STATUS_CONFIG: StatusConfig = {
  variant: "secondary-light",
  dotClassName: "bg-muted-foreground",
};

/**
 * Maps a lowercase status keyword to its {@link Badge} variant and dot style.
 *
 * Covers the orchestration vocabulary used across Strait (runs, jobs,
 * schedules, DLQ, webhooks) plus common synonyms. Exported so consumers can
 * spread it into their own map to add product-specific statuses without
 * forking the component:
 *
 * ```ts
 * const MY_STATUSES = { ...STATUS_CONFIG, throttled: STATUS_CONFIG.delayed };
 * ```
 */
const STATUS_CONFIG: Record<string, StatusConfig> = {
  // Neutral / inactive
  queued: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  dequeued: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  pending: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  skipped: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  expired: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  canceled: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  cancelled: {
    variant: "secondary-light",
    dotClassName: "bg-muted-foreground",
  },
  idle: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  // Live / in-flight
  running: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  executing: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  active: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  in_progress: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  processing: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  // Success
  completed: { variant: "success-light", dotClassName: "bg-success" },
  succeeded: { variant: "success-light", dotClassName: "bg-success" },
  success: { variant: "success-light", dotClassName: "bg-success" },
  healthy: { variant: "success-light", dotClassName: "bg-success" },
  enabled: { variant: "success-light", dotClassName: "bg-success" },
  // Failure
  failed: { variant: "destructive-light", dotClassName: "bg-destructive" },
  timed_out: { variant: "destructive-light", dotClassName: "bg-destructive" },
  crashed: { variant: "destructive-light", dotClassName: "bg-destructive" },
  system_failed: {
    variant: "destructive-light",
    dotClassName: "bg-destructive",
  },
  dead_letter: {
    variant: "destructive-light",
    dotClassName: "bg-destructive",
  },
  error: { variant: "destructive-light", dotClassName: "bg-destructive" },
  // Warning / waiting
  delayed: { variant: "warning-light", dotClassName: "bg-warning" },
  waiting: { variant: "warning-light", dotClassName: "bg-warning" },
  paused: { variant: "warning-light", dotClassName: "bg-warning" },
  degraded: { variant: "warning-light", dotClassName: "bg-warning" },
};

/**
 * Resolves the {@link StatusConfig} for a status string.
 *
 * Lookup is case-insensitive and trims surrounding whitespace; unknown
 * statuses fall back to {@link DEFAULT_STATUS_CONFIG}.
 */
function getStatusConfig(status: string): StatusConfig {
  return STATUS_CONFIG[status.trim().toLowerCase()] ?? DEFAULT_STATUS_CONFIG;
}

/** Title-cases a raw status keyword, e.g. `"timed_out"` → `"Timed out"`. */
function formatStatusLabel(status: string): string {
  const spaced = status.trim().replace(/[_-]+/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Props for {@link StatusBadge}.
 *
 * Extends {@link Badge} (so `size`, `render`, etc. pass through) but derives
 * `variant` from `status` unless explicitly overridden.
 */
type StatusBadgeProps = Omit<BadgeProps, "children"> & {
  /** The status keyword, e.g. `"running"`, `"failed"`, `"timed_out"`. */
  status: string;
  /** Show the leading coloured dot. Defaults to `true`. */
  showDot?: boolean;
  /** Override the rendered text; defaults to a humanised `status`. */
  label?: React.ReactNode;
};

/**
 * A {@link Badge} that maps an orchestration status keyword to a consistent
 * colour, a leading status dot, and a humanised label.
 *
 * Built directly on {@link Badge}, so it inherits the same sizes and focus
 * styles. The status → colour mapping lives in the exported
 * {@link STATUS_CONFIG}; pass `variant` to override the derived colour for a
 * one-off, or spread `STATUS_CONFIG` into your own map for new statuses.
 *
 * @remarks
 * - The dot is decorative (`aria-hidden`) — meaning is carried by the text.
 * - Live states (`running`, `executing`, …) animate the dot with a subtle
 *   pulse so in-flight work reads as "active" at a glance.
 * - Unknown statuses degrade to a neutral grey pill rather than throwing.
 *
 * @example
 * ```tsx
 * <StatusBadge status="running" />
 * <StatusBadge status="timed_out" />            // → "Timed out", red
 * <StatusBadge status="completed" showDot={false} label="Done" />
 * ```
 */
function StatusBadge({
  status,
  showDot = true,
  label,
  variant,
  className,
  ...props
}: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <Badge
      className={cn(className)}
      data-slot="status-badge"
      data-status={status.trim().toLowerCase()}
      variant={variant ?? config.variant}
      {...props}
    >
      {showDot ? (
        <span
          aria-hidden="true"
          className={cn("size-1.5 shrink-0 rounded-full", config.dotClassName)}
          data-slot="status-badge-dot"
        />
      ) : null}
      {label ?? formatStatusLabel(status)}
    </Badge>
  );
}

export {
  DEFAULT_STATUS_CONFIG,
  formatStatusLabel,
  getStatusConfig,
  STATUS_CONFIG,
  StatusBadge,
  type StatusBadgeProps,
  type StatusConfig,
};
