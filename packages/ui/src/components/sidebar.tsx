"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { mergeProps } from "@base-ui/react/merge-props";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { useRender } from "@base-ui/react/use-render";
import {
  ArrowDown01Icon,
  DragDropHorizontalIcon,
  Search01Icon,
  SidebarLeftIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { cn } from "../utils/index";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import { Sortable, SortableItem, SortableItemHandle } from "./sortable";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

/**
 * Tracks whether an element's text content is being cut off by its container.
 *
 * Returns a ref to attach to the measured element and a boolean that flips to
 * `true` whenever `scrollWidth` exceeds `clientWidth`. Re-measures on resize
 * via `ResizeObserver`. Used by {@link SidebarMenuButton} to show its tooltip
 * the moment a long label gets ellipsised, in addition to icon-collapse mode.
 */
function useTruncated<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  boolean,
] {
  const ref = React.useRef<T>(null);
  const [truncated, setTruncated] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const measure = () => {
      setTruncated(el.scrollWidth > el.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, truncated];
}

// Cookie name used to persist the open/collapsed state across page loads.
const SIDEBAR_COOKIE_NAME = "sidebar_state";
// One week TTL for the persistence cookie.
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
// Keyboard shortcut key (combined with Cmd/Ctrl) that toggles the sidebar.
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;

  // Open state for collapsible groups and item-level sub-menus.
  // Each consumer keys itself by a stable `value` string so the
  // provider can hold the entire app shell's disclosure state.
  openSubmenus: ReadonlySet<string>;
  toggleSubmenu: (id: string) => void;
  setSubmenuOpen: (id: string, open: boolean) => void;
  isSubmenuOpen: (id: string) => boolean;

  // Active panel id for `collapsible="rail"` dual-panel mode.
  // `null` collapses the secondary panel to zero width.
  activeRailItem: string | null;
  setActiveRailItem: (id: string | null) => void;
};

// Internal context — consumed by every sidebar sub-component.
const SidebarContext = React.createContext<SidebarContextProps | null>(null);

/**
 * Returns the nearest {@link SidebarProvider} context.
 *
 * Throws if called outside of a {@link SidebarProvider} tree.
 */
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

/** Props for {@link SidebarProvider}. */
export type SidebarProviderProps = React.ComponentProps<"div"> & {
  /** Initial open state when uncontrolled; defaults to `true`. */
  defaultOpen?: boolean;
  /** Controlled open state; pair with {@link SidebarProviderProps.onOpenChange}. */
  open?: boolean;
  /** Called when the sidebar's open state changes in controlled mode. */
  onOpenChange?: (open: boolean) => void;
};

/**
 * Root provider that manages sidebar open/collapsed state and keyboard
 * shortcut registration for an entire sidebar layout.
 *
 * Wrap your full page layout (sidebar + main content) in this component.
 * It exposes `--sidebar-width` and `--sidebar-width-icon` CSS custom
 * properties to its subtree so child elements can size themselves
 * without knowing the exact pixel values.
 *
 * @remarks
 * - Supports controlled (`open` + `onOpenChange`) and uncontrolled
 *   (`defaultOpen`) modes; the active open value is stored in a first-party
 *   cookie (`sidebar_state`) so it survives page reloads.
 * - Registers a `keydown` listener for `Cmd+B` / `Ctrl+B` that calls
 *   {@link toggleSidebar}; the listener is cleaned up on unmount.
 * - On mobile (detected via `useIsMobile`) the sidebar is controlled by a
 *   separate `openMobile` boolean that drives a {@link Sheet} overlay instead
 *   of an inline collapse animation.
 *
 * @example
 * ```tsx
 * <SidebarProvider>
 *   <Sidebar>…</Sidebar>
 *   <SidebarInset>
 *     <SidebarTrigger />
 *     <main>…</main>
 *   </SidebarInset>
 * </SidebarProvider>
 * ```
 */

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      // biome-ignore lint/suspicious/noDocumentCookie: setting a first-party persistence cookie; no sensitive data, no external input
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(
    () =>
      isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open),
    [isMobile, setOpen]
  );

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  // Disclosure state for collapsible groups and item-level sub-menus.
  // A single Set keyed by the consumer's `value` keeps every disclosure
  // group, item, etc. addressable from anywhere in the tree.
  const [openSubmenus, setOpenSubmenus] = React.useState<ReadonlySet<string>>(
    () => new Set()
  );
  const toggleSubmenu = React.useCallback((id: string) => {
    setOpenSubmenus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  const setSubmenuOpen = React.useCallback((id: string, nextOpen: boolean) => {
    setOpenSubmenus((prev) => {
      if (prev.has(id) === nextOpen) {
        return prev;
      }
      const next = new Set(prev);
      if (nextOpen) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);
  const isSubmenuOpen = React.useCallback(
    (id: string) => openSubmenus.has(id),
    [openSubmenus]
  );

  // Active panel for `collapsible="rail"` mode. Null means the
  // secondary panel is collapsed.
  const [activeRailItem, setActiveRailItem] = React.useState<string | null>(
    null
  );

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      openSubmenus,
      toggleSubmenu,
      setSubmenuOpen,
      isSubmenuOpen,
      activeRailItem,
      setActiveRailItem,
    }),
    [
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      toggleSidebar,
      openSubmenus,
      toggleSubmenu,
      setSubmenuOpen,
      isSubmenuOpen,
      activeRailItem,
    ]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
          className
        )}
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            "--sidebar-rail-width": "3rem",
            "--sidebar-panel-width": "14rem",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

/** Props for {@link Sidebar}. */
export type SidebarProps = React.ComponentProps<"div"> & {
  /** Viewport edge the panel anchors to; `"left"` (default) or `"right"`. */
  side?: "left" | "right";
  /**
   * Visual treatment of the sidebar surface.
   * - `"sidebar"` — flat panel flush with the viewport edge (default).
   * - `"floating"` — rounded corners and a shadow ring.
   * - `"inset"` — makes the content area ({@link SidebarInset}) appear
   *   nested inside the sidebar colour.
   */
  variant?: "sidebar" | "floating" | "inset";
  /**
   * Collapse mode when the sidebar is toggled closed.
   * - `"offcanvas"` — slides the panel fully off-screen (default).
   * - `"icon"` — shrinks to icon width, hiding labels.
   * - `"rail"` — dual-panel mode: a narrow icon column ({@link SidebarRail})
   *   stays fixed while a wider secondary panel ({@link SidebarPanel})
   *   slides in / out based on which {@link SidebarRailButton} is active.
   * - `"none"` — disables collapsing; the panel is always visible.
   */
  collapsible?: "offcanvas" | "icon" | "rail" | "none";
};

/**
 * The sidebar panel itself — a collapsible column rendered inside a
 * {@link SidebarProvider}.
 *
 * Adapts its rendering strategy based on context:
 * - **Mobile** — renders a full-screen {@link Sheet} overlay driven by
 *   `openMobile` from {@link useSidebar}.
 * - **`collapsible="none"`** — renders a plain `<div>` with no collapse
 *   behaviour; useful for always-visible sidebars.
 * - **Desktop (default)** — renders two divs: a gap placeholder that
 *   animates its width, and a `fixed` container that slides in/out.
 *
 * @remarks
 * - `side` (`"left"` | `"right"`) controls which viewport edge the panel
 *   anchors to.
 * - `variant` (`"sidebar"` | `"floating"` | `"inset"`) changes the visual
 *   treatment. `"floating"` adds rounded corners and a shadow ring;
 *   `"inset"` makes the content area (via {@link SidebarInset}) visually
 *   nested inside the sidebar colour.
 * - `collapsible` (`"offcanvas"` | `"icon"` | `"none"`) determines the
 *   collapse mode: `"offcanvas"` slides the panel fully off-screen;
 *   `"icon"` shrinks it to icon width.
 */

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile, activeRailItem } =
    useSidebar();

  if (collapsible === "rail") {
    const childrenArr = React.Children.toArray(children);
    const railChild = childrenArr.find(
      (c) => React.isValidElement(c) && c.type === SidebarRail
    );
    const panels = childrenArr.filter(
      (c) => React.isValidElement(c) && c.type === SidebarPanel
    );
    const rest = childrenArr.filter(
      (c) =>
        !(
          React.isValidElement(c) &&
          (c.type === SidebarRail || c.type === SidebarPanel)
        )
    );

    const railColumn = (
      <div
        className="flex h-svh w-(--sidebar-rail-width) shrink-0 flex-col items-center gap-1 border-sidebar-border border-r bg-sidebar py-2"
        data-slot="sidebar-rail-column"
      >
        {railChild}
        {rest}
      </div>
    );
    const panelWrap = (
      <div
        className="h-svh w-(--sidebar-panel-width) overflow-hidden border-sidebar-border border-r bg-sidebar transition-[width] duration-(--duration-base) ease-out data-[active=none]:w-0 motion-reduce:transition-none"
        data-active={activeRailItem ?? "none"}
        data-slot="sidebar-rail-panel-wrap"
      >
        {panels}
      </div>
    );

    if (isMobile) {
      return (
        <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
          <SheetContent
            className="bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            data-mobile="true"
            data-sidebar="sidebar"
            data-slot="sidebar"
            dir={dir}
            side={side}
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Sidebar</SheetTitle>
              <SheetDescription>Displays the mobile sidebar.</SheetDescription>
            </SheetHeader>
            <div className="flex h-full w-full">
              {railColumn}
              {panelWrap}
            </div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        className={cn(
          "group peer hidden text-sidebar-foreground md:flex",
          className
        )}
        data-collapsible="rail"
        data-side={side}
        data-slot="sidebar"
        data-state={state}
        data-variant={variant}
        {...props}
      >
        {railColumn}
        {panelWrap}
      </div>
    );
  }

  if (collapsible === "none") {
    return (
      <div
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className
        )}
        data-slot="sidebar"
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
        <SheetContent
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          data-mobile="true"
          data-sidebar="sidebar"
          data-slot="sidebar"
          dir={dir}
          side={side}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
      data-variant={variant}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-(--duration-base) ease-out motion-reduce:transition-none",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
        data-slot="sidebar-gap"
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-(--duration-base) ease-out data-[side=right]:right-0 data-[side=left]:left-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] motion-reduce:transition-none md:flex",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        data-side={side}
        data-slot="sidebar-container"
        {...props}
      >
        <div
          className="flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border"
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Marker / container for the narrow icon column rendered in
 * `collapsible="rail"` mode.
 *
 * Used as a structural marker so the {@link Sidebar} root can find and
 * place the rail children inside its own column container. Children are
 * typically {@link SidebarRailButton}s.
 */
