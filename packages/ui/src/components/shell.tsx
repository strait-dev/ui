import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for {@link Shell}.
 *
 * Exposes one axis:
 * - `variant` — page-level layout preset:
 *   - `"default"` — full-width, responsive horizontal padding.
 *   - `"centered"` — full-width with `items-center` to center child content.
 *   - `"fluid"` — identical to `"default"` but semantically signals an
 *     unrestricted-width layout.
 */
const shellVariants = cva("flex flex-col gap-4", {
  variants: {
    variant: {
      default: "w-full px-3 py-2 sm:px-4",
      centered: "w-full items-center px-3 py-2 sm:px-4",
      fluid: "w-full px-3 py-2 sm:px-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/** Props for {@link Shell}. */
type ShellProps = React.ComponentProps<"div"> &
  VariantProps<typeof shellVariants> & {
    /** Additional CSS classes merged onto the wrapper `<div>`. */
    className?: string;
    /**
     * Layout preset applied via {@link shellVariants}.
     * - `"default"` — full-width with responsive horizontal padding.
     * - `"centered"` — adds `items-center` to horizontally centre children.
     * - `"fluid"` — identical to `"default"` for unrestricted-width layouts.
     */
    variant?: "default" | "centered" | "fluid";
  };

/**
 * Top-level page layout wrapper that applies consistent padding, gap, and
 * flex-column structure to a page or route section.
 *
 * Styled via {@link shellVariants}; pass `variant` to select a layout mode.
 * All three variants share the same responsive horizontal padding
 * (`px-3 sm:px-4`) and vertical rhythm (`py-2 gap-4`).
 *
 * @remarks
 * - Renders a plain `<div>`; it carries no semantic role of its own.
 * - Intended as the outermost wrapper of a page body, not a section within
 *   a page (use a `<section>` or `<main>` outside it for that).
 *
 * @example
 * ```tsx
 * <Shell variant="centered">
 *   <Heading>Dashboard</Heading>
 *   <p>Welcome back.</p>
 * </Shell>
 * ```
 */
function Shell({ className, variant, ...props }: ShellProps) {
  return (
    <div
      className={cn(shellVariants({ variant }), className)}
      data-slot="shell"
      {...props}
    />
  );
}

export { Shell, type ShellProps };
