"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Loading01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "../utils/index";

// Types
type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

type StepState = "active" | "completed" | "inactive" | "loading";

// Contexts
// Root context shared by Stepper and all descendant sub-components.
const StepperContext = createContext<StepperContextValue | undefined>(
  undefined
);
// Per-step context provided by each StepperItem to its children.
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined
);

/**
 * Returns the nearest {@link Stepper} context.
 *
 * Throws if called outside of a {@link Stepper} tree.
 */
const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

/**
 * Returns the nearest {@link StepperItem} context.
 *
 * Throws if called outside of a {@link StepperItem} tree.
 */
const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem");
  }
  return context;
};

// Components
type StepperProps = React.ComponentProps<"div"> & {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
};

/**
 * A multi-step progress indicator that tracks which step is currently active.
 *
 * Each child should be a {@link StepperItem} with a unique `step` number
 * (zero-based). Separate items with a {@link StepperSeparator} to render the
 * connecting line between them.
 *
 * @remarks
 * - Supports controlled (`value` + `onValueChange`) and uncontrolled
 *   (`defaultValue`) modes; the internal state is updated via
 *   {@link StepperTrigger} or programmatically through `onValueChange`.
 * - `orientation` (`"horizontal"` | `"vertical"`) cascades to every
 *   sub-component via a `data-orientation` attribute and Tailwind group
 *   selectors; set it once on the root.
 * - A step's visual state (`active`, `completed`, `inactive`, `loading`)
 *   is derived automatically inside {@link StepperItem} by comparing the
 *   item's `step` number with `activeStep`.
 *
 * @example
 * ```tsx
 * <Stepper defaultValue={0}>
 *   <StepperItem step={0}>
 *     <StepperTrigger>
 *       <StepperIndicator />
 *       <StepperTitle>Account</StepperTitle>
 *     </StepperTrigger>
 *   </StepperItem>
 *   <StepperSeparator />
 *   <StepperItem step={1}>
 *     <StepperTrigger>
 *       <StepperIndicator />
 *       <StepperTitle>Details</StepperTitle>
 *     </StepperTrigger>
 *   </StepperItem>
 * </Stepper>
 * ```
 */
function Stepper({
  defaultValue = 0,
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  ...props
}: StepperProps) {
  const [activeStep, setInternalStep] = useState(defaultValue);

  const setActiveStep = useCallback(
    (step: number) => {
      // In controlled mode, skip internal state; caller manages it.
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
    <StepperContext.Provider
      value={{
        activeStep: currentStep,
        setActiveStep,
        orientation,
      }}
    >
      <div
        className={cn(
          "group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
          className
        )}
        data-orientation={orientation}
        data-slot="stepper"
        {...props}
      />
    </StepperContext.Provider>
  );
}

// StepperItem
type StepperItemProps = React.ComponentProps<"div"> & {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

/**
 * Container for one step in a {@link Stepper}; derives and broadcasts its
 * visual state to child components via `StepItemContext`.
 *
 * @remarks
 * - State priority: `completed` prop (or `step < activeStep`) → `"completed"`;
 *   `step === activeStep` → `"active"`; otherwise `"inactive"`.
 * - `loading` is only active when `step === activeStep`; a loading step on a
 *   non-active item has no visual effect.
 * - `disabled` is forwarded to {@link StepperTrigger} via context to prevent
 *   navigation to this step.
 */
function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper();

  // Derive state: explicit completed prop or already past this step.
  let state: StepState;
  if (completed || step < activeStep) {
    state = "completed";
  } else if (activeStep === step) {
    state = "active";
  } else {
    state = "inactive";
  }

  // Loading spinner only shows for the currently active step.
  const isLoading = loading && step === activeStep;

  return (
    <StepItemContext.Provider
      value={{ step, state, isDisabled: disabled, isLoading }}
    >
      <div
        className={cn(
          "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
          className
        )}
        data-slot="stepper-item"
        data-state={state}
        {...(isLoading ? { "data-loading": true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}

// StepperTrigger
type StepperTriggerProps = useRender.ComponentProps<"button"> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * The interactive element that navigates to a step when clicked.
 *
 * Reads `step` and `isDisabled` from the nearest {@link StepperItem}
 * context and calls `setActiveStep` from {@link Stepper}. Accepts a
 * `render` prop to swap the element (e.g. to an `<a>` for URL-driven
 * steppers).
 */
function StepperTrigger({
  render,
  className,
  children,
  ...props
}: StepperTriggerProps) {
  const { setActiveStep } = useStepper();
  const { step, isDisabled } = useStepItem();

  return useRender({
    render,
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "inline-flex items-center gap-3 rounded-md text-sm outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
          className
        ),
        disabled: isDisabled,
        onClick: () => setActiveStep(step),
        children,
      },
      props
    ),
    state: {
      slot: "stepper-trigger",
    },
  });
}

// StepperIndicator
type StepperIndicatorProps = React.ComponentProps<"span">;

/**
 * The circular badge that shows the step number, a tick (when completed),
 * or a spinner (when loading) for a {@link StepperItem}.
 *
 * @remarks
 * - If `children` are provided they fully replace the default number/tick/
 *   spinner rendering — useful for custom icons.
 * - The number, tick, and spinner use CSS scale/opacity transitions driven
 *   by `data-state` and `data-loading` on the parent `group/step` element.
 */
function StepperIndicator({
  className,
  children,
  ...props
}: StepperIndicatorProps) {
  const { state, step, isLoading } = useStepItem();

  return (
    <span
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-md bg-muted font-medium text-muted-foreground text-sm data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground",
        className
      )}
      data-slot="stepper-indicator"
      data-state={state}
      {...props}
    >
      {children ?? (
        <>
          {/* Step number — scales out when completed or loading */}
          <span className="transition-all group-data-[state=completed]/step:scale-0 group-data-loading/step:scale-0 group-data-[state=completed]/step:opacity-0 group-data-loading/step:opacity-0 group-data-loading/step:transition-none">
            {step}
          </span>
          {/* Tick icon — scales in when step is completed */}
          <HugeiconsIcon
            aria-hidden="true"
            className="absolute size-5 scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
            icon={Tick02Icon}
          />
          {/* Spinning loader — shown only while isLoading */}
          {isLoading ? (
            <span className="absolute transition-all">
              <HugeiconsIcon
                aria-hidden="true"
                className="size-4 animate-spin"
                icon={Loading01Icon}
              />
            </span>
          ) : null}
        </>
      )}
    </span>
  );
}

// StepperTitle
/** The step name, rendered as an `<h3>`, inside a {@link StepperTrigger}. */
function StepperTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-medium text-sm", className)}
      data-slot="stepper-title"
      {...props}
    />
  );
}

// StepperDescription
/** Muted supporting text for a step, placed below a {@link StepperTitle}. */
function StepperDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="stepper-description"
      {...props}
    />
  );
}

// StepperSeparator
/**
 * The connecting line between two {@link StepperItem}s; becomes primary
 * colour when the preceding step is completed.
 *
 * Its dimensions adapt automatically via `data-orientation` group selectors:
 * horizontal (full-width, 2 px tall) or vertical (fixed 48 px tall, 2 px
 * wide).
 */
function StepperSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "m-0.5 bg-muted group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=vertical]/stepper:w-0.5 group-data-[orientation=horizontal]/stepper:flex-1 group-data-[state=completed]/step:bg-primary",
        className
      )}
      data-slot="stepper-separator"
      {...props}
    />
  );
}

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
};
