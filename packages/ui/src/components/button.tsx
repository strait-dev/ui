"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-clip-padding font-normal text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* ---- Neutral (legacy names) ---- */
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        secondary:
          "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground aria-expanded:bg-secondary aria-expanded:text-foreground",
        outline:
          "border-border bg-background text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        /* ---- Brand (orange) ---- */
        "brand-solid":
          "bg-brand text-brand-foreground hover:bg-brand/90 focus-visible:border-brand/40 focus-visible:ring-brand/30",
        brand:
          "bg-brand/10 text-brand hover:bg-brand/15 focus-visible:border-brand/40 focus-visible:ring-brand/20 dark:bg-brand/15 dark:hover:bg-brand/25",
        "brand-outline":
          "border-brand/30 text-brand hover:bg-brand/10 focus-visible:border-brand/40 focus-visible:ring-brand/20",

        /* ---- Destructive (red) ---- */
        "destructive-solid":
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/30",
        destructive:
          "bg-destructive/10 text-destructive-accent hover:bg-destructive/15 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/15 dark:hover:bg-destructive/25",
        "destructive-outline":
          "border-destructive/30 text-destructive-accent hover:bg-destructive/10 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",

        /* ---- Success (green) ---- */
        "success-solid":
          "bg-success text-success-foreground hover:bg-success/90 focus-visible:border-success/40 focus-visible:ring-success/30",
        success:
          "bg-success/10 text-success-accent hover:bg-success/15 focus-visible:border-success/40 focus-visible:ring-success/20 dark:bg-success/15 dark:hover:bg-success/25",
        "success-outline":
          "border-success/30 text-success-accent hover:bg-success/10 focus-visible:border-success/40 focus-visible:ring-success/20",

        /* ---- Warning (amber) ---- */
        "warning-solid":
          "bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:border-warning/50 focus-visible:ring-warning/40",
        warning:
          "bg-warning/15 text-warning-accent hover:bg-warning/25 focus-visible:border-warning/50 focus-visible:ring-warning/30 dark:bg-warning/15 dark:hover:bg-warning/25",
        "warning-outline":
          "border-warning/40 text-warning-accent hover:bg-warning/15 focus-visible:border-warning/50 focus-visible:ring-warning/30",

        /* ---- Info (blue) ---- */
        "info-solid":
          "bg-info text-info-foreground hover:bg-info/90 focus-visible:border-info/40 focus-visible:ring-info/30",
        info: "bg-info/10 text-info-accent hover:bg-info/15 focus-visible:border-info/40 focus-visible:ring-info/20 dark:bg-info/15 dark:hover:bg-info/25",
        "info-outline":
          "border-info/30 text-info-accent hover:bg-info/10 focus-visible:border-info/40 focus-visible:ring-info/20",

        /* ---- Low emphasis / special ---- */
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-full rounded-full px-2.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 in-data-[slot=button-group]:rounded-full rounded-full px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xl: "h-10 gap-2 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-8",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-full rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 in-data-[slot=button-group]:rounded-full rounded-full",
        "icon-lg": "size-9",
        "icon-xl": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  // When render overrides the element (e.g. <a>, <Link>), disable
  // nativeButton so Base UI doesn't warn about non-<button> semantics.
  const nativeButton = render == null;

  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      nativeButton={nativeButton}
      render={render}
      {...props}
    />
  );
}

export { Button, buttonVariants };