function SidebarRail({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("contents", className)}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      {...props}
    >
      {children}
    </div>
  );
}

/** Props for {@link SidebarRailButton}. */
export interface SidebarRailButtonProps
  extends Omit<React.ComponentProps<"button">, "title" | "value"> {
  /** Icon node rendered as the button's content. */
  icon: React.ReactNode;
  /** Optional accessible name / hover tooltip. */
  tooltip?: string;
  /** Stable id selecting which {@link SidebarPanel} this button opens. */
  value: string;
}

/**
 * One icon button in the rail column. Clicking sets / clears
 * `activeRailItem` so the matching {@link SidebarPanel} renders.
 *
 * @remarks
 * - When `tooltip` is provided the button is wrapped with `Tooltip` so the
 *   label appears on hover (positioned to the right of the rail).
 * - Active state uses the under-icon dot variant of the standard active
 *   visual recipe.
 */
function SidebarRailButton({
  className,
  value,
  icon,
  tooltip,
  onClick,
  ...props
}: SidebarRailButtonProps) {
  const { activeRailItem, setActiveRailItem } = useSidebar();
  const isActive = activeRailItem === value;
  const button = (
    <button
      aria-label={tooltip}
      aria-pressed={isActive}
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3",
        "data-active:bg-sidebar-active data-active:text-sidebar-active-foreground data-active:before:absolute data-active:before:inset-x-1 data-active:before:bottom-1 data-active:before:h-0.5 data-active:before:rounded-full data-active:before:bg-sidebar-active-rail",
        className
      )}
      data-active={isActive ? "true" : undefined}
      data-sidebar="rail-button"
      data-slot="sidebar-rail-button"
      data-value={value}
      onClick={(e) => {
        onClick?.(e);
        setActiveRailItem(isActive ? null : value);
      }}
      type="button"
      {...props}
    >
      {icon}
    </button>
  );

  if (!tooltip) {
    return button;
  }
  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

/** Props for {@link SidebarPanel}. */
export interface SidebarPanelProps extends React.ComponentProps<"div"> {
  /** Stable id matched against `activeRailItem` to decide visibility. */
  value: string;
}

/**
 * The wider secondary panel shown to the right of {@link SidebarRail} when
 * `activeRailItem` matches its `value`. Renders nothing otherwise — the
 * surrounding wrapper animates its width to `0` so the layout reflows
 * smoothly.
 */
function SidebarPanel({ value, className, ...props }: SidebarPanelProps) {
  const { activeRailItem } = useSidebar();
  if (activeRailItem !== value) {
    return null;
  }
  return (
    <div
      className={cn("flex h-full w-full flex-col", className)}
      data-sidebar="panel"
      data-slot="sidebar-panel"
      data-value={value}
      {...props}
    />
  );
}

/**
 * A button that calls {@link useSidebar}'s `toggleSidebar` when clicked,
 * merging any external `onClick` handler before toggling.
 */
function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className={cn(className)}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      size="icon-sm"
      variant="ghost"
      {...props}
    >
      <HugeiconsIcon icon={SidebarLeftIcon} strokeWidth={2} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

/**
 * A thin drag handle on the edge of a {@link Sidebar} that lets users
 * toggle it by clicking; hidden on small screens.
 *
 * @remarks
 * The cursor flips direction depending on `data-side` and whether the
 * sidebar is expanded or collapsed, giving a clear affordance for the
 * resulting action. `tabIndex={-1}` keeps it out of the tab order — the
 * keyboard shortcut and {@link SidebarTrigger} are the accessible paths.
 * A faint chevron glyph fades in on hover so the affordance is
 * discoverable at rest instead of relying solely on cursor change.
 *
 * @remarks
 * In versions before the Sidebar rework this part was named `SidebarRail`.
 * The new {@link SidebarRail} now refers to the always-visible icon column
 * used by `collapsible="rail"`.
 */
