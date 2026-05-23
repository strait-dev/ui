import { LockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";

import { cn } from "../utils/index";
import type { BadgeProps } from "./badge";
import { Badge } from "./badge";

/* ------------------------------------------------------------------ */
/* FeatureBadge                                                        */
/* ------------------------------------------------------------------ */

/**
 * Props for {@link FeatureBadge}.
 *
 * Extends all {@link Badge} props so `size`, `className`, and any other badge
 * knobs can be forwarded. The required `plan` string is rendered as the badge
 * label alongside a leading lock icon.
 */
type FeatureBadgeProps = BadgeProps & {
  /** The plan name displayed inside the badge, e.g. `"Pro"` or `"Enterprise"`. */
  plan: string;
};

/**
 * Small pill badge that signals a feature is gated behind a paid plan.
 *
 * Wraps the design-system {@link Badge} with `variant="primary-light"` and
 * prepends a {@link LockIcon} so the upsell intent is immediately obvious.
 * Every other Badge prop (`size`, `className`, `render`, …) passes through
 * unchanged.
 *
 * @remarks
 * - Intended for use inside a {@link FeatureLock} overlay via the `planLabel`
 *   prop, but it is fully standalone and can appear in headers, empty states,
 *   or pricing tables.
 * - The badge renders as a `<span>` by default; swap the element via the
 *   inherited `render` prop when a link or button is needed.
 *
 * @example
 * ```tsx
 * <FeatureBadge plan="Pro" />
 * <FeatureBadge plan="Enterprise" size="lg" />
 * ```
 */
function FeatureBadge({ plan, className, ...props }: FeatureBadgeProps) {
  return (
    <Badge
      className={cn("gap-1", className)}
      data-slot="feature-badge"
      variant="primary-light"
      {...props}
    >
      <HugeiconsIcon icon={LockIcon} />
      {plan}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* FeatureLock                                                         */
/* ------------------------------------------------------------------ */

/**
 * Props for {@link FeatureLock}.
 */
type FeatureLockProps = {
  /**
   * When `true` the gating overlay is shown and children are visually
   * obscured. When `false` children are rendered unchanged with no wrapper.
   */
  locked: boolean;
  /** The content to gate — rendered normally when unlocked. */
  children: React.ReactNode;
  /**
   * Heading shown in the overlay, e.g. `"Upgrade to Pro"`.
   * Accepts any renderable content.
   */
  title?: React.ReactNode;
  /**
   * Supporting body copy shown below the title in the overlay.
   * Accepts any renderable content.
   */
  description?: React.ReactNode;
  /**
   * When provided, a {@link FeatureBadge} with this plan name is rendered
   * above the title in the overlay.
   */
  planLabel?: string;
  /**
   * CTA slot — typically an upgrade {@link Button}. Rendered below the
   * description inside the overlay.
   */
  action?: React.ReactNode;
  /**
   * When `true` (default) a `blur-sm` class is applied to the gated content
   * so it is obscured but still hinted at. Set to `false` to skip blurring
   * (e.g. when the content itself is already a placeholder).
   */
  blur?: boolean;
  /** Extra classes applied to the outermost wrapper `<div>`. */
  className?: string;
};

/**
 * Gating overlay that visually locks content behind an upsell prompt.
 *
 * When `locked={false}` the component is a transparent pass-through — it
 * renders `children` with no wrapper so the component is zero-cost in the
 * unlocked state. When `locked={true}` it wraps children in a `relative`
 * container, applies visual obscuration (blur + pointer-events-none), and
 * absolutely positions a centred overlay containing an optional
 * {@link FeatureBadge}, `title`, `description`, and `action` CTA.
 *
 * @remarks
 * - The gated children receive `aria-hidden="true"` so assistive technologies
 *   skip the obscured content and jump straight to the overlay.
 * - The overlay itself uses a semi-transparent `bg-background/60` scrim
 *   combined with a `backdrop-blur-[1px]` wash to lift it above the blurred
 *   content without completely hiding it.
 * - No `"use client"` directive is added — the component is pure render logic
 *   with no hooks and is compatible with React Server Components.
 * - The root element carries `data-slot="feature-lock"` and
 *   `data-locked={locked}` for CSS targeting and test assertions.
 *
 * @example
 * ```tsx
 * // Locked state with an upgrade CTA
 * <FeatureLock
 *   locked={isPro === false}
 *   title="Upgrade to Pro"
 *   description="Get access to advanced analytics and unlimited exports."
 *   planLabel="Pro"
 *   action={<Button variant="default">Upgrade now</Button>}
 * >
 *   <AnalyticsChart />
 * </FeatureLock>
 *
 * // Unlocked — children render unchanged
 * <FeatureLock locked={false}>
 *   <AnalyticsChart />
 * </FeatureLock>
 * ```
 */
function FeatureLock({
  locked,
  children,
  title,
  description,
  planLabel,
  action,
  blur = true,
  className,
}: FeatureLockProps) {
  if (!locked) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn("relative", className)}
      data-locked={locked}
      data-slot="feature-lock"
    >
      {/* Gated content — hidden from assistive tech and visually obscured */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none select-none", blur && "blur-sm")}
      >
        {children}
      </div>

      {/* Centred upsell overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/60 p-4 text-center backdrop-blur-[1px]">
        {planLabel ? <FeatureBadge plan={planLabel} /> : null}
        {title ? <p className="font-medium">{title}</p> : null}
        {description ? (
          <p className="max-w-xs text-muted-foreground text-sm">
            {description}
          </p>
        ) : null}
        {action ? <div>{action}</div> : null}
      </div>
    </div>
  );
}

export {
  FeatureBadge,
  type FeatureBadgeProps,
  FeatureLock,
  type FeatureLockProps,
};
