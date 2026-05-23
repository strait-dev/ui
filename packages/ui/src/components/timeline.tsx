"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type * as React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "../utils/index";

/** Internal context shared between {@link Timeline} and its descendants. */
type TimelineContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
};

// Context
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

// Components
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
 *
 * @example
 * ```tsx
 * <Timeline value={2}>
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
      value={{ activeStep: currentStep, setActiveStep }}
    >
      <div
        className={cn(
          "group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className
        )}
        data-orientation={orientation}
        data-slot="timeline"
        {...props}
      />
    </TimelineContext.Provider>
  );
}

/** Descriptive body text for a {@link TimelineItem}. */
function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
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
          "mb-1 block font-medium text-muted-foreground text-sm group-data-[orientation=vertical]/timeline:max-sm:h-4",
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
 * {@link TimelineItem}. Marked `aria-hidden`; any icon children are
 * purely decorative. Filled border color switches when the parent item
 * carries `data-completed`.
 */
type TimelineIndicatorProps = React.ComponentProps<"div">;

function TimelineIndicator({
  className,
  children,
  ...props
}: TimelineIndicatorProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute size-5 rounded-md border-2 border-primary/20 group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-completed/timeline-item:border-primary",
        className
      )}
      data-slot="timeline-indicator"
      {...props}
    >
      {children}
    </div>
  );
}

// TimelineItem
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
 * connector line primary-colored once the *next* step is reached.
 */
function TimelineItem({ step, className, ...props }: TimelineItemProps) {
  const { activeStep } = useTimeline();

  return (
    <div
      className={cn(
        "group/timeline-item relative flex flex-1 flex-col gap-0.5 group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8 group-data-[orientation=vertical]/timeline:not-last:pb-12 has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-primary",
        className
      )}
      data-completed={step <= activeStep || undefined}
      data-slot="timeline-item"
      {...props}
    />
  );
}

/**
 * Connector line drawn between consecutive {@link TimelineItem} steps.
 * Hidden on the last item via `group-last`. Marked `aria-hidden`.
 */
function TimelineSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute self-start bg-primary/10 group-last/timeline-item:hidden group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)] group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=horizontal]/timeline:translate-x-4.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:translate-y-4.5",
        className
      )}
      data-slot="timeline-separator"
      {...props}
    />
  );
}

/** Primary heading for a {@link TimelineItem}, rendered as an `<h3>`. */
function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-medium text-sm", className)}
      data-slot="timeline-title"
      {...props}
    />
  );
}

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
