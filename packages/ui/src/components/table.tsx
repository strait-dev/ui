"use client";

import type * as React from "react";

import { cn } from "../utils/index";

/**
 * Responsive data table with a horizontally scrollable container.
 *
 * `Table` wraps a native `<table>` in an `overflow-x-auto` div so wide
 * tables scroll rather than breaking layout. Compose it with the sub-parts
 * exported from this file: {@link TableHeader}, {@link TableBody},
 * {@link TableFooter}, {@link TableRow}, {@link TableHead},
 * {@link TableCell}, and {@link TableCaption}.
 *
 * @remarks
 * - The outer scroll container is given `data-slot="table-container"`;
 *   target it in CSS to adjust overflow behaviour.
 * - {@link TableRow} highlights on hover and applies a selected style
 *   when `data-state="selected"` is set — useful with headless selection
 *   libraries.
 * - Cells with a checkbox (`[role=checkbox]`) automatically shed their
 *   right padding via a `:has` selector.
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Status</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Acme Corp</TableCell>
 *       <TableCell>Active</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    // Outer div provides horizontal scroll without clipping sticky columns
    <div
      className="relative w-full overflow-x-auto"
      data-slot="table-container"
    >
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

/** `<thead>` wrapper that applies a bottom border to every row inside a
 * {@link Table}. */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
      {...props}
    />
  );
}

/** `<tbody>` wrapper that removes the border from the final row inside a
 * {@link Table}. */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      {...props}
    />
  );
}

/** `<tfoot>` wrapper rendered as a muted summary bar at the bottom of a
 * {@link Table}. */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      data-slot="table-footer"
      {...props}
    />
  );
}

/**
 * `<tr>` with hover highlight and selection state support inside a
 * {@link Table}. Set `data-state="selected"` to apply the selected
 * background.
 */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

/** Column header cell (`<th>`) with consistent height and typography for a
 * {@link Table}. */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-7 whitespace-nowrap px-2 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

/** Data cell (`<td>`) with consistent height and padding for a
 * {@link Table}. */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "h-7 whitespace-nowrap px-2 align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

/** Muted `<caption>` rendered below a {@link Table} via `caption-bottom`. */
function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn("mt-4 text-muted-foreground text-sm", className)}
      data-slot="table-caption"
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
