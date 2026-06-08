"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/** Props for {@link Tabs}. */
export type TabsProps = TabsPrimitive.Root.Props;

/**
 * Layered content panel controlled by a row (or column) of tab buttons.
 *
 * Built on Base UI's `Tabs` primitive. Compose with {@link TabsList},
 * {@link TabsTrigger}, and {@link TabsContent}. Pass `orientation` to
 * switch between horizontal and vertical layouts; the flex direction
 * adapts automatically via a `data-horizontal` / `data-vertical`
 * attribute.
 *
 * @remarks
 * - `orientation` defaults to `"horizontal"`. Setting `"vertical"` rotates
 *   the list to a column and makes triggers full-width with left-aligned
 *   labels.
 * - The active-indicator underline/bar is driven purely by CSS (the
 *   `after:` pseudo-element on {@link TabsTrigger}) using the
 *   `data-[variant=line]` selector from {@link tabsListVariants}.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="account">
 *   <TabsList>
 *     <TabsTrigger value="account">Account</TabsTrigger>
 *     <TabsTrigger value="security">Security</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">Account settings…</TabsContent>
 *   <TabsContent value="security">Security settings…</TabsContent>
 * </Tabs>
 * ```
 */
function Tabs({ className, orientation = "horizontal", ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      data-orientation={orientation}
      data-slot="tabs"
      {...props}
    />
  );
}

/**
 * Class-variance-authority recipe for the {@link TabsList} container.
 *
 * Exposes two axes:
 * - `variant` — `"default"` renders a filled pill-style container;
 *   `"line"` strips the background and shows only an underline indicator
 *   on the active {@link TabsTrigger}; `"underline"` renders tabs as plain
 *   text with a bottom border on the list and an active underline indicator
 *   (no pill/background at all, border-bottom on the container).
 * - `size` — `"sm"` uses reduced height/padding/text; `"default"` is the
 *   standard; `"lg"` uses increased height/padding/text. The value is
 *   forwarded as `data-size` so {@link TabsTrigger} can read it via
 *   `group-data-[size=…]/tabs-list` selectors.
 *
 * The recipe is exported so consumers can apply the same visual treatment
 * to a custom trigger bar without re-implementing the class logic.
 */
const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground data-[variant=line]:rounded-none data-[variant=underline]:rounded-none group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
        underline:
          "gap-1 border-border border-b bg-transparent p-0 group-data-horizontal/tabs:h-auto",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Container that groups {@link TabsTrigger} buttons inside a {@link Tabs}.
 *
 * @remarks
 * - Pass `variant` to choose between the filled `"default"` pill bar, the
 *   borderless `"line"` style, or the `"underline"` style which renders tabs
 *   as plain text with a bottom active-line indicator and a full-width bottom
 *   border on the list container.
 * - Pass `size` (`"sm" | "default" | "lg"`) to cascade height/padding/text
 *   sizing to every {@link TabsTrigger} child via `data-size` + group selectors.
 *
 * See {@link tabsListVariants}.
 */
function TabsList({
  className,
  variant = "default",
  size = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      className={cn(tabsListVariants({ variant, size }), className)}
      data-size={size}
      data-slot="tabs-list"
      data-variant={variant}
      {...props}
    />
  );
}

/**
 * Individual tab button inside a {@link TabsList}; activates the matching
 * {@link TabsContent} when clicked.
 *
 * @remarks
 * The active underline indicator is rendered via a CSS `after:` pseudo-element
 * that becomes visible only in the `"line"` and `"underline"` variants.
 *
 * Size is cascaded from {@link TabsList} via `data-size` + group selectors:
 * - `"sm"` — reduced height, compact padding, `text-xs`.
 * - `"default"` — standard height, standard padding, `text-sm`.
 * - `"lg"` — increased height, generous padding, `text-base`.
 */
function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        // Base layout — size axis via group-data-[size=…]/tabs-list
        "relative inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        // ── size: sm ──
        "group-data-[size=sm]/tabs-list:h-[calc(100%-1px)] group-data-[size=sm]/tabs-list:px-1 group-data-[size=sm]/tabs-list:py-px group-data-[size=sm]/tabs-list:text-xs",
        // ── size: default ──
        "group-data-[size=default]/tabs-list:h-[calc(100%-1px)] group-data-[size=default]/tabs-list:px-1.5 group-data-[size=default]/tabs-list:py-0.5 group-data-[size=default]/tabs-list:text-sm",
        // ── size: lg ──
        "group-data-[size=lg]/tabs-list:h-[calc(100%-1px)] group-data-[size=lg]/tabs-list:px-3 group-data-[size=lg]/tabs-list:py-1.5 group-data-[size=lg]/tabs-list:text-base",
        // ── variant: default active state ──
        "group-data-[variant=default]/tabs-list:data-active:shadow-sm",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        // ── variant: line — clear background on active ──
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent group-data-[variant=line]/tabs-list:data-active:shadow-none dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        // ── variant: underline — no background, no pill ──
        "group-data-[variant=underline]/tabs-list:rounded-none group-data-[variant=underline]/tabs-list:border-transparent group-data-[variant=underline]/tabs-list:bg-transparent group-data-[variant=underline]/tabs-list:shadow-none group-data-[variant=underline]/tabs-list:data-active:bg-transparent group-data-[variant=underline]/tabs-list:data-active:text-foreground group-data-[variant=underline]/tabs-list:data-active:shadow-none dark:group-data-[variant=underline]/tabs-list:data-active:border-transparent dark:group-data-[variant=underline]/tabs-list:data-active:bg-transparent",
        // ── underline indicator (after pseudo-element) ──
        // Shown in `line` and `underline` variants when active.
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:w-0.5",
        "group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        "group-data-[variant=underline]/tabs-list:data-active:after:opacity-100",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

/**
 * Panel that displays when its corresponding {@link TabsTrigger} is active.
 * The `value` prop must match the trigger's `value`.
 */
function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={cn("flex-1 text-sm outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
