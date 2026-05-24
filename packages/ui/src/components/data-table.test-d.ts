import type { ColumnDef } from "@tanstack/react-table";
import { expectTypeOf } from "expect-type";

import type { DataTableProps } from "./data-table";

/**
 * Type-level contract tests for the generic {@link DataTableProps}.
 *
 * Checked by `tsgo`; excluded from the Vitest runtime suite (`*.test.{ts,tsx}`).
 */

type Row = { id: string; name: string };

// `data` is an array of the `TData` row generic.
expectTypeOf<DataTableProps<Row, unknown>["data"]>().toEqualTypeOf<Row[]>();

// `columns` is TanStack `ColumnDef[]`, parameterised by both generics.
expectTypeOf<DataTableProps<Row, string>["columns"]>().toEqualTypeOf<
  ColumnDef<Row, string>[]
>();

// The `TData` generic is genuinely threaded through to `data`.
expectTypeOf<DataTableProps<Row, unknown>["data"]>().not.toEqualTypeOf<
  { other: number }[]
>();
