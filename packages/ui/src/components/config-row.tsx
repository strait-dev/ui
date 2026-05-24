import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type * as React from "react";

import { cn } from "../utils/index";

/**
 * Props for {@link ConfigRow}.
 */
type ConfigRowProps = {
  /** Optional leading icon rendered at size 14 in `text-muted-foreground`. */
  icon?: IconSvgElement;
  /** Muted label displayed on the left side of the row. */
  label: React.ReactNode;
  /**
   * The value shown on the right side, rendered in `font-mono text-xs` by
   * default. Ignored when `children` is provided.
   */
  value?: React.ReactNode;
  /** Optional second muted line rendered below `label` in a smaller size. */
  description?: React.ReactNode;
  /**
   * Optional trailing action node (e.g. a {@link CopyButton} or {@link Button})
   * pinned to the far right of the row.
   */
  action?: React.ReactNode;
  /** Additional classes merged onto the root `div` element. */
  className?: string;
  /**
   * When provided, used as the value content in place of the `value` prop.
   * Rendered identically — wrapped in a `font-mono text-xs` span.
   */
  children?: React.ReactNode;
};

/**
 * A single label/value row for settings panels, detail drawers, and info
 * grids.
 *
 * Lays out a left side (optional icon + label + optional description) and a
 * right side (value + optional action) in a `flex items-center
 * justify-between` row. The value is wrapped in `font-mono text-xs` by default
 * so identifiers, hashes, and config strings look sharp without extra markup.
 * Pass a pre-styled node as `value` or `children` to override that wrapper.
 *
 * @remarks
 * `children` takes precedence over `value` when both are provided, matching
 * the React convention of preferring explicit children.
 *
 * Pair with {@link Card} and `divide-y` to build bordered setting lists:
 *
 * @example
 * ```tsx
 * // Minimal — just a label and a scalar value
 * <ConfigRow label="Region" value="us-east-1" />
 *
 * // With icon and copyable action
 * <ConfigRow
 *   icon={Key01Icon}
 *   label="API Key"
 *   value="sk-••••••••••••4f9a"
 *   action={<CopyButton text="sk-live-..." aria-label="Copy API key" />}
 * />
 *
 * // With description
 * <ConfigRow
 *   label="Retention"
 *   description="How long raw events are stored"
 *   value="90 days"
 * />
 *
 * // Composed inside a Card
 * <Card>
 *   <CardContent className="divide-y px-0">
 *     <ConfigRow label="Plan" value="Pro" className="px-4 py-2" />
 *     <ConfigRow label="Region" value="us-east-1" className="px-4 py-2" />
 *   </CardContent>
 * </Card>
 * ```
 */
function ConfigRow({
  icon,
  label,
  value,
  description,
  action,
  className,
  children,
}: ConfigRowProps) {
  const valueContent = children ?? value;

  const iconNode = icon ? (
    <HugeiconsIcon
      className="shrink-0 text-muted-foreground"
      icon={icon}
      size={14}
    />
  ) : null;

  const descriptionNode = description ? (
    <span className="text-muted-foreground text-xs">{description}</span>
  ) : null;

  const valueNode =
    valueContent !== undefined && valueContent !== null ? (
      <span className="font-mono text-xs">{valueContent}</span>
    ) : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 text-sm",
        className
      )}
      data-slot="config-row"
    >
      {/* Left side: icon + label column */}
      <div className="flex min-w-0 shrink items-center gap-2">
        {iconNode}
        <div className="flex min-w-0 flex-col">
          <span className="text-muted-foreground">{label}</span>
          {descriptionNode}
        </div>
      </div>

      {/* Right side: value + optional action */}
      <div className="flex shrink-0 items-center gap-1">
        {valueNode}
        {action}
      </div>
    </div>
  );
}

export { ConfigRow, type ConfigRowProps };
