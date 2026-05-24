"use client";

import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  MultiplicationSignCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils/index";

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

/**
 * Class-variance-authority recipe for {@link Banner}.
 *
 * Exposes three axes:
 * - `variant` — visual intent, tinting border, background, and text with
 *   semantic design-system tokens.
 * - `layout` — `"inline"` (default, rounded card) vs `"full-width"` (flush,
 *   edge-to-edge strip).
 * - `size` — vertical + horizontal padding scale.
 *
 * @remarks
 * Exported so consumers can derive the same look on non-banner elements
 * without re-implementing the class list. Also aliased as
 * {@link noticeBannerVariants} for backward compatibility.
 *
 * @example
 * ```tsx
 * <div className={bannerVariants({ variant: "success", layout: "full-width" })}>
 *   …
 * </div>
 * ```
 */
const bannerVariants = cva("flex items-center justify-between gap-3 text-sm", {
  variants: {
    variant: {
      info: "border-info/30 bg-info/5 text-info-accent",
      success: "border-success/30 bg-success/5 text-success-accent",
      warning: "border-warning/30 bg-warning/5 text-warning-accent",
      destructive:
        "border-destructive/30 bg-destructive/5 text-destructive-accent",
    },
    layout: {
      inline: "rounded-lg border",
      "full-width": "rounded-none border-x-0 border-y",
    },
    size: {
      sm: "px-2.5 py-1.5",
      default: "px-3 py-2",
    },
  },
  defaultVariants: {
    variant: "info",
    layout: "inline",
    size: "default",
  },
});

/** Convenience alias — {@link bannerVariants} */
const noticeBannerVariants = bannerVariants;

// ---------------------------------------------------------------------------
// Intent context
// ---------------------------------------------------------------------------

type BannerVariant = NonNullable<
  VariantProps<typeof bannerVariants>["variant"]
>;

interface BannerContextValue {
  variant: BannerVariant;
}

const BannerContext = React.createContext<BannerContextValue>({
  variant: "info",
});

/** Default HugeIcons glyph for each intent. */
const DEFAULT_ICONS: Record<BannerVariant, IconSvgElement> = {
  info: InformationCircleIcon,
  success: CheckmarkCircle02Icon,
  warning: Alert02Icon,
  destructive: MultiplicationSignCircleIcon,
};

// ---------------------------------------------------------------------------
// BannerProps
// ---------------------------------------------------------------------------

/**
 * Props accepted by the {@link Banner} root component.
 *
 * Extends the full `<div>` prop set with the three CVA variant axes.
 */
type BannerProps = React.ComponentProps<"div"> &
  VariantProps<typeof bannerVariants>;

// ---------------------------------------------------------------------------
// Sub-parts
// ---------------------------------------------------------------------------

/**
 * Root container for the composable Banner.
 *
 * Applies {@link bannerVariants} classes, renders `role="status"`, and
 * provides the intent context consumed by {@link BannerIcon}.
 *
 * @remarks
 * Tagged `data-slot="banner"`.
 *
 * @example
 * ```tsx
 * <Banner variant="warning">
 *   <BannerIcon />
 *   <BannerContent>
 *     <BannerTitle>Heads up</BannerTitle>
 *     <BannerDescription>Your quota is almost full.</BannerDescription>
 *   </BannerContent>
 *   <BannerActions>
 *     <Button size="sm">Upgrade</Button>
 *   </BannerActions>
 * </Banner>
 * ```
 *
 * {@link bannerVariants}
 */
function Banner({
  variant,
  layout,
  size,
  className,
  children,
  ...props
}: BannerProps) {
  const resolvedVariant: BannerVariant = variant ?? "info";

  return (
    <BannerContext.Provider value={{ variant: resolvedVariant }}>
      <div
        className={cn(bannerVariants({ variant, layout, size }), className)}
        data-slot="banner"
        role="status"
        {...props}
      >
        {children}
      </div>
    </BannerContext.Provider>
  );
}

// ---------------------------------------------------------------------------

/**
 * Leading icon slot for {@link Banner}.
 *
 * When no `icon` prop is supplied the component reads the intent from the
 * nearest {@link Banner} context and renders the matching default glyph.
 * Pass an explicit {@link IconSvgElement} to override, or omit children
 * entirely to let the default glyph show.
 *
 * @remarks
 * Tagged `data-slot="banner-icon"`. Renders `<HugeiconsIcon className="size-4 shrink-0" />`.
 *
 * @example
 * ```tsx
 * <BannerIcon />                        {/* default glyph from context *\/}
 * <BannerIcon icon={CheckmarkCircle02Icon} />  {/* explicit override *\/}
 * ```
 */
function BannerIcon({
  icon,
  className,
  ...props
}: React.ComponentProps<"span"> & { icon?: IconSvgElement }) {
  const { variant } = React.useContext(BannerContext);
  const resolvedIcon = icon ?? DEFAULT_ICONS[variant ?? "info"];

  return (
    <span
      className={cn("inline-flex shrink-0 items-center", className)}
      data-slot="banner-icon"
      {...props}
    >
      <HugeiconsIcon className="size-4 shrink-0" icon={resolvedIcon} />
    </span>
  );
}

