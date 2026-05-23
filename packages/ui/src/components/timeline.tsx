"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type * as React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "../utils/index";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Intent values that drive completed-step colour. */
type TimelineIntent =
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "destructive";

/** Internal context shared between {@link Timeline} and its descendants. */
type TimelineContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  /** Connector line style. `"solid"` (default) = filled bar; `"dotted"` = dashed border. */
  variant: "solid" | "dotted";
  /** Colour intent applied to completed steps. Defaults to `"primary"`. */
  intent: TimelineIntent;
  /** Size preset. `"default"` keeps existing proportions; `"sm"` shrinks everything. */
  size: "sm" | "default";
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TimelineContext = createContext<TimelineContextValue | undefined>(
  undefined
);

/** Hook that reads the nearest {@link Timeline} context. */
const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("useTimeline must be used within a Timeline");
  }
  return context;
};

// ---------------------------------------------------------------------------
// Intent class maps
// ---------------------------------------------------------------------------

/**
 * Per-intent Tailwind classes applied to the completed indicator border
 * and the separator background when the *next* sibling is completed.
 *
 * The separator completed colour is applied via `TimelineItem` using the
 * `has-[+[data-completed]]` adjacent-sibling selector, so only the separator
 * classes are needed here (the indicator class is consumed by
 * `TimelineIndicator`).
 */
const intentClasses: Record<
  TimelineIntent,
  { indicator: string; separator: string }
> = {
  primary: {
    indicator: "group-data-completed/timeline-item:border-primary",
    separator:
      "has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-primary",
  },
  success: {
    indicator: "group-data-completed/timeline-item:border-success",
    separator:
      "has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-success",
  },
  info: {
    indicator: "group-data-completed/timeline-item:border-info",
    separator:
      "has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-info",
  },
  warning: {
    indicator: "group-data-completed/timeline-item:border-warning",
    separator:
      "has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-warning",
  },
  destructive: {
    indicator: "group-data-completed/timeline-item:border-destructive",
    separator:
      "has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-destructive",
  },
};

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

/** Props for {@link Timeline}. */
type TimelineProps = React.ComponentProps<"div"> & {
  /** Initial active step index (uncontrolled). Defaults to `1`. */
  defaultValue?: number;
  /** Active step index (controlled). */
  value?: number;
  /** Called when the active step changes. */
  onValueChange?: (value: number) => void;
  /** Direction of the step track. Defaults to `"vertical"`. */
  orientation?: "horizontal" | "vertical";
  /**
   * Connector line rendering style.
   * - `"solid"` (default) — filled bar using `bg-*` classes.
   * - `"dotted"` — dashed border line drawn via `border-*` + `border-dashed`.
   */
  variant?: "solid" | "dotted";
  /**
   * Colour intent applied to completed-step indicators and separators.
   * Defaults to `"primary"`.
   */
  intent?: TimelineIntent;
  /**
   * Size preset for indicators, gaps, and text.
   * - `"default"` — existing proportions (no change).
   * - `"sm"` — smaller indicator (`size-4`), tighter gaps, smaller text.
   */
  size?: "sm" | "default";
};

/**
 * Stepped progress tracker that renders a sequence of labeled events.
 *
 * Compose with {@link TimelineItem} for each step, nesting
 * {@link TimelineHeader} (containing {@link TimelineIndicator},
 * {@link TimelineSeparator}, and {@link TimelineDate}) plus
 * {@link TimelineTitle} and {@link TimelineContent}. The `orientation`
 * prop switches between a vertical stack (default) and a horizontal row.
 *
 * @remarks
 * - Supports both controlled (`value` + `onValueChange`) and uncontrolled
 *   (`defaultValue`) usage — mirrors the same pattern as Radix primitives.
 * - A step is considered completed when its `step` number is ≤ the active
 *   step; this drives the `data-completed` attribute consumed by
 *   {@link TimelineItem} and {@link TimelineIndicator} styling.
 * - The separator line between steps is hidden on the last item via the
 *   `group-last` selector, so no special handling is required by consumers.
 * - Use `variant="dotted"` for a dashed connector line.
 * - Use `intent` to tint completed steps with a semantic colour.
 * - Use `size="sm"` for a compact layout.
 *
 * @example
 * ```tsx
 * <Timeline value={2} intent="success" variant="dotted" size="sm">
 *   {steps.map((s, i) => (
 *     <TimelineItem key={s.id} step={i + 1}>
 *       <TimelineHeader>
 *         <TimelineSeparator />
 *         <TimelineIndicator />
 *         <TimelineDate>{s.date}</TimelineDate>
 *       </TimelineHeader>
 *       <TimelineTitle>{s.title}</TimelineTitle>
 *       <TimelineContent>{s.description}</TimelineContent>
 *     </TimelineItem>
 *   ))}
 * </Timeline>
 * ```
 */
