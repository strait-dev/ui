import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

import { cn } from "../utils/index";
import { Checkbox } from "./checkbox";

/**
 * Class-variance-authority recipe for {@link CardCheckboxItem}.
 *
 * Exposes three axes:
 * - `variant` — `"default"` stretches the card to full width;
 *   `"compact"` sizes it to its content.
 * - `layout` — `"default"` centers the checkbox with the label row;
 *   `"start"` top-aligns the checkbox for multi-line descriptions.
 * - `disabled` — applies `cursor-not-allowed` when the item is
 *   non-interactive.
 */
const cardCheckboxVariants = cva(
  "relative flex w-full items-start gap-2 rounded-md border border-input p-4 shadow-black/5 shadow-sm has-[[data-state=checked]]:border-ring",
  {
    variants: {
      variant: {
        default: "w-full",
        compact: "w-auto",
      },
      layout: {
        default: "items-center",
        start: "items-start",
      },
      disabled: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      layout: "default",
      disabled: false,
    },
  }
);

/**
 * Grid wrapper that spaces a collection of {@link CardCheckboxItem}
 * components with a consistent gap.
 */
const CardCheckboxGroup: React.FC<React.ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn("grid gap-2", className)}
    data-slot="card-checkbox-group"
    {...props}
  />
);
CardCheckboxGroup.displayName = "CardCheckboxGroup";

/** Props for {@link CardCheckboxItem}. */
type CardCheckboxItemProps = React.ComponentPropsWithoutRef<typeof Checkbox> &
  VariantProps<typeof cardCheckboxVariants> & {
    icon?: React.ReactNode;
    label: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
  };

/**
 * A bordered card that presents a checkbox alongside an optional icon,
 * a label, and a supporting description in a single selectable tile.
 *
 * @remarks
 * Composes the {@link Checkbox} primitive inside a styled `<div>`. An
 * `::after` pseudo-element stretched over the entire card (`after:inset-0`)
 * enlarges the click target so the whole tile is interactive without
 * wrapping everything in a `<label>`.
 *
 * When `id` is provided the checkbox is linked to the label and
 * description via `aria-labelledby` / `aria-describedby`, ensuring
 * screen readers announce both when focusing the control.
 *
 * The border highlights to `ring` colour when the underlying checkbox
 * state changes to `checked` via the
 * `has-[[data-state=checked]]:border-ring` selector.
 *
 * Use inside {@link CardCheckboxGroup} for a consistently spaced list.
 *
 * @example
 * ```tsx
 * <CardCheckboxGroup>
 *   <CardCheckboxItem
 *     id="newsletter"
 *     label="Newsletter"
 *     description="Receive weekly updates."
 *     icon={<MailIcon />}
 *     layout="start"
 *   />
 * </CardCheckboxGroup>
 * ```
 */
const CardCheckboxItem: React.FC<CardCheckboxItemProps> = ({
  className,
  variant,
  layout,
  icon,
  label,
  description,
  id,
  disabled,
  ...props
}) => (
  <div
    className={cn(
      cardCheckboxVariants({ variant, layout, disabled, className })
    )}
    data-slot="card-checkbox-item"
  >
    <Checkbox
      aria-describedby={description ? `${id}-description` : undefined}
      aria-labelledby={id ? `${id}-label` : undefined}
      className="after:absolute after:inset-0"
      disabled={disabled}
      id={id}
      {...props}
    />
    <div className="flex grow items-start gap-3">
      {icon ? (
        <div
          className={cn("shrink-0", disabled ? "text-muted-foreground" : null)}
        >
          {icon}
        </div>
      ) : null}
      <div className="grid grow gap-2">
        <span
          className={cn(
            "font-medium text-sm leading-none",
            disabled ? "text-muted-foreground" : null
          )}
          id={id ? `${id}-label` : undefined}
        >
          {label}
        </span>
        {description ? (
          <p
            className={cn(
              "text-sm",
              disabled ? "text-muted-foreground/75" : "text-muted-foreground"
            )}
            id={id ? `${id}-description` : undefined}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  </div>
);
CardCheckboxItem.displayName = "CardCheckboxItem";

export { CardCheckboxGroup, CardCheckboxItem, type CardCheckboxItemProps };
