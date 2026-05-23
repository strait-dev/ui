import { cn } from "../utils/index";

/**
 * Renders a single keyboard key badge using the semantic `<kbd>` element.
 *
 * Use {@link KbdGroup} to wrap multiple {@link Kbd} instances into a chord
 * (e.g. ⌘ + K). Automatically adapts its color palette when rendered inside
 * a tooltip (`data-slot="tooltip-content"`), switching to a lighter overlay
 * style for contrast against dark tooltip backgrounds.
 *
 * @remarks
 * - Sized at `h-5` / `min-w-5` so it fits inline with text.
 * - SVG icons inside `Kbd` are automatically constrained to `size-3`.
 *
 * @example
 * ```tsx
 * <KbdGroup>
 *   <Kbd>⌘</Kbd>
 *   <Kbd>K</Kbd>
 * </KbdGroup>
 * ```
 */
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm bg-muted in-data-[slot=tooltip-content]:bg-background/20 px-1 font-medium font-sans in-data-[slot=tooltip-content]:text-background text-muted-foreground text-xs dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        className
      )}
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

export { Kbd, KbdGroup };
