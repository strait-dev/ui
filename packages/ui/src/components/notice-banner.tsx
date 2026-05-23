"use client";

import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  MultiplicationSignCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for {@link NoticeBanner}.
 *
 * Exposes one axis:
 * - `variant` — intent of the message. Each variant tints the border,
 *   background, and text using semantic design-system tokens.
 *
 * Exported so consumers can derive the same look on non-banner elements
 * without re-implementing the class list.
 */
const noticeBannerVariants = cva(
  "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm",
  {
    variants: {
      variant: {
        info: "border-info/30 bg-info/5 text-info-accent",
        success: "border-success/30 bg-success/5 text-success-accent",
        warning: "border-warning/30 bg-warning/5 text-warning-accent",
        destructive:
          "border-destructive/30 bg-destructive/5 text-destructive-accent",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

/** Default icon for each variant. */
function resolveDefaultIcon(
  variant: NonNullable<VariantProps<typeof noticeBannerVariants>["variant"]>
): React.ReactNode {
  if (variant === "success") {
    return (
      <HugeiconsIcon className="size-4 shrink-0" icon={CheckmarkCircle02Icon} />
    );
  }
  if (variant === "warning") {
    return <HugeiconsIcon className="size-4 shrink-0" icon={Alert02Icon} />;
  }
  if (variant === "destructive") {
    return (
      <HugeiconsIcon
        className="size-4 shrink-0"
        icon={MultiplicationSignCircleIcon}
      />
    );
  }
  return (
    <HugeiconsIcon className="size-4 shrink-0" icon={InformationCircleIcon} />
  );
}

/**
 * Thin wrapper for action controls placed inside a {@link NoticeBanner}.
 *
 * Renders as a flex row with a small gap; pass buttons, links, or any
 * interactive element as children. Tagged with `data-slot="notice-banner-action"`.
 */
function NoticeBannerAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-slot="notice-banner-action"
      {...props}
    />
  );
}

/**
 * Variant-driven, optionally dismissible inline banner for status messages
 * and call-to-action prompts.
 *
 * Consolidates billing-style notices and contextual feedback into a single
 * component. Use the {@link NoticeBannerAction} sub-part to render buttons or
 * links inside the right cluster.
 *
 * @remarks
 * - The banner renders `role="status"` so assistive technologies announce it
 *   without interrupting the user (for urgent messages prefer `role="alert"`).
 * - Each variant automatically selects a matching HugeIcons glyph; pass a
 *   custom node to `icon` to replace it, or `icon={false}` to hide it entirely.
 * - When `dismissible` is `true` a ghost icon button using `Cancel01Icon`
 *   appears on the far right; clicking it hides the banner and fires
 *   `onDismiss`.
 * - Dismiss state is managed internally — the banner returns `null` once
 *   dismissed. If you need external control use the `onDismiss` callback to
 *   update your own state and conditionally render the component.
 *
 * @example
 * ```tsx
 * <NoticeBanner variant="warning" title="Free plan limit reached" dismissible>
 *   You've used 90 % of your monthly quota.
 * </NoticeBanner>
 *
 * <NoticeBanner
 *   variant="info"
 *   title="New feature"
 *   action={
 *     <NoticeBannerAction>
 *       <Button size="sm">Learn more</Button>
 *     </NoticeBannerAction>
 *   }
 * >
 *   Try the redesigned dashboard.
 * </NoticeBanner>
 * ```
 */
function NoticeBanner({
  variant = "info",
  icon,
  title,
  dismissible = false,
  onDismiss,
  action,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof noticeBannerVariants> & {
    /** Override the leading icon. Pass `false` to hide it entirely. */
    icon?: React.ReactNode | false;
    /** Optional bold heading above the description. */
    title?: React.ReactNode;
    /** When `true`, renders a dismiss button that hides the banner on click. */
    dismissible?: boolean;
    /** Called when the user clicks the dismiss button. */
    onDismiss?: () => void;
    /** Optional action slot rendered before the dismiss button. */
    action?: React.ReactNode;
  }) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) {
    return null;
  }

  const resolvedVariant = variant ?? "info";

  let leadingIcon: React.ReactNode = null;
  if (icon !== false) {
    leadingIcon =
      icon === undefined ? resolveDefaultIcon(resolvedVariant) : icon;
  }

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div
      className={cn(noticeBannerVariants({ variant }), className)}
      data-slot="notice-banner"
      role="status"
      {...props}
    >
      {/* Left cluster: icon + text column */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {leadingIcon}
        <div className="flex min-w-0 flex-col">
          {title && <span className="font-semibold leading-snug">{title}</span>}
          {children && <span className="leading-snug">{children}</span>}
        </div>
      </div>

      {/* Right cluster: action slot + dismiss button */}
      {(action !== undefined || dismissible) && (
        <div className="flex shrink-0 items-center gap-2">
          {action}
          {dismissible && (
            <button
              aria-label="Dismiss"
              className="inline-flex size-5 items-center justify-center rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
              onClick={handleDismiss}
              type="button"
            >
              <HugeiconsIcon className="size-3.5" icon={Cancel01Icon} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export {
  NoticeBanner,
  NoticeBannerAction,
  type NoticeBannerVariants,
  noticeBannerVariants,
};

// Named type alias for external consumers
type NoticeBannerVariants = VariantProps<typeof noticeBannerVariants>;