function SidebarToggleRail({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      aria-label="Toggle Sidebar"
      className={cn(
        "group/toggle-rail absolute inset-y-0 z-20 hidden w-4 transition-[background-color,transform] ease-out after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 motion-reduce:transition-none sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      data-sidebar="toggle-rail"
      data-slot="sidebar-toggle-rail"
      onClick={toggleSidebar}
      tabIndex={-1}
      title="Toggle Sidebar"
      {...props}
    >
      <HugeiconsIcon
        className="pointer-events-none absolute top-1/2 left-1/2 size-3 shrink-0 -translate-x-1/2 -translate-y-1/2 text-sidebar-foreground opacity-0 transition-opacity duration-(--duration-fast) ease-out group-hover/toggle-rail:opacity-60 motion-reduce:transition-none"
        data-slot="sidebar-toggle-rail-glyph"
        icon={SidebarLeftIcon}
        strokeWidth={2}
      />
    </button>
  );
}

/**
 * The `<main>` content area that sits beside a {@link Sidebar}.
 *
 * When the sidebar uses `variant="inset"`, this element gains rounded corners
 * and a shadow to make it appear inset inside the sidebar shell.
 */
function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-lg md:peer-data-[variant=inset]:shadow-sm",
        className
      )}
      data-slot="sidebar-inset"
      {...props}
    />
  );
}

/** Props for {@link SidebarSearchButton}. */
export interface SidebarSearchButtonProps
  extends React.ComponentProps<"button"> {
  /** Fires on click and on the registered keyboard shortcut. */
  onTrigger?: () => void;
  /** Placeholder text shown in the row. Defaults to `"Search…"`. */
  placeholder?: string;
  /**
   * Keyboard hint glyph displayed at the trailing edge (e.g. `"⌘K"`).
   * Pass `null` to hide the hint while still wiring the shortcut handler.
   */
  shortcut?: string | null;
  /** Character key that triggers the shortcut combo with Cmd/Ctrl. Defaults to `"k"`. */
  shortcutKey?: string;
}

/**
 * A pre-styled row that opens a global command palette / search dialog.
 *
 * Behaves like a button so it can sit inside a {@link SidebarHeader} or
 * {@link SidebarContent} without conflicting with native form controls.
 * Registers a Cmd/Ctrl + `shortcutKey` listener when an `onTrigger`
 * callback is supplied, so users can summon the palette without
 * grabbing the mouse.
 *
 * In icon-collapse mode the row shrinks to a square icon and hides its
 * placeholder + shortcut hint.
 */
function SidebarSearchButton({
  className,
  placeholder = "Search…",
  shortcut = "⌘K",
  shortcutKey = "k",
  onTrigger,
  onClick,
  ...props
}: SidebarSearchButtonProps) {
  React.useEffect(() => {
    if (!onTrigger) {
      return;
    }
    const handler = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === shortcutKey &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        onTrigger();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onTrigger, shortcutKey]);

  return (
    <button
      className={cn(
        "group/search flex h-8 w-full items-center gap-2 rounded-md border border-sidebar-border bg-transparent px-2 text-left text-muted-foreground text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground focus-visible:ring-3 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
        className
      )}
      data-sidebar="search-button"
      data-slot="sidebar-search-button"
      onClick={(event) => {
        onClick?.(event);
        onTrigger?.();
      }}
      type="button"
      {...props}
    >
      <HugeiconsIcon
        className="size-4 shrink-0"
        icon={Search01Icon}
        strokeWidth={2}
      />
      <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
        {placeholder}
      </span>
      {shortcut ? (
        <kbd className="rounded border border-sidebar-border px-1.5 font-mono text-micro group-data-[collapsible=icon]:hidden">
          {shortcut}
        </kbd>
      ) : null}
    </button>
  );
}

/** A search / filter input styled for use inside a {@link Sidebar}. */
function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "h-8 w-full border-sidebar-border bg-transparent shadow-none focus-visible:border-sidebar-ring",
        className
      )}
      data-sidebar="input"
      data-slot="sidebar-input"
      {...props}
    />
  );
}

/** Top section of a {@link Sidebar}; typically holds a logo or workspace switcher. */
function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 p-2", className)}
      data-sidebar="header"
      data-slot="sidebar-header"
      {...props}
    />
  );
}

/** Bottom section of a {@link Sidebar}; typically holds user account controls. */
function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 p-2", className)}
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...props}
    />
  );
}

/** A {@link Separator} pre-indented for the sidebar's horizontal margins. */
function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...props}
    />
  );
}

/**
 * Scrollable middle region of a {@link Sidebar} that stretches to fill
 * available height; hides overflow when collapsed to icon width.
 */
function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "no-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...props}
    />
  );
}

/**
 * Local context for {@link SidebarGroup} that tells its children whether
 * they live inside a collapsible group. Drives the trigger swap on
 * {@link SidebarGroupLabel} and the panel swap on {@link SidebarGroupContent}.
 */
type SidebarGroupContextValue = { collapsible: boolean };
const SidebarGroupContext = React.createContext<SidebarGroupContextValue>({
  collapsible: false,
});

/** Props for {@link SidebarGroup}. */
export interface SidebarGroupProps extends React.ComponentProps<"div"> {
  /**
   * Persistence key for the group's open/closed state. When set, the group
   * becomes a Base UI `Collapsible` and its {@link SidebarGroupLabel}
   * promotes itself to a disclosure trigger with a rotating chevron.
   */
  collapsible?: string;
  /** Initial open state when uncontrolled. Defaults to `true`. */
  defaultOpen?: boolean;
  /** Called when the group's open state changes in controlled mode. */
  onOpenChange?: (open: boolean) => void;
  /** Controlled openness; pair with {@link SidebarGroupProps.onOpenChange}. */
  open?: boolean;
  /**
   * When `true`, the group floats to the bottom of {@link SidebarContent}
   * via `margin-top: auto` — handy for "Settings" / "Help" rows that
   * should always sit at the foot of the nav list.
   */
  pinned?: boolean;
}

/**
 * A labelled section inside {@link SidebarContent}; pairs with
 * {@link SidebarGroupLabel}, {@link SidebarGroupAction}, and
 * {@link SidebarGroupContent}.
 *
 * @remarks
 * Pass {@link SidebarGroupProps.collapsible} to make the group fold:
 * the group renders as a Base UI `Collapsible.Root`, its label becomes
 * a trigger with a chevron, and its content animates between heights.
 * The `value` string is the persistence key shared with the provider's
 * `openSubmenus` set so the open/closed state survives unmount.
 */
