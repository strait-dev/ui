import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for {@link Kbd}.
 *
 * Exposes one axis:
 * - `size` — `"sm"` uses a slightly smaller text and tighter padding;
 *   `"default"` preserves the original `h-5`/`text-xs` look; `"lg"` bumps
 *   the cap height and uses `text-sm` for wider keys like function labels.
 */
const kbdVariants = cva(
  "pointer-events-none inline-flex w-fit select-none items-center justify-center gap-1 rounded-sm bg-muted in-data-[slot=tooltip-content]:bg-background/20 font-medium font-sans in-data-[slot=tooltip-content]:text-background text-muted-foreground dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      size: {
        /** Slightly smaller cap for dense UIs. */
        sm: "h-4 min-w-4 px-0.5 text-[10px]",
        /** Original look — unchanged default. */
        default: "h-5 min-w-5 px-1 text-xs",
        /** Taller cap with larger text for wider legend keys. */
        lg: "h-6 min-w-6 px-1.5 text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/**
 * Renders a single keyboard key badge using the semantic `<kbd>` element.
 *
 * Use {@link KbdGroup} to wrap multiple {@link Kbd} instances into a chord
 * (e.g. ⌘ + K). Automatically adapts its color palette when rendered inside
 * a tooltip (`data-slot="tooltip-content"`), switching to a lighter overlay
 * style for contrast against dark tooltip backgrounds.
 *
 * @remarks
 * - The `size` prop controls the key cap height, padding, and text size
 *   (`"sm"` | `"default"` | `"lg"`). `"default"` is unchanged from before.
 * - SVG icons inside `Kbd` are automatically constrained to `size-3`.
 *
 * @example
 * ```tsx
 * <KbdGroup>
 *   <Kbd>⌘</Kbd>
 *   <Kbd>K</Kbd>
 * </KbdGroup>
 *
 * // Larger keys for onboarding copy
 * <KbdGroup>
 *   <Kbd size="lg">Cmd</Kbd>
 *   <Kbd size="lg">Shift</Kbd>
 *   <Kbd size="lg">P</Kbd>
 * </KbdGroup>
 * ```
 */
function Kbd({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
  return (
    <kbd
      className={cn(kbdVariants({ size }), className)}
      data-slot="kbd"
      {...props}
    />
  );
}

/**
 * Inline wrapper that spaces multiple {@link Kbd} keys into a keyboard
 * shortcut chord (e.g. ⌘ + Shift + K). Rendered as a `<kbd>` element
 * for correct semantic nesting.
 */
function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      className={cn("inline-flex items-center gap-1", className)}
      data-slot="kbd-group"
      {...props}
    />
  );
}

export { Kbd, KbdGroup, kbdVariants };
