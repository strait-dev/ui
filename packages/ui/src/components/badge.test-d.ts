import { expectTypeOf } from "expect-type";

import type { BadgeProps } from "./badge";

/**
 * Type-level contract tests for {@link BadgeProps}.
 *
 * Checked by `tsgo`; excluded from the Vitest runtime suite (`*.test.{ts,tsx}`).
 */

// --- cva `variant` union (solid / light / outline weights) -----------------
expectTypeOf<"success-light">().toExtend<NonNullable<BadgeProps["variant"]>>();
expectTypeOf<"destructive-outline">().toExtend<
  NonNullable<BadgeProps["variant"]>
>();
expectTypeOf<"secondary-outline">().toExtend<
  NonNullable<BadgeProps["variant"]>
>();
expectTypeOf<"default">().toExtend<NonNullable<BadgeProps["variant"]>>();
expectTypeOf<"made-up-variant">().not.toExtend<
  NonNullable<BadgeProps["variant"]>
>();

// --- cva `size` union ------------------------------------------------------
expectTypeOf<"xs">().toExtend<NonNullable<BadgeProps["size"]>>();
expectTypeOf<"xl">().toExtend<NonNullable<BadgeProps["size"]>>();
expectTypeOf<"not-a-size">().not.toExtend<NonNullable<BadgeProps["size"]>>();

// --- cva `radius` union ----------------------------------------------------
expectTypeOf<"pill">().toExtend<NonNullable<BadgeProps["radius"]>>();
expectTypeOf<"md">().toExtend<NonNullable<BadgeProps["radius"]>>();
expectTypeOf<"sm">().toExtend<NonNullable<BadgeProps["radius"]>>();
expectTypeOf<"square">().not.toExtend<NonNullable<BadgeProps["radius"]>>();

// --- bespoke props from the interface --------------------------------------
expectTypeOf<BadgeProps>().toHaveProperty("dismissible");
expectTypeOf<BadgeProps>().toHaveProperty("onDismiss");
expectTypeOf<NonNullable<BadgeProps["onDismiss"]>>().toEqualTypeOf<
  () => void
>();

// --- polymorphic `render` prop (useRender.ComponentProps) ------------------
expectTypeOf<BadgeProps>().toHaveProperty("render");