function SidebarGroup({
  className,
  collapsible,
  open,
  onOpenChange,
  defaultOpen = true,
  pinned,
  ...props
}: SidebarGroupProps) {
  const ctx = useSidebar();
  const isCollapsible = typeof collapsible === "string";

  const groupClassName = cn(
    "relative flex w-full min-w-0 flex-col p-2",
    pinned && "mt-auto",
    className
  );

  // Mirror initial defaultOpen into the provider's disclosure registry
  // once on mount, so a freshly-mounted uncollapsed group still shows its
  // content (the registry starts with all keys absent / closed).
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only sync
  React.useEffect(() => {
    if (
      isCollapsible &&
      open === undefined &&
      defaultOpen &&
      !ctx.isSubmenuOpen(collapsible)
    ) {
      ctx.setSubmenuOpen(collapsible, true);
    }
  }, []);

  if (!isCollapsible) {
    return (
      <SidebarGroupContext.Provider value={{ collapsible: false }}>
        <div
          className={groupClassName}
          data-sidebar="group"
          data-slot="sidebar-group"
          {...props}
        />
      </SidebarGroupContext.Provider>
    );
  }

  const providerOpen = ctx.isSubmenuOpen(collapsible);
  const handleOpenChange = (next: boolean) => {
    if (open === undefined) {
      ctx.setSubmenuOpen(collapsible, next);
    }
    onOpenChange?.(next);
  };

  return (
    <SidebarGroupContext.Provider value={{ collapsible: true }}>
      <CollapsiblePrimitive.Root
        className={groupClassName}
        data-sidebar="group"
        data-slot="sidebar-group"
        onOpenChange={handleOpenChange}
        open={open ?? providerOpen}
        render={<div />}
        {...props}
      />
    </SidebarGroupContext.Provider>
  );
}

/**
 * Section heading inside a {@link SidebarGroup}; fades out and collapses its
 * margin when the sidebar is in icon mode.
 *
 * Accepts a `render` prop to swap the underlying element (e.g. to an `<a>`).
 *
 * @remarks
 * When the enclosing {@link SidebarGroup} has a `collapsible` key, this
 * label is promoted to a `Collapsible.Trigger` so clicking toggles the
 * group; a small chevron is appended automatically and rotates with the
 * open state.
 */
function SidebarGroupLabel({
  className,
  render,
  children,
  ...props
}: useRender.ComponentProps<"div"> & React.ComponentProps<"div">) {
  const { collapsible } = React.useContext(SidebarGroupContext);

  const composedChildren = (
    <>
      {children}
      {collapsible ? (
        <HugeiconsIcon
          className="ml-auto size-3 transition-transform duration-(--duration-base) ease-out group-aria-[expanded=false]/group-label:-rotate-90 motion-reduce:transition-none"
          data-slot="sidebar-group-label-chevron"
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
      ) : null}
    </>
  );

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "group/group-label flex h-8 shrink-0 items-center rounded-md px-2 font-medium text-sidebar-foreground/70 text-xs outline-hidden ring-sidebar-ring transition-[margin,opacity] duration-(--duration-base) ease-out focus-visible:ring-3 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0",
          collapsible &&
            "w-full cursor-pointer text-left hover:text-sidebar-foreground",
          className
        ),
      },
      { ...props, children: composedChildren }
    ),
    render: collapsible ? (
      <CollapsiblePrimitive.Trigger render={render} />
    ) : (
      render
    ),
    state: {
      slot: "sidebar-group-label",
      sidebar: "group-label",
    },
  });
}

/**
 * An icon-button anchored to the top-right of a {@link SidebarGroup} (e.g.
 * an "Add" button); hidden in icon-collapse mode.
 *
 * Accepts a `render` prop to swap the underlying element.
 */
function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> & React.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-hidden ring-sidebar-ring transition-transform after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 group-data-[collapsible=icon]:hidden md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-group-action",
      sidebar: "group-action",
    },
  });
}

/**
 * Content wrapper inside a {@link SidebarGroup}; usually holds a
 * {@link SidebarMenu}.
 *
 * @remarks
 * When the enclosing {@link SidebarGroup} has a `collapsible` key, this
 * wrapper becomes a `Collapsible.Panel` and animates its height between
 * 0 and the measured intrinsic value.
 */
function SidebarGroupContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { collapsible } = React.useContext(SidebarGroupContext);

  if (!collapsible) {
    return (
      <div
        className={cn("w-full text-sm", className)}
        data-sidebar="group-content"
        data-slot="sidebar-group-content"
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <CollapsiblePrimitive.Panel
      className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-(--duration-base) ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
    >
      <div className={cn("w-full text-sm", className)} {...props}>
        {children}
      </div>
    </CollapsiblePrimitive.Panel>
  );
}

/**
 * Local flag telling descendant {@link SidebarMenuItem}s they live inside
 * a reorderable {@link SidebarMenu} so they should self-register with the
 * surrounding {@link Sortable}.
 */
const SidebarMenuReorderableContext = React.createContext<boolean>(false);

/** Props for {@link SidebarMenu}. */
export interface SidebarMenuProps extends React.ComponentProps<"ul"> {
  /** Ordered list of stable item ids. Required when `reorderable`. */
  items?: string[];
  /** Fired with the reshuffled list after a successful drag. */
  onReorder?: (items: string[]) => void;
  /**
   * Opt into drag-to-reorder. When `true`, pair with `items` + `onReorder`
   * and give each child {@link SidebarMenuItem} a `value` matching one of
   * the `items` entries. The menu renders as a `role="list"` div so the
   * dnd-kit wrappers can sit inside without breaking HTML semantics.
   */
  reorderable?: boolean;
}

/**
 * Unstyled container for {@link SidebarMenuItem}s.
 *
 * @remarks
 * Defaults to a plain `<ul>`. Opt into drag-to-reorder by passing
 * `reorderable` along with the matching `items` + `onReorder` controls.
 * In reorderable mode the menu renders as a `role="list"` `<div>` so the
 * dnd-kit wrappers can sit inside without invalidating HTML structure;
 * each {@link SidebarMenuItem} self-registers via the
 * {@link SortableItem} primitive.
 */
function SidebarMenu({
  className,
  reorderable,
  items,
  onReorder,
  children,
  ...props
}: SidebarMenuProps) {
  if (reorderable) {
    const list = items ?? [];
    // Drop drag handlers from the spread — Sortable owns those — and forward
    // the rest as plain div attrs so dnd-kit's wrappers stay well-typed.
    const {
      onDrag: _onDrag,
      onDragStart: _onDragStart,
      onDragEnd: _onDragEnd,
      onDragEnter: _onDragEnter,
      onDragExit: _onDragExit,
      onDragLeave: _onDragLeave,
      onDragOver: _onDragOver,
      onDrop: _onDrop,
      ...rest
    } = props;
    return (
      <SidebarMenuReorderableContext.Provider value>
        <Sortable<string>
          className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
          getItemValue={(v) => v}
          onValueChange={(next) => onReorder?.(next)}
          role="list"
          strategy="vertical"
          value={list}
          {...(rest as Omit<
            React.ComponentProps<"div">,
            "onDragStart" | "onDragEnd"
          >)}
        >
          {children}
        </Sortable>
      </SidebarMenuReorderableContext.Provider>
    );
  }
  return (
    <ul
      className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...props}
    >
      {children}
    </ul>
  );
}

/**
 * Snapshot of a {@link SidebarMenuSubButton} collected by its parent
 * {@link SidebarMenuItem}; the flyout in icon mode reuses the snapshot
 * to render a popover with the same items.
 */