function Timeline({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = "vertical",
  variant = "solid",
  intent = "primary",
  size = "default",
  className,
  ...props
}: TimelineProps) {
  const [activeStep, setInternalStep] = useState(defaultValue);

  const setActiveStep = useCallback(
    (step: number) => {
      // In controlled mode the parent owns the state; skip internal update.
      if (value === undefined) {
        setInternalStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange]
  );

  // Controlled value takes precedence over internal state.
  const currentStep = value ?? activeStep;

  return (
    <TimelineContext.Provider
      value={{ activeStep: currentStep, setActiveStep, variant, intent, size }}
    >
      <div
        className={cn(
          "group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className
        )}
        data-intent={intent}
        data-orientation={orientation}
        data-size={size}
        data-slot="timeline"
        data-variant={variant}
        {...props}
      />
    </TimelineContext.Provider>
  );
}

/** Descriptive body text for a {@link TimelineItem}. */
function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-muted-foreground text-sm group-data-[size=sm]/timeline:text-xs",
        className
      )}
      data-slot="timeline-content"
      {...props}
    />
  );
}

/**
 * Timestamp label rendered above a {@link TimelineItem}'s title. Uses Base
 * UI's `useRender` so the element can be swapped via the `render` prop.
 */
type TimelineDateProps = useRender.ComponentProps<"time">;

function TimelineDate({ render, className, ...props }: TimelineDateProps) {
  return useRender({
    render,
    defaultTagName: "time",
    props: mergeProps<"time">(
      {
        className: cn(
          "mb-1 block font-medium text-muted-foreground text-sm group-data-[size=sm]/timeline:text-xs group-data-[orientation=vertical]/timeline:max-sm:h-4",
          className
        ),
      },
      props
    ),
    state: {
      slot: "timeline-date",
    },
  });
}

/** Layout wrapper that positions the indicator and separator in a {@link TimelineItem}. */
function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(className)} data-slot="timeline-header" {...props} />
  );
}

/**
 * Visual dot/badge placed at the step position inside a
 * {@link TimelineItem}. Marked `aria-hidden`. Filled border color switches
 * when the parent item carries `data-completed`, driven by the current intent.
 * When `icon` is provided the indicator becomes a flex-center container and
 * renders the icon; `children` may also be nested for custom content.
 * Icon takes visual precedence when both are supplied.
 */
type TimelineIndicatorProps = React.ComponentProps<"div"> & {
  /**
   * Optional Hugeicons icon rendered centered inside the indicator bubble.
   * When present, the indicator automatically becomes a flex-center container.
   * Takes precedence over `children` in render order (rendered first).
   */
  icon?: IconSvgElement;
};

