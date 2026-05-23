"use client";

import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "../utils/index";

/**
 * Root layout container for a set of drag-resizable panels.
 *
 * Wraps `react-resizable-panels`' `Group` primitive. Compose it with
 * {@link ResizablePanel} for content areas and {@link ResizableHandle} for
 * the drag handles between them. The group flex-direction is derived from
 * `aria-orientation` on the underlying element: horizontal by default,
 * vertical when `direction="vertical"` is set on the primitive.
 *
 * @remarks
 * - Panels must be given unique `id` props (or auto-generated ones) so the
 *   library can persist and restore sizes across renders.
 * - Use `defaultSize` on each {@link ResizablePanel} to set initial sizes
 *   as percentages (must sum to 100).
 *
 * @example
 * ```tsx
 * <ResizablePanelGroup direction="horizontal">
 *   <ResizablePanel defaultSize={25}>Sidebar</ResizablePanel>
 *   <ResizableHandle withHandle />
 *   <ResizablePanel defaultSize={75}>Main</ResizablePanel>
 * </ResizablePanelGroup>
 * ```
 */
function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      data-slot="resizable-panel-group"
      {...props}
    />
  );
}

/**
 * A single resizable content area inside a {@link ResizablePanelGroup}.
 * Accepts all `react-resizable-panels` `Panel` props such as `defaultSize`,
 * `minSize`, `maxSize`, and `collapsible`.
 */
function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

/**
 * Drag handle separator between two {@link ResizablePanel} elements.
 *
 * @remarks
 * - `withHandle` — when `true`, renders a small visual grip indicator
 *   (a pill-shaped bar) centered on the drag line, making the resizable
 *   boundary more discoverable.
 * - The hit-target is widened via an `::after` pseudo-element so that
 *   dragging is comfortable even on the 1 px visible line.
 */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.Separator
      className={cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      data-slot="resizable-handle"
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
      )}
    </ResizablePrimitive.Separator>
  );
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