type SidebarMenuItemSubItem = {
  label: React.ReactNode;
  href?: string;
  isActive?: boolean;
  onClick?: (event: React.MouseEvent) => void;
};

/**
 * Local context for {@link SidebarMenuItem} that tells nested parts
 * (a hasSubMenu button, a SidebarMenuSub, a SidebarMenuFlyout) which
 * disclosure key they're keyed by and which sub-items the flyout should
 * mirror when the sidebar collapses to icon width.
 */
type SidebarMenuItemContextValue = {
  value: string | null;
  subItems: SidebarMenuItemSubItem[];
};
const SidebarMenuItemContext = React.createContext<SidebarMenuItemContextValue>(
  {
    value: null,
    subItems: [],
  }
);

/** Props for {@link SidebarMenuItem}. */
export interface SidebarMenuItemProps extends React.ComponentProps<"li"> {
  /**
   * Persistence key shared by this item's hasSubMenu button and its
   * {@link SidebarMenuSub}. Required when the item contains a sub-menu;
   * otherwise leave unset and the item behaves like a plain `<li>`.
   */
  value?: string;
}

/**
 * A list item wrapper for a single row in a {@link SidebarMenu}.
 *
 * @remarks
 * When `value` is set the item promotes itself to a Base UI
 * `Collapsible.Root` so its child `hasSubMenu` button and
 * {@link SidebarMenuSub} stay in sync through the provider's disclosure
 * registry.
 */
function SidebarMenuItem({
  className,
  value,
  children,
  ...props
}: SidebarMenuItemProps) {
  const ctx = useSidebar();

  // Walk children once to collect a flyout-friendly snapshot of any
  // SidebarMenuSubButton elements nested under a SidebarMenuSub.
  const subItems = React.useMemo<SidebarMenuItemSubItem[]>(() => {
    if (!value) {
      return [];
    }
    const collected: SidebarMenuItemSubItem[] = [];
    const visitSubButton = (node: React.ReactNode) => {
      if (!React.isValidElement(node)) {
        return;
      }
      // biome-ignore lint/suspicious/noExplicitAny: structural element walk
      const el = node as React.ReactElement<any>;
      if (el.type === SidebarMenuSubButton) {
        collected.push({
          label: el.props.children,
          href: el.props.href,
          isActive: el.props.active,
          onClick: el.props.onClick,
        });
        return;
      }
      React.Children.forEach(el.props?.children, visitSubButton);
    };
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        return;
      }
      // biome-ignore lint/suspicious/noExplicitAny: structural element walk
      const el = child as React.ReactElement<any>;
      if (el.type === SidebarMenuSub) {
        React.Children.forEach(el.props.children, visitSubButton);
      }
    });
    return collected;
  }, [children, value]);

  const itemClassName = cn("group/menu-item relative", className);
  const itemContextValue = React.useMemo(
    () => ({ value: value ?? null, subItems }),
    [value, subItems]
  );

  const reorderable = React.useContext(SidebarMenuReorderableContext);

  if (!value) {
    if (reorderable) {
      // Reorderable items must have a value — fall back to a plain row so the
      // menu does not crash; the dragger has nothing to key off without one.
      return (
        <SidebarMenuItemContext.Provider value={itemContextValue}>
          {/* biome-ignore lint/a11y/useSemanticElements: reorderable menus use a div container (SortableItem renders as div); listitem role keeps the AT contract */}
          <div
            className={itemClassName}
            data-sidebar="menu-item"
            data-slot="sidebar-menu-item"
            role="listitem"
            {...(props as React.ComponentProps<"div">)}
          >
            {children}
          </div>
        </SidebarMenuItemContext.Provider>
      );
    }
    return (
      <SidebarMenuItemContext.Provider value={itemContextValue}>
        <li
          className={itemClassName}
          data-sidebar="menu-item"
          data-slot="sidebar-menu-item"
          {...props}
        >
          {children}
        </li>
      </SidebarMenuItemContext.Provider>
    );
  }

  if (reorderable) {
    return (
      <SidebarMenuItemContext.Provider value={itemContextValue}>
        <SortableItem
          className={itemClassName}
          data-sidebar="menu-item"
          data-slot="sidebar-menu-item"
          role="listitem"
          value={value}
          {...(props as React.ComponentProps<"div">)}
        >
          {children}
        </SortableItem>
      </SidebarMenuItemContext.Provider>
    );
  }

  return (
    <SidebarMenuItemContext.Provider value={itemContextValue}>
      <CollapsiblePrimitive.Root
        className={itemClassName}
        data-sidebar="menu-item"
        data-slot="sidebar-menu-item"
        onOpenChange={(next: boolean) => ctx.setSubmenuOpen(value, next)}
        open={ctx.isSubmenuOpen(value)}
        render={<li {...(props as React.LiHTMLAttributes<HTMLLIElement>)} />}
      >
        {children}
      </CollapsiblePrimitive.Root>
    </SidebarMenuItemContext.Provider>
  );
}

/**
 * Grab handle exposed inside a reorderable {@link SidebarMenuItem}. Pointer
 * dragging is initiated from this element; the handle fades in only when
 * the parent menu item is hovered to avoid visual noise at rest.
 *
 * @remarks
 * - Hidden in icon-collapsed mode.
 * - Render once per item, typically as the first child of a
 *   {@link SidebarMenuItem}, before the {@link SidebarMenuButton}.
 */
function SidebarMenuDragHandle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <SortableItemHandle
      className={cn(
        "absolute top-1.5 left-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground/60 opacity-0 transition-opacity duration-(--duration-fast) ease-out hover:text-sidebar-foreground group-hover/menu-item:opacity-100 group-data-[collapsible=icon]:hidden motion-reduce:transition-none [&>svg]:size-3",
        className
      )}
      data-sidebar="menu-drag-handle"
      data-slot="sidebar-menu-drag-handle"
      {...props}
    >
      <HugeiconsIcon
        aria-hidden="true"
        icon={DragDropHorizontalIcon}
        strokeWidth={2}
      />
    </SortableItemHandle>
  );
}

/**
 * Class-variance-authority recipe for {@link SidebarMenuButton}.
 *
 * Exposes two axes:
 * - `variant` — `"default"` (accent on hover) or `"outline"` (shadow ring
 *   that shifts to the accent colour on hover).
 * - `size` — `"sm"`, `"default"`, or `"lg"` controlling height, padding,
 *   and text size; `"lg"` removes padding when the sidebar is icon-collapsed.
 */
