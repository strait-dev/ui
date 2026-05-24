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
  // Extended neutral / lifecycle states
  draft: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  archived: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  disabled: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  unknown: { variant: "secondary-light", dotClassName: "bg-muted-foreground" },
  // Live / in-flight
  running: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  executing: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  active: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  in_progress: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  processing: { variant: "info-light", dotClassName: "bg-info animate-pulse" },
  // Scheduled / queued-with-time
  scheduled: { variant: "info-light", dotClassName: "bg-info" },
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
  blocked: { variant: "destructive-light", dotClassName: "bg-destructive" },
  // Warning / waiting
  delayed: { variant: "warning-light", dotClassName: "bg-warning" },
  waiting: { variant: "warning-light", dotClassName: "bg-warning" },
  paused: { variant: "warning-light", dotClassName: "bg-warning" },
  degraded: { variant: "warning-light", dotClassName: "bg-warning" },
  retrying: {
    variant: "warning-light",
    dotClassName: "bg-warning animate-pulse",
  },
  partial: { variant: "warning-light", dotClassName: "bg-warning" },
  partial_success: { variant: "warning-light", dotClassName: "bg-warning" },
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
 * Maps a badge `size` value to a Tailwind dot size class.
 *
 * Nullable-key coalescing (`size ?? "default"`) is used at the index site to
 * satisfy TypeScript's strict index-access rules on `VariantProps` values.
 */
const DOT_SIZE_MAP: Record<NonNullable<BadgeProps["size"]>, string> = {
  xs: "size-1",
  sm: "size-1.5",
  default: "size-1.5",
  lg: "size-2",
  xl: "size-2.5",
};

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
  /**
   * When `true`, renders an `animate-ping` ring behind the dot to signal a
   * "live" or real-time state.
   *
   * @remarks
   * The ping is positioned absolutely behind the solid dot; both sit inside a
   * relative wrapper. The existing per-status `animate-pulse` on the dot is
   * preserved alongside this affordance.
   */
  pulse?: boolean;
  /**
   * When `true`, renders only the dot with no visible text label.
   *
   * An `aria-label` is automatically set to the humanised status string so
   * screen readers still announce the meaning.
   */
  dotOnly?: boolean;
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
 * - Use `pulse` for a `animate-ping` ring behind the dot — a "live" affordance.
 * - Use `dotOnly` for icon-only representations (e.g. dense table cells); an
 *   `aria-label` is automatically applied for accessibility.
 * - The dot size scales with the badge `size` prop automatically.
 *
 * @example
 * ```tsx
 * <StatusBadge status="running" />
 * <StatusBadge status="timed_out" />            // → "Timed out", red
 * <StatusBadge status="completed" showDot={false} label="Done" />
 * <StatusBadge status="running" pulse />        // animated ping ring
 * <StatusBadge status="failed" dotOnly />       // dot only, aria-label="Failed"
 * ```
 */
function StatusBadge({
  status,
  showDot = true,
  label,
  variant,
  className,
  size,
  pulse,
  dotOnly,
  "aria-label": ariaLabel,
  ...props
}: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const dotSizeClass = DOT_SIZE_MAP[size ?? "default"];
  const humanLabel = label ?? formatStatusLabel(status);

  const pulseDot = (
    <span className="relative inline-flex shrink-0 items-center justify-center">
      <span
        aria-hidden="true"
        className={cn(
          "absolute inline-flex rounded-full opacity-75",
          dotSizeClass,
          config.dotClassName.replace(/animate-pulse/g, ""),
          "animate-ping"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex shrink-0 rounded-full",
          dotSizeClass,
          config.dotClassName
        )}
        data-slot="status-badge-dot"
      />
    </span>
  );

  const plainDot = (
    <span
      aria-hidden="true"
      className={cn("shrink-0 rounded-full", dotSizeClass, config.dotClassName)}
      data-slot="status-badge-dot"
    />
  );

  let dotNode: React.ReactNode = null;
  if (showDot) {
    dotNode = pulse ? pulseDot : plainDot;
  }

  return (
    <Badge
      aria-label={
        dotOnly ? (ariaLabel ?? formatStatusLabel(status)) : ariaLabel
      }
      className={cn(className)}
      data-slot="status-badge"
      data-status={status.trim().toLowerCase()}
      size={size}
      variant={variant ?? config.variant}
      {...props}
    >
      {dotNode}
      {dotOnly ? null : humanLabel}
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
