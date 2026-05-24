import { expectTypeOf } from "expect-type";

import type { ButtonProps } from "./button";

/**
 * Type-level contract tests for {@link ButtonProps}.
 *
 * These are checked by `tsgo` (the package `typecheck`) and are intentionally
 * excluded from the Vitest runtime suite, whose glob is `*.test.{ts,tsx}`.
 */

// --- cva `variant` union ---------------------------------------------------
// Intent weights and neutral tones are all valid `variant` values.
expectTypeOf<"brand-solid">().toExtend<NonNullable<ButtonProps["variant"]>>();
expectTypeOf<"destructive-outline">().toExtend<
  NonNullable<ButtonProps["variant"]>
>();
expectTypeOf<"default">().toExtend<NonNullable<ButtonProps["variant"]>>();
expectTypeOf<"ghost">().toExtend<NonNullable<ButtonProps["variant"]>>();
expectTypeOf<"link">().toExtend<NonNullable<ButtonProps["variant"]>>();

// The union is a finite literal set, so an unknown variant is rejected.
expectTypeOf<"made-up-variant">().not.toExtend<
  NonNullable<ButtonProps["variant"]>
>();

// --- cva `size` union (incl. square `icon*` presets) -----------------------
expectTypeOf<"icon">().toExtend<NonNullable<ButtonProps["size"]>>();
expectTypeOf<"icon-xl">().toExtend<NonNullable<ButtonProps["size"]>>();
expectTypeOf<"xs">().toExtend<NonNullable<ButtonProps["size"]>>();
expectTypeOf<"not-a-size">().not.toExtend<NonNullable<ButtonProps["size"]>>();

// --- variant/size are optional (cva `VariantProps`) ------------------------
expectTypeOf<ButtonProps>().toHaveProperty("variant");
expectTypeOf<ButtonProps>().toHaveProperty("size");
expectTypeOf<undefined>().toExtend<ButtonProps["variant"]>();
expectTypeOf<undefined>().toExtend<ButtonProps["size"]>();

// --- polymorphic `render` prop (Base UI) -----------------------------------
// The `render` prop is part of the public surface so callers can swap the
// underlying element (e.g. render the button as an anchor).
expectTypeOf<ButtonProps>().toHaveProperty("render");