const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button relative flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:bg-sidebar-active data-active:font-medium data-active:text-sidebar-active-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:before:absolute data-active:before:inset-y-1 data-active:before:start-0 data-active:before:w-0.5 data-active:before:rounded-full data-active:before:bg-sidebar-active-rail group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! group-data-[collapsible=icon]:data-active:before:inset-x-1 group-data-[collapsible=icon]:data-active:before:inset-y-auto group-data-[collapsible=icon]:data-active:before:bottom-1 group-data-[collapsible=icon]:data-active:before:h-0.5 [&>span:last-child]:truncate [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * The primary clickable row inside a {@link SidebarMenuItem}.
 *
 * Accepts a `render` prop (via Base UI `useRender`) to swap the element —
 * e.g. a framework `<Link>` — while keeping all sidebar styles. When the
 * sidebar is collapsed to icon mode and a `tooltip` is provided, the button
 * wraps itself in a {@link Tooltip} that appears on the right.
 *
 * @remarks
 * - `active` applies the active accent styles and sets `data-active` for
 *   downstream selectors.
 * - `tooltip` can be a plain string or a full
 *   {@link TooltipContent} props object; the tooltip is automatically hidden
 *   when the sidebar is expanded or on mobile.
 */
/** Props for {@link SidebarMenuButton}. */
export type SidebarMenuButtonProps = useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    /** Whether this row represents the current page. Sets `data-active` and `aria-current="page"`. */
    active?: boolean;
    /** Tooltip shown when the sidebar is collapsed to icon or when the label is truncated. */
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
    /**
     * When `true`, promotes this button into a Base UI `Collapsible.Trigger`
     * for the enclosing {@link SidebarMenuItem}'s sub-menu and appends a
     * rotating chevron at the trailing edge.
     */
    subMenu?: boolean;
  } & VariantProps<typeof sidebarMenuButtonVariants>;

/**
 * Primary clickable row inside a `SidebarMenuItem`. Renders a polymorphic
 * trigger (via `useRender`), forwards `aria-current="page"` when active, wires
 * the rail-aware active-state recipe, and — when paired with `subMenu` —
 * becomes the disclosure trigger for the enclosing item's `SidebarMenuSub`
 * (animated when expanded, mirrored as a hover-popover flyout when the sidebar
 * is collapsed to icon width).
 */
function SidebarMenuButton({
  render,
  active = false,
  variant = "default",
  size = "default",
  tooltip,
  subMenu,
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar();
  const itemCtx = React.useContext(SidebarMenuItemContext);
  const [labelRef, truncated] = useTruncated<HTMLElement>();

  if (subMenu && !itemCtx.value && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error(
      "SidebarMenuButton: `subMenu` requires the parent SidebarMenuItem to declare a `value` prop."
    );
  }

  const composedChildren = (
    <>
      {children}
      {subMenu ? (
        <HugeiconsIcon
          className="ml-auto size-4 transition-transform duration-(--duration-base) ease-out group-aria-expanded/menu-button:rotate-180 group-data-[collapsible=icon]:hidden motion-reduce:transition-none"
          data-slot="sidebar-menu-button-chevron"
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
      ) : null}
    </>
  );

  const baseRender = tooltip ? <TooltipTrigger render={render} /> : render;
  const finalRender = subMenu ? (
    <CollapsiblePrimitive.Trigger
      render={baseRender ?? <button type="button" />}
    />
  ) : (
    baseRender
  );

  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
        "aria-current": active ? "page" : undefined,
        ref: labelRef as React.Ref<HTMLButtonElement>,
      },
      { ...props, children: composedChildren }
    ),
    render: finalRender,
    state: {
      slot: "sidebar-menu-button",
      sidebar: "menu-button",
      size,
      active,
    },
  });

  // Auto-flyout: when the button represents a sub-menu and the sidebar
  // is collapsed, surface the sub-items in a hover-popover so users can
  // still reach them without expanding the sidebar.
  const flyoutCandidate =
    subMenu && state === "collapsed" && itemCtx.subItems.length > 0;

  if (!tooltip) {
    return flyoutCandidate ? (
      <SidebarMenuFlyout>{comp}</SidebarMenuFlyout>
    ) : (
      comp
    );
  }

  // Normalise string tooltip to TooltipContent props object.
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  const tooltipWrapped = (
    <Tooltip>
      {comp}
      <TooltipContent
        align="center"
        hidden={(!truncated && state !== "collapsed") || isMobile}
        side="right"
        {...tooltip}
      />
    </Tooltip>
  );

  return flyoutCandidate ? (
    <SidebarMenuFlyout>{tooltipWrapped}</SidebarMenuFlyout>
  ) : (
    tooltipWrapped
  );
}

/**
 * A small action button absolutely positioned at the trailing edge of a
 * {@link SidebarMenuItem} row (e.g. a "…" or "+" button).
 *
 * @remarks
 * - `showOnHover` hides the action at `opacity-0` on desktop until the
 *   parent menu item is hovered or focused, then fades it in — reducing
 *   visual noise in long nav lists.
 * - Hidden automatically in icon-collapse mode.
 * - Accepts a `render` prop to swap the underlying element.
 */
function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean;
  }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-hidden ring-sidebar-ring transition-transform after:absolute after:-inset-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 peer-hover/menu-button:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0",
          showOnHover &&
            "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 aria-expanded:opacity-100 peer-data-active/menu-button:text-sidebar-accent-foreground md:opacity-0",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-menu-action",
      sidebar: "menu-action",
    },
  });
}

/**
 * A numeric or string badge pinned to the trailing edge of a
 * {@link SidebarMenuItem}; vertically aligns with the paired
 * {@link SidebarMenuButton} using peer size selectors.
 */
function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 font-medium text-sidebar-foreground text-xs tabular-nums peer-hover/menu-button:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 peer-data-[size=sm]/menu-button:top-1 peer-data-active/menu-button:text-sidebar-accent-foreground",
        className
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...props}
    />
  );
}

/**
 * A loading placeholder row for a {@link SidebarMenu} item.
 *
 * Renders a skeleton icon (optional, via `showIcon`) and a text skeleton
 * whose width is randomised once on mount to make lists look more natural
 * during loading.
 */
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const [width] = React.useState(
    () => `${Math.floor(Math.random() * 40) + 50}%`
  );

  return (
    <div
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/** Props for {@link SidebarMenuSub}. */
export interface SidebarMenuSubProps extends React.ComponentProps<"ul"> {
  /**
   * Persistence key — must match the enclosing {@link SidebarMenuItem}'s
   * `value`. Required: the sub-menu cannot animate open/closed without it.
   */
  value: string;
}

/**
 * A nested `<ul>` for second-level menu items inside a
 * {@link SidebarMenuItem}; visually indented with a left border rule.
 * Hidden in icon-collapse mode (the parent's
 * {@link SidebarMenuFlyout} shows the items in a popover instead).
 *
 * @remarks
 * Wraps the list in a Base UI `Collapsible.Panel` so opening and closing
 * animate the panel height between 0 and its intrinsic value, in sync
 * with the disclosure state stored on the provider.
 */
function SidebarMenuSub({
  className,
  children,
  value: _value,
  ...props
}: SidebarMenuSubProps) {
  return (
    <CollapsiblePrimitive.Panel
      className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-(--duration-base) ease-out data-ending-style:h-0 data-starting-style:h-0 group-data-[collapsible=icon]:hidden motion-reduce:transition-none"
      data-sidebar="menu-sub-panel"
      data-slot="sidebar-menu-sub-panel"
    >
      <ul
        className={cn(
          "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-sidebar-border border-l px-2.5 py-0.5",
          className
        )}
        data-sidebar="menu-sub"
        data-slot="sidebar-menu-sub"
        {...props}
      >
        {children}
      </ul>
    </CollapsiblePrimitive.Panel>
  );
}

/** A list item wrapper for a row inside a {@link SidebarMenuSub}. */
function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      className={cn("group/menu-sub-item relative", className)}
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...props}
    />
  );
}

