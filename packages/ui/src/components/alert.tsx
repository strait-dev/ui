import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for the {@link Alert}.
 *
 * Exposes one axis:
 * - `variant` — intent of the message. `"default"` renders a neutral card
 *   surface; `"info"`, `"success"`, `"warning"`, and `"destructive"` tint the
 *   border, background, text, and icon with the matching semantic token so the
 *   whole alert reads as a single intent; `"invert"` flips to a high-contrast
 *   solid surface for maximum emphasis.
 *
 * Exported so consumers can derive the same look on non-alert elements
 * without re-implementing the class list.
 */
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 has-data-[slot=alert-action]:pr-18 *:[svg:not([class*='size-'])]:size-4 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        info: "border-info/30 bg-info/5 text-info-accent *:data-[slot=alert-description]:text-info-accent/90",
        success:
          "border-success/30 bg-success/5 text-success-accent *:data-[slot=alert-description]:text-success-accent/90",
        warning:
          "border-warning/30 bg-warning/5 text-warning-accent *:data-[slot=alert-description]:text-warning-accent/90",
        destructive:
          "border-destructive/30 bg-destructive/5 text-destructive-accent *:data-[slot=alert-description]:text-destructive-accent/90",
        invert:
          "border-invert bg-invert text-invert-foreground *:data-[slot=alert-description]:text-invert-foreground/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/** Props for {@link Alert}. */
export type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants>;

/**
 * Inline feedback banner for status messages, warnings, and errors.
 *
 * Compose it with {@link AlertTitle}, {@link AlertDescription}, and an
 * optional leading SVG icon (placed as a direct child before the title).
 * When an icon is present the component automatically switches to a
 * two-column grid so the icon spans both text rows. An optional
 * {@link AlertAction} floats absolutely in the top-right corner.
 *
 * @remarks
 * - The root renders with `role="alert"` so screen readers announce it
 *   immediately when it appears in the DOM.
 * - Pass `variant` to signal intent — `"info"`, `"success"`, `"warning"`,
 *   and `"destructive"` tint the border, background, text, and icon with
 *   the matching semantic token; `"default"` stays neutral; `"invert"`
 *   renders a high-contrast solid surface.
 * - Drop any 16 × 16 SVG icon as a direct child; {@link alertVariants}
 *   handles sizing and vertical alignment via CSS selectors.
 *
 * @example
 * ```tsx
 * <Alert variant="destructive">
 *   <TriangleAlertIcon />
 *   <AlertTitle>Payment failed</AlertTitle>
 *   <AlertDescription>
 *     Your card was declined. Please update your billing info.
 *   </AlertDescription>
 *   <AlertAction>
 *     <Button size="sm">Retry</Button>
 *   </AlertAction>
 * </Alert>
 * ```
 */
function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  );
}

/**
 * Bold heading line inside an {@link Alert}; shifts to the second grid
 * column when a leading icon is present.
 */
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      data-slot="alert-title"
      {...props}
    />
  );
}

/** Muted supporting copy beneath an {@link AlertTitle}. */
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-balance text-muted-foreground text-sm md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

/**
 * Absolutely-positioned slot for a dismiss button or other control in the
 * top-right corner of an {@link Alert}.
 */
function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("absolute top-2 right-2", className)}
      data-slot="alert-action"
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