function TimelineIndicator({
  className,
  children,
  icon,
  ...props
}: TimelineIndicatorProps) {
  const { intent } = useTimeline();
  const hasContent = icon !== undefined || children !== undefined;

  return (
    <div
      aria-hidden="true"
      className={cn(
        // Base
        "absolute rounded-md border-2 border-primary/20",
        // Default size
        "size-5 group-data-[size=sm]/timeline:size-4",
        // Positioning — horizontal
        "group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
        // Positioning — vertical
        "group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2",
        // Completed intent colour on the border
        intentClasses[intent ?? "primary"].indicator,
        // Flex-center when icon or children present
        hasContent && "flex items-center justify-center",
        className
      )}
      data-slot="timeline-indicator"
      {...props}
    >
      {icon !== undefined && <HugeiconsIcon className="size-3" icon={icon} />}
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TimelineItem
// ---------------------------------------------------------------------------

/** Props for {@link TimelineItem}. */
type TimelineItemProps = React.ComponentProps<"div"> & {
  /** 1-based index of this step; compared against the active step to
   *  set `data-completed`. */
  step: number;
};

/**
 * A single step inside a {@link Timeline}.
 *
 * Sets `data-completed` on itself when `step ≤ activeStep`, which the
 * indicator and separator use for their filled styles. The adjacent
 * sibling selector `has-[+[data-completed]]` on the separator turns the
 * connector line intent-coloured once the *next* step is reached.
 */
function TimelineItem({ step, className, ...props }: TimelineItemProps) {
  const { activeStep, intent } = useTimeline();

  return (
    <div
      className={cn(
        "group/timeline-item relative flex flex-1 flex-col gap-0.5",
        // Vertical spacing/margin
        "group-data-[orientation=vertical]/timeline:ms-8",
        "group-data-[orientation=vertical]/timeline:not-last:pb-12",
        "group-data-[size=sm]/timeline:group-data-[orientation=vertical]/timeline:ms-6",
        "group-data-[size=sm]/timeline:group-data-[orientation=vertical]/timeline:not-last:pb-8",
        // Horizontal spacing/margin
        "group-data-[orientation=horizontal]/timeline:mt-8",
        "group-data-[orientation=horizontal]/timeline:not-last:pe-8",
        "group-data-[size=sm]/timeline:group-data-[orientation=horizontal]/timeline:mt-6",
        "group-data-[size=sm]/timeline:group-data-[orientation=horizontal]/timeline:not-last:pe-6",
        // Completed separator — solid path driven by intent
        intentClasses[intent ?? "primary"].separator,
        className
      )}
      data-completed={step <= activeStep || undefined}
      data-slot="timeline-item"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// TimelineSeparator
// ---------------------------------------------------------------------------

/**
 * Connector line drawn between consecutive {@link TimelineItem} steps.
 * Hidden on the last item via `group-last`. Marked `aria-hidden`.
 *
 * When `variant="dotted"` on the parent {@link Timeline}, the connector
 * switches to a dashed border instead of a filled bar.
 */
function TimelineSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        // Shared layout
        "absolute self-start group-last/timeline-item:hidden",

        // ----- Vertical positioning -----
        "group-data-[orientation=vertical]/timeline:-left-6",
        "group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)]",
        "group-data-[orientation=vertical]/timeline:w-0.5",
        "group-data-[orientation=vertical]/timeline:-translate-x-1/2",
        "group-data-[orientation=vertical]/timeline:translate-y-4.5",

        // ----- Horizontal positioning -----
        "group-data-[orientation=horizontal]/timeline:-top-6",
        "group-data-[orientation=horizontal]/timeline:h-0.5",
        "group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.25rem)]",
        "group-data-[orientation=horizontal]/timeline:translate-x-4.5",
        "group-data-[orientation=horizontal]/timeline:-translate-y-1/2",

        // ----- Solid variant (default) -----
        "group-data-[variant=solid]/timeline:bg-primary/10",

        // ----- Dotted variant — vertical: left border, dashed -----
        "group-data-[variant=dotted]/timeline:group-data-[orientation=vertical]/timeline:bg-transparent",
        "group-data-[variant=dotted]/timeline:group-data-[orientation=vertical]/timeline:w-0",
        "group-data-[variant=dotted]/timeline:group-data-[orientation=vertical]/timeline:border-l-2",
        "group-data-[variant=dotted]/timeline:group-data-[orientation=vertical]/timeline:border-dashed",
        "group-data-[variant=dotted]/timeline:group-data-[orientation=vertical]/timeline:border-primary/20",

        // ----- Dotted variant — horizontal: top border, dashed -----
        "group-data-[variant=dotted]/timeline:group-data-[orientation=horizontal]/timeline:bg-transparent",
        "group-data-[variant=dotted]/timeline:group-data-[orientation=horizontal]/timeline:h-0",
        "group-data-[variant=dotted]/timeline:group-data-[orientation=horizontal]/timeline:border-t-2",
        "group-data-[variant=dotted]/timeline:group-data-[orientation=horizontal]/timeline:border-dashed",
        "group-data-[variant=dotted]/timeline:group-data-[orientation=horizontal]/timeline:border-primary/20",

        className
      )}
      data-slot="timeline-separator"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// TimelineTitle
// ---------------------------------------------------------------------------

/** Primary heading for a {@link TimelineItem}, rendered as an `<h3>`. */
function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-medium text-sm group-data-[size=sm]/timeline:text-xs",
        className
      )}
      data-slot="timeline-title"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export type {
  TimelineContextValue,
  TimelineIndicatorProps,
  TimelineIntent,
  TimelineItemProps,
  TimelineProps,
};
export {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
};
