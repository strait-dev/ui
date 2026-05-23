"use client";

/**
 * Re-exports Base UI's direction utilities for setting and reading the
 * text directionality (`"ltr"` | `"rtl"`) of the component tree.
 *
 * `DirectionProvider` — wrap your app (or a subtree) with this provider and
 * pass a `direction` prop to propagate LTR/RTL context to all Base UI
 * primitives beneath it. Required for RTL language support.
 *
 * `useDirection` — hook that returns the current `"ltr"` or `"rtl"` value
 * from the nearest `DirectionProvider`, defaulting to `"ltr"` when no
 * provider is present.
 *
 * @example
 * ```tsx
 * <DirectionProvider direction="rtl">
 *   <App />
 * </DirectionProvider>
 *
 * // Inside a component:
 * const dir = useDirection(); // "rtl"
 * ```
 */
export {
  DirectionProvider,
  useDirection,
} from "@base-ui/react/direction-provider";
