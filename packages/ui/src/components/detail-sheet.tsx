"use client";

import type * as React from "react";
import { cn } from "../utils/index";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./sheet";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Props for {@link DetailSheet}.
 *
 * Extends the controlled Base UI Dialog open/close interface and adds
 * semantic slots for a title, a muted meta subtitle, optional sticky footer
 * actions, and a scrollable body region.
 */
type DetailSheetProps = {
  /** Whether the sheet is currently open. */
  open: boolean;
  /**
   * Callback invoked whenever the sheet requests an open-state change.
   * The first argument is the requested `open` value; forward it to your
   * state setter to keep the sheet controlled.
   */
  onOpenChange: (open: boolean) => void;
  /** Main heading rendered in a {@link SheetTitle}. */
  title: React.ReactNode;
  /**
   * Optional muted subtitle rendered beneath the title (e.g. a record ID or
   * status chip). Mapped to `SheetDescription` so it doubles as the
   * accessible description for screen readers.
   */
  meta?: React.ReactNode;
  /**
   * Optional sticky footer rendered via {@link SheetFooter}. Typically holds
   * a primary action and a cancel/close control.
   */
  footer?: React.ReactNode;
  /**
   * The scrollable body of the sheet. Typically composed of
   * {@link DetailSheetSection} blocks each containing
   * {@link DetailSheetRow} pairs.
   */
  children: React.ReactNode;
  /**
   * Which screen edge the sheet slides in from.
   * Forwarded directly to `SheetContent`'s `side` prop.
   *
   * @default "right"
   */
  side?: "left" | "right" | "top" | "bottom";
  className?: string;
};

/**
 * Props for {@link DetailSheetSection}.
 *
 * A named group of {@link DetailSheetRow} entries inside a
 * {@link DetailSheet} body.
 */
type DetailSheetSectionProps = {
  /**
   * Section heading rendered as an uppercase muted `<h4>`.
   * Keep it short — one or two words.
   */
  heading: React.ReactNode;
  /** The section body; typically one or more {@link DetailSheetRow}s. */
  children: React.ReactNode;
  className?: string;
};

/**
 * Props for {@link DetailSheetRow}.
 *
 * A single label/value pair inside a {@link DetailSheetSection}.
 */
type DetailSheetRowProps = {
  /** Muted descriptor rendered on the left side of the row. */
  label: React.ReactNode;
  /**
   * The value displayed on the right side, wrapped in `font-mono text-xs`
   * styling by default. Pass a pre-styled node to override the wrapper.
   */
  children: React.ReactNode;
  className?: string;
};

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

/**
 * A right-anchored (by default) detail / inspection panel built as a
 * structured recipe over the design-system {@link Sheet}.
 *
 * Provides a consistent header (title + optional muted meta subtitle),
 * a scrollable body region, and an optional sticky footer — all driven by
 * the existing `Sheet` primitive so animation, backdrop, and focus-trap
 * behaviour are inherited automatically.
 *
 * Compose the body with {@link DetailSheetSection} blocks and
 * {@link DetailSheetRow} pairs for a uniform label/value layout:
 *
 * @remarks
 * - `DetailSheet` is fully controlled: manage `open` + `onOpenChange` in the
 *   parent. There is no uncontrolled default-open API on this component.
 * - `side` defaults to `"right"` and is forwarded to `SheetContent`.
 * - The built-in close button (rendered by `SheetContent`) is always present.
 *   Supply an explicit close action in `footer` only when you want a labelled
 *   secondary cancel button.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * <Button onClick={() => setOpen(true)}>View details</Button>
 *
 * <DetailSheet
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Deployment #d-42"
 *   meta="run-id: 0xDEADBEEF"
 *   footer={<Button onClick={() => setOpen(false)}>Close</Button>}
 * >
 *   <DetailSheetSection heading="Summary">
 *     <DetailSheetRow label="Status">deployed</DetailSheetRow>
 *     <DetailSheetRow label="Region">us-east-1</DetailSheetRow>
 *   </DetailSheetSection>
 * </DetailSheet>
 * ```
 */
function DetailSheet({
  open,
  onOpenChange,
  title,
  meta,
  footer,
  children,
  side = "right",
  className,
}: DetailSheetProps) {
  // Base UI Dialog's onOpenChange receives (open, eventDetails). Our public
  // API narrows this to just the boolean so callers can pass a plain setState.
  const handleOpenChange = (
    nextOpen: boolean,
    // biome-ignore lint/suspicious/noExplicitAny: Base UI eventDetails type is internal
    _eventDetails: any
  ) => {
    onOpenChange(nextOpen);
  };

  const footerNode = footer ? <SheetFooter>{footer}</SheetFooter> : null;

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent
        className={cn("flex flex-col", className)}
        data-slot="detail-sheet"
        side={side}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {meta ? (
            <SheetDescription className="text-muted-foreground text-xs">
              {meta}
            </SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-2">
          {children}
        </div>
        {footerNode}
      </SheetContent>
    </Sheet>
  );
}

/**
 * A labelled group of {@link DetailSheetRow} entries inside a
 * {@link DetailSheet} body.
 *
 * Renders a semantic `<section>` with an uppercase muted `<h4>` heading
 * followed by a flex column of rows.
 *
 * @remarks
 * Use one `DetailSheetSection` per logical category — for example
 * "Metadata", "Configuration", "Timing". The heading is styled
 * `text-xs uppercase tracking-wide text-muted-foreground` to create visual
 * hierarchy without competing with the sheet title.
 *
 * @example
 * ```tsx
 * <DetailSheetSection heading="Timing">
 *   <DetailSheetRow label="Created">2024-01-15 09:32 UTC</DetailSheetRow>
 *   <DetailSheetRow label="Updated">2024-01-16 14:07 UTC</DetailSheetRow>
 * </DetailSheetSection>
 * ```
 */
function DetailSheetSection({
  heading,
  children,
  className,
}: DetailSheetSectionProps) {
  return (
    <section
      className={cn("flex flex-col gap-3", className)}
      data-slot="detail-sheet-section"
    >
      <h4 className="text-muted-foreground text-xs uppercase tracking-wide">
        {heading}
      </h4>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

/**
 * A single label/value pair inside a {@link DetailSheetSection}.
 *
 * Lays out a muted label on the left and a monospace value on the right in a
 * `flex items-center justify-between` row. The value is wrapped in
 * `font-mono text-xs` by default — ideal for identifiers, hashes, and
 * configuration strings.
 *
 * @remarks
 * Pass a pre-styled node as `children` to override the monospace wrapper (for
 * example, a {@link Badge} for status values or a {@link CopyButton} group).
 *
 * @example
 * ```tsx
 * // Simple scalar value
 * <DetailSheetRow label="Environment">production</DetailSheetRow>
 *
 * // Pre-styled override
 * <DetailSheetRow label="Status">
 *   <Badge variant="success-light">Deployed</Badge>
 * </DetailSheetRow>
 * ```
 */
function DetailSheetRow({ label, children, className }: DetailSheetRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 text-sm",
        className
      )}
      data-slot="detail-sheet-row"
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-xs">{children}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  DetailSheet,
  type DetailSheetProps,
  DetailSheetRow,
  type DetailSheetRowProps,
  DetailSheetSection,
  type DetailSheetSectionProps,
};
