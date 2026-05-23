"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useMemo } from "react";
import { cn } from "../utils/index";
import { Label } from "./label";
import { Separator } from "./separator";

/**
 * Semantic wrapper that groups related form fields under a common heading.
 *
 * Renders a `<fieldset>` and adjusts its gap automatically when it contains
 * a {@link CheckboxGroup} or a {@link RadioGroup} child.
 *
 * @remarks
 * Place a {@link FieldLegend} as the first child to provide an accessible
 * caption. Nest {@link Field} or {@link FieldGroup} elements inside.
 *
 * @example
 * ```tsx
 * <FieldSet>
 *   <FieldLegend>Notifications</FieldLegend>
 *   <Field><FieldLabel>Email</FieldLabel><Input /></Field>
 * </FieldSet>
 * ```
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      className={cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      data-slot="field-set"
      {...props}
    />
  );
}

/**
 * Accessible caption for a {@link FieldSet}.
 *
 * The `variant` prop switches between `"legend"` (larger, section-heading
 * weight) and `"label"` (matches {@link Label} size) to suit different
 * visual contexts.
 */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      className={cn(
        "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
        className
      )}
      data-slot="field-legend"
      data-variant={variant}
      {...props}
    />
  );
}

/**
 * Container that stacks multiple {@link Field} elements with consistent gaps.
 *
 * Uses a `@container` query (`@container/field-group`) so child
 * {@link Field} items with `orientation="responsive"` can reflow from
 * vertical to horizontal at the `@md` breakpoint.
 */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
        className
      )}
      data-slot="field-group"
      {...props}
    />
  );
}

/**
 * Class-variance-authority recipe for the {@link Field} layout.
 *
 * Exposes one axis:
 * - `orientation` — controls how the label and control are arranged:
 *   - `"vertical"` (default) — label stacked above the control.
 *   - `"horizontal"` — label and control side-by-side, aligning to the
 *     top when a {@link FieldContent} description is present.
 *   - `"responsive"` — vertical below the `@md` container breakpoint,
 *     horizontal above it (requires a {@link FieldGroup} ancestor).
 */
const fieldVariants = cva(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "@md/field-group:flex-row flex-col @md/field-group:items-center *:w-full @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

/**
 * Single form field: associates a label, control, description, and error.
 *
 * Compose it with {@link FieldLabel} (or {@link FieldTitle}),
 * {@link FieldContent} (wrapping {@link FieldDescription}), and
 * {@link FieldError}. Uses a `role="group"` on a `<div>` — see the inline
 * note below for why `<fieldset>` is intentionally avoided here.
 *
 * @remarks
 * - The `orientation` prop switches the label/control layout axis via
 *   {@link fieldVariants}.
 * - When `data-invalid="true"` is set on the root, all text inside turns
 *   destructive (used by react-hook-form integrations).
 *
 * @example
 * ```tsx
 * <Field orientation="horizontal">
 *   <FieldLabel htmlFor="email">Email</FieldLabel>
 *   <Input id="email" type="email" />
 * </Field>
 * ```
 */
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a field groups a label/control/description; role="group" on a div is the intended pattern (<fieldset> would impose unwanted layout/legend semantics).
    <div
      className={cn(fieldVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot="field"
      role="group"
      {...props}
    />
  );
}

/**
 * Wrapper that stacks a {@link FieldDescription} (and optionally a
 * {@link FieldError}) beneath a control with consistent tight spacing.
 *
 * Use inside a {@link Field} when a description should sit directly below
 * the control rather than below the label.
 */
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className
      )}
      data-slot="field-content"
      {...props}
    />
  );
}

/**
 * Label variant for a {@link Field} that also supports nesting a control
 * (e.g. a {@link Checkbox}) inside the label itself for a "card-select" style.
 *
 * When a `data-slot="field"` child is detected, the label expands to full
 * width and adds a bordered, tinted checked state.
 */
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-data-checked:border-primary/30 has-data-checked:bg-primary/5 *:data-[slot=field]:p-2.5 group-data-[disabled=true]/field:opacity-50 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      data-slot="field-label"
      {...props}
    />
  );
}

/**
 * Non-interactive title text for a {@link Field} when a full {@link Label}
 * `htmlFor` association is not needed (e.g. fields with an inline control
 * that provides its own accessible name).
 */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex w-fit items-center gap-2 font-medium text-sm leading-snug group-data-[disabled=true]/field:opacity-50",
        className
      )}
      data-slot="field-label"
      {...props}
    />
  );
}

/**
 * Muted helper text that describes a {@link Field}'s control.
 *
 * Adjusts top-margin automatically when it is the last or second-to-last
 * sibling, and text-balances in horizontal {@link Field} layouts. Inline
 * links are underlined and turn primary on hover.
 */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-left font-normal text-muted-foreground text-sm leading-normal group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "nth-last-2:-mt-1 last:mt-0",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      data-slot="field-description"
      {...props}
    />
  );
}

/**
 * Visual divider between two groups of fields inside a {@link FieldGroup}.
 *
 * Renders a full-width {@link Separator} line. Pass `children` for a
 * centered label (e.g. `"or"`) that floats above the line on a background
 * swatch; presence of children is tracked via `data-content` for CSS.
 */
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      // data-content drives CSS rules that show/hide the label swatch
      data-content={!!children}
      data-slot="field-separator"
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

/**
 * Validation error display for a {@link Field}.
 *
 * Accepts either explicit `children` or an `errors` array (e.g. from
 * react-hook-form's `fieldState.errors`). When multiple distinct messages
 * exist they are rendered as a bulleted list; duplicates are deduplicated
 * by message text. Renders nothing when there is no content.
 *
 * @remarks
 * The `errors` prop accepts `Array<{ message?: string } | undefined>` so
 * it can receive react-hook-form error objects directly without mapping.
 */
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  // Derive display content: prefer explicit children, then deduplicate errors.
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    // Deduplicate by message text so repeated validations don't stack.
    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error) =>
            error?.message && <li key={error.message}>{error.message}</li>
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      className={cn("font-normal text-destructive text-sm", className)}
      data-slot="field-error"
      role="alert"
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