/**
 * The clickable row inside a {@link SidebarMenuSubItem}.
 *
 * Defaults to an `<a>` element; swap via the `render` prop (e.g. a
 * framework `<Link>`). `size` controls text size (`"sm"` | `"md"`).
 */
function SidebarMenuSubButton({
  render,
  size = "md",
  active = false,
  className,
  ...props
}: useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    size?: "sm" | "md";
    active?: boolean;
  }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-hidden ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:bg-sidebar-active data-active:font-medium data-[size=md]:text-sm data-[size=sm]:text-xs data-active:text-sidebar-active-foreground group-data-[collapsible=icon]:hidden [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      sidebar: "menu-sub-button",
      size,
      active,
    },
  });
}

/**
 * Wraps a {@link SidebarMenuButton} so its sub-items appear in a
 * hover-popover when the sidebar is collapsed to icon width.
 *
 * @remarks
 * Reads {@link SidebarMenuItemContext} to know which sub-items to mirror,
 * so a value-bound {@link SidebarMenuItem} with a {@link SidebarMenuSub}
 * needs no extra wiring — {@link SidebarMenuButton} auto-injects this
 * flyout when `hasSubMenu` is set and the sidebar is collapsed. Pass
 * `<SidebarMenuFlyout>` manually when you want fine-grained control
 * (e.g. a custom trigger that isn't a {@link SidebarMenuButton}).
 *
 * Built on Base UI's `Menu` primitive with `openOnHover` so users can
 * peek at sub-items by moving the cursor over the parent icon.
 */
/** Props for {@link SidebarUserButton}. */
export interface SidebarUserButtonProps
  extends Omit<React.ComponentProps<"button">, "title"> {
  /**
   * Avatar element rendered to the leading edge (typically an `<Avatar>`
   * or `<img>`). Sized down to fit the row at `size-7`.
   */
  avatar?: React.ReactNode;
  /** Optional secondary line — often the user's email. */
  email?: string;
  /**
   * Menu body — Base UI `MenuPrimitive.Item` and friends. When omitted,
   * the button still renders the chevron unless {@link SidebarUserButtonProps.static}
   * is set; clicks fall through to the consumer's `onClick`.
   */
  menu?: React.ReactNode;
  /** Primary display name. */
  name: string;
  /**
   * When `true`, the row is a plain account chip with no menu wrapper
   * and no chevron — handy when the surrounding shell already provides
   * the account dropdown elsewhere.
   */
  static?: boolean;
}

/**
 * Account row pinned to the bottom of a sidebar — avatar + name + email
 * + an account menu opened via Base UI `Menu`.
 *
 * Compact in icon-collapse mode: only the avatar shows; the menu still
 * opens with the same items.
 */
function SidebarUserButton({
  className,
  name,
  email,
  avatar,
  menu,
  static: isStatic,
  ...props
}: SidebarUserButtonProps) {
  const chip = (
    <button
      className={cn(
        "group/user-button flex w-full items-center gap-2 rounded-md p-2 text-left text-sidebar-foreground outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
        className
      )}
      data-sidebar="user-button"
      data-slot="sidebar-user-button"
      type="button"
      {...props}
    >
      {avatar ? (
        <span
          className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-accent"
          data-slot="sidebar-user-button-avatar"
        >
          {avatar}
        </span>
      ) : null}
      <span
        className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden"
        data-slot="sidebar-user-button-body"
      >
        <span className="truncate font-medium text-sm">{name}</span>
        {email ? (
          <span className="truncate text-muted-foreground text-xs">
            {email}
          </span>
        ) : null}
      </span>
      {isStatic ? null : (
        <HugeiconsIcon
          className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
          data-slot="sidebar-user-button-chevron"
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
      )}
    </button>
  );

  if (isStatic || !menu) {
    return chip;
  }

  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger render={chip} />
      <MenuPrimitive.Portal>
        {/* isolate prevents z-index bleed from ancestor stacking contexts */}
        <MenuPrimitive.Positioner
          align="end"
          className="isolate z-(--z-popover) outline-none"
          side="right"
          sideOffset={4}
        >
          <MenuPrimitive.Popup
            className="data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-(--z-popover) max-h-(--available-height) min-w-48 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 duration-(--duration-base) data-closed:animate-out data-open:animate-in data-closed:overflow-hidden data-closed:duration-(--duration-fast) motion-reduce:animate-none motion-reduce:transition-none"
            data-slot="sidebar-user-button-menu"
          >
            {menu}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}

/** Shape of the `current` selection shown by {@link SidebarSwitcher}. */
export interface SidebarSwitcherCurrent {
  /**
   * Logo / avatar node rendered to the left of the name. Pass any React
   * element (an `<img>`, an icon, a coloured square with an initial).
   */
  logo?: React.ReactNode;
  /**
   * Optional secondary line — usually the role or plan (e.g. "Pro",
   * "Owner"). Hidden in icon-collapsed mode.
   */
  meta?: string;
  /** Display name of the selected workspace / tenant. */
  name: string;
}

/** Props for {@link SidebarSwitcher}. */
export interface SidebarSwitcherProps
  extends Omit<React.ComponentProps<"button">, "title"> {
  /**
   * Popover body — typically a list of {@link SidebarSwitcherItem}s plus
   * any auxiliary actions (e.g. "Create workspace").
   */
  children?: React.ReactNode;
  /** The currently selected workspace; controls the trigger row. */
  current: SidebarSwitcherCurrent;
}

/**
 * Workspace / tenant switcher row, usually pinned to the
 * {@link SidebarHeader}.
 *
 * The trigger is a full-width sidebar row showing a logo + name + optional
 * `meta` line and a trailing chevron. Clicking opens a Base UI `Popover`
 * positioned to the right of the sidebar, into which consumers slot
 * {@link SidebarSwitcherItem}s.
 *
 * @remarks
 * - In icon-collapsed mode the row shrinks to a square showing only the
 *   logo.
 * - The popover stays positioned to the right so it never overlaps the
 *   nav itself.
 *
 * @example
 * ```tsx
 * <SidebarSwitcher current={{ name: "Acme", meta: "Pro", logo: <AcmeLogo /> }}>
 *   <SidebarSwitcherItem name="Acme" meta="Pro" selected />
 *   <SidebarSwitcherItem name="Globex" meta="Free" />
 * </SidebarSwitcher>
 * ```
 */
