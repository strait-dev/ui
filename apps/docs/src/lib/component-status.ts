import type { Badge } from "@strait/ui/components/badge";
import type { ComponentProps } from "react";

/** Lifecycle status for the few components that aren't plain "stable". */
export type ComponentStatus = "beta" | "new" | "deprecated";

/**
 * Status overrides keyed by component slug. Absence means **stable** and shows
 * no badge — keep this list short and only call out genuine exceptions.
 *
 * Seeded with the two largest, most-likely-to-evolve data components; adjust as
 * the API stabilises toward 1.0.
 */
export const componentStatus: Record<string, ComponentStatus> = {
  "data-grid": "beta",
  filters: "beta",
};

/** Human label + Badge variant for each status. Stable returns undefined. */
const STATUS_META: Record<
  ComponentStatus,
  { label: string; variant: ComponentProps<typeof Badge>["variant"] }
> = {
  beta: { label: "Beta", variant: "info-light" },
  new: { label: "New", variant: "success-light" },
  deprecated: { label: "Deprecated", variant: "warning-light" },
};

/** Returns the badge label + variant for a component slug, or null if stable. */
export function getStatusBadge(slug: string) {
  const status = componentStatus[slug];
  return status ? STATUS_META[status] : null;
}