// ---------------------------------------------------------------------------

/**
 * Text column inside {@link Banner}.
 *
 * Grows to fill available horizontal space and stacks {@link BannerTitle}
 * and {@link BannerDescription} vertically.
 *
 * @remarks
 * Tagged `data-slot="banner-content"`.
 */
function BannerContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      data-slot="banner-content"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------

/**
 * Bold heading line inside {@link BannerContent}.
 *
 * @remarks
 * Tagged `data-slot="banner-title"`.
 */
function BannerTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-semibold leading-snug", className)}
      data-slot="banner-title"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------

/**
 * Supporting description text inside {@link BannerContent}.
 *
 * @remarks
 * Tagged `data-slot="banner-description"`.
 */
function BannerDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("leading-snug", className)}
      data-slot="banner-description"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------

/**
 * Trailing cluster for action controls (buttons, links).
 *
 * Place {@link BannerClose} or any interactive element as children.
 *
 * @remarks
 * Tagged `data-slot="banner-actions"`. Also aliased as {@link NoticeBannerAction}.
 *
 * @example
 * ```tsx
 * <BannerActions>
 *   <Button size="sm" variant="outline">Upgrade</Button>
 *   <BannerClose onClick={handleClose} />
 * </BannerActions>
 * ```
 */
function BannerActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex shrink-0 items-center gap-2", className)}
      data-slot="banner-actions"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------

/**
 * Stateless dismiss button using {@link Cancel01Icon}.
 *
 * The caller is responsible for controlling visibility — clicking this button
 * fires `onClick` and does nothing else. For internal-state dismiss behaviour
 * use {@link NoticeBanner} with `dismissible`.
 *
 * @remarks
 * Tagged `data-slot="banner-close"`. Renders `<button type="button" aria-label="Dismiss">`.
 *
 * @example
 * ```tsx
 * const [visible, setVisible] = React.useState(true);
 * {visible && (
 *   <Banner variant="info">
 *     …
 *     <BannerActions>
 *       <BannerClose onClick={() => setVisible(false)} />
 *     </BannerActions>
 *   </Banner>
 * )}
 * ```
 */
function BannerClose({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      aria-label="Dismiss"
      className={cn(
        "inline-flex size-5 items-center justify-center rounded opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      data-slot="banner-close"
      type="button"
      {...props}
    >
      <HugeiconsIcon className="size-3.5" icon={Cancel01Icon} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Back-compat: NoticeBanner + NoticeBannerAction
// ---------------------------------------------------------------------------

/** Convenience alias — {@link BannerActions} */
const NoticeBannerAction = BannerActions;

/** Type alias for backward-compat consumers. */
type NoticeBannerVariants = VariantProps<typeof bannerVariants>;

/**
 * Monolithic, self-contained banner — preserves the original {@link NoticeBanner}
 * prop surface while being re-implemented on top of the new composable
 * sub-parts.
 *
 * @remarks
 * - Dismiss state is managed internally via `useState`; the component returns
 *   `null` once dismissed. For external control use {@link Banner} + {@link BannerClose}.
 * - Each variant auto-selects a default HugeIcons glyph; pass a custom node
 *   to `icon` to override it, or `icon={false}` to hide the icon entirely.
 * - Renders `role="status"` so assistive technologies announce the banner
 *   without interrupting the user.
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
 *
 * {@link Banner}
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
  VariantProps<typeof bannerVariants> & {
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

  const resolvedVariant: BannerVariant = variant ?? "info";

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  // Determine leading icon rendering
  const showIcon = icon !== false;
  const customIcon =
    icon !== undefined && icon !== false
      ? (icon as React.ReactNode)
      : undefined;

  return (
    <Banner
      className={className}
      data-slot="notice-banner"
      variant={resolvedVariant}
      {...props}
    >
      {/* Left cluster: icon + text column */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showIcon && (customIcon === undefined ? <BannerIcon /> : customIcon)}
        <BannerContent>
          {title && <BannerTitle>{title}</BannerTitle>}
          {children && <BannerDescription>{children}</BannerDescription>}
        </BannerContent>
      </div>

      {/* Right cluster: action slot + dismiss button */}
      {(action !== undefined || dismissible) && (
        <BannerActions>
          {action}
          {dismissible && <BannerClose onClick={handleDismiss} />}
        </BannerActions>
      )}
    </Banner>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Banner,
  BannerActions,
  BannerClose,
  BannerContent,
  BannerDescription,
  BannerIcon,
  type BannerProps,
  BannerTitle,
  bannerVariants,
  NoticeBanner,
  NoticeBannerAction,
  type NoticeBannerVariants,
  noticeBannerVariants,
};