function SidebarSwitcher({
  className,
  current,
  children,
  ...props
}: SidebarSwitcherProps) {
  const trigger = (
    <button
      className={cn(
        "group/switcher flex w-full items-center gap-2 rounded-md p-2 text-left text-sidebar-foreground outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0",
        className
      )}
      data-sidebar="switcher"
      data-slot="sidebar-switcher"
      type="button"
      {...props}
    >
      {current.logo ? (
        <span
          aria-hidden
          className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-sidebar-accent text-sidebar-accent-foreground"
          data-slot="sidebar-switcher-logo"
        >
          {current.logo}
        </span>
      ) : null}
      <span
        className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden"
        data-slot="sidebar-switcher-body"
      >
        <span className="truncate font-medium text-sm">{current.name}</span>
        {current.meta ? (
          <span className="truncate text-muted-foreground text-xs">
            {current.meta}
          </span>
        ) : null}
      </span>
      <HugeiconsIcon
        className="ml-auto size-4 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
        data-slot="sidebar-switcher-chevron"
        icon={ArrowDown01Icon}
        strokeWidth={2}
      />
    </button>
  );

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger render={trigger} />
      <PopoverPrimitive.Portal>
        {/* isolate prevents z-index bleed from ancestor stacking contexts */}
        <PopoverPrimitive.Positioner
          align="start"
          className="isolate z-(--z-popover)"
          side="right"
          sideOffset={8}
        >
          <PopoverPrimitive.Popup
            className="data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-(--z-popover) max-h-(--available-height) min-w-64 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md outline-hidden ring-1 ring-foreground/10 duration-(--duration-base) data-closed:animate-out data-open:animate-in data-closed:overflow-hidden data-closed:duration-(--duration-fast) motion-reduce:animate-none motion-reduce:transition-none"
            data-slot="sidebar-switcher-popover"
          >
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/** Props for {@link SidebarSwitcherItem}. */
export interface SidebarSwitcherItemProps
  extends Omit<React.ComponentProps<"button">, "title"> {
  /** Optional logo / avatar node rendered before the name. */
  logo?: React.ReactNode;
  /**
   * Optional secondary metadata line (e.g. plan, role). Rendered
   * underneath the name in muted text.
   */
  meta?: string;
  /** Display name of the workspace. */
  name: string;
  /**
   * When `true`, the item is rendered as the active selection and shows a
   * trailing check glyph. Surfaces as `data-selected="true"` on the DOM
   * node for styling hooks.
   */
  selected?: boolean;
}

/**
 * A single workspace row rendered inside the {@link SidebarSwitcher}
 * popover. Renders as a `<button>` so each row is independently focusable
 * and keyboard-activatable.
 *
 * @remarks
 * - Pass `selected` to mark the row as the current workspace; a trailing
 *   tick glyph appears and `data-selected="true"` is exposed for custom
 *   styling.
 */
function SidebarSwitcherItem({
  className,
  name,
  logo,
  meta,
  selected,
  ...props
}: SidebarSwitcherItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-popover-foreground text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
        className
      )}
      data-selected={selected || undefined}
      data-sidebar="switcher-item"
      data-slot="sidebar-switcher-item"
      type="button"
      {...props}
    >
      {logo ? (
        <span
          aria-hidden
          className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted text-muted-foreground"
          data-slot="sidebar-switcher-item-logo"
        >
          {logo}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{name}</span>
        {meta ? (
          <span className="truncate text-muted-foreground text-xs">{meta}</span>
        ) : null}
      </span>
      {selected ? (
        <HugeiconsIcon
          className="ml-auto size-4 shrink-0 text-muted-foreground"
          data-slot="sidebar-switcher-item-check"
          icon={Tick02Icon}
          strokeWidth={2}
        />
      ) : null}
    </button>
  );
}

/** Props for {@link SidebarCard}. */
export interface SidebarCardProps extends React.ComponentProps<"div"> {
  /**
   * Show the card when the sidebar is collapsed to icon width.
   * Defaults to `false` — most upgrade / onboarding prompts only make
   * sense when there's room for the headline copy.
   */
  showOnCollapse?: boolean;
}

/**
 * Surface for promotional, onboarding, or upgrade content tucked inside
 * a {@link SidebarFooter} or pinned {@link SidebarGroup}.
 *
 * Compose with {@link SidebarCardHeader}, {@link SidebarCardTitle},
 * {@link SidebarCardDescription}, {@link SidebarCardContent}, and
 * {@link SidebarCardFooter} for a consistent layout.
 */
function SidebarCard({
  className,
  showOnCollapse = false,
  ...props
}: SidebarCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3 text-sm",
        !showOnCollapse && "group-data-[collapsible=icon]:hidden",
        className
      )}
      data-sidebar="card"
      data-slot="sidebar-card"
      {...props}
    />
  );
}

/** Header row inside a {@link SidebarCard}; gap + space-between layout. */
function SidebarCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mb-1 flex items-center justify-between gap-2", className)}
      data-slot="sidebar-card-header"
      {...props}
    />
  );
}

/** Title text for a {@link SidebarCard}; medium weight at sidebar text size. */
function SidebarCardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-medium text-sidebar-foreground text-sm", className)}
      data-slot="sidebar-card-title"
      {...props}
    />
  );
}

/** Muted supporting copy for a {@link SidebarCard}; renders as a `<p>`. */
function SidebarCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground text-xs", className)}
      data-slot="sidebar-card-description"
      {...props}
    />
  );
}

/** Body slot inside a {@link SidebarCard}; carries the bulk of the copy. */
function SidebarCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-xs", className)}
      data-slot="sidebar-card-content"
      {...props}
    />
  );
}

/** Footer row inside a {@link SidebarCard}; usually holds action buttons. */
function SidebarCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-3 flex items-center gap-2", className)}
      data-slot="sidebar-card-footer"
      {...props}
    />
  );
}

/**
 * Wraps a `SidebarMenuButton` so that when the sidebar is collapsed to icon
 * width, hovering the icon opens a Base UI `Menu` popover mirroring the
 * sub-items snapshotted from the sibling `SidebarMenuSub`. Renders the trigger
 * untouched when the sidebar is expanded or there are no sub-items.
 */
function SidebarMenuFlyout({ children }: { children: React.ReactElement }) {
  const { state, isMobile } = useSidebar();
  const { subItems } = React.useContext(SidebarMenuItemContext);

  if (state !== "collapsed" || isMobile || subItems.length === 0) {
    return children;
  }

  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger openOnHover render={children} />
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner align="start" side="right" sideOffset={4}>
          <MenuPrimitive.Popup
            className="z-(--z-popover) min-w-40 origin-(--transform-origin) overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none transition-[transform,opacity] duration-(--duration-fast) ease-out data-ending-style:scale-95 data-starting-style:scale-95 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
            data-slot="sidebar-menu-flyout"
          >
            {subItems.map((item) => (
              <MenuPrimitive.Item
                className={cn(
                  "flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
                  item.isActive && "font-medium text-foreground"
                )}
                key={`${item.label}:${item.href ?? ""}`}
                onClick={(event) => {
                  item.onClick?.(event as unknown as React.MouseEvent);
                  if (item.href) {
                    window.location.href = item.href;
                  }
                }}
              >
                {item.label}
              </MenuPrimitive.Item>
            ))}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  );
}

export {
  Sidebar,
  SidebarCard,
  SidebarCardContent,
  SidebarCardDescription,
  SidebarCardFooter,
  SidebarCardHeader,
  SidebarCardTitle,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuDragHandle,
  SidebarMenuFlyout,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarPanel,
  SidebarProvider,
  SidebarRail,
  SidebarRailButton,
  SidebarSearchButton,
  SidebarSeparator,
  SidebarSwitcher,
  SidebarSwitcherItem,
  SidebarToggleRail,
  SidebarTrigger,
  SidebarUserButton,
  useSidebar,
};
