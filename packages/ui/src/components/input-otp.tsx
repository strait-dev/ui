"use client";

import { MinusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { OTPInput, OTPInputContext } from "input-otp";
import * as React from "react";
import { cn } from "../utils/index";

/**
 * CVA recipe that drives the height (and matching width) of each
 * {@link InputOTPSlot}. Mirrors the height values from `inputVariants` in
 * `input.tsx` so OTP slots stay in rhythm with other form fields.
 *
 * @example
 * ```ts
 * otpSlotVariants({ size: "lg" }) // → "size-9"
 * ```
 */
const otpSlotVariants = cva("", {
  variants: {
    size: {
      sm: "size-7",
      default: "size-8",
      lg: "size-9",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/** Props for {@link InputOTP}. */
export type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  /** Extra classes merged onto the `OTPInput` container `<div>`. */
  containerClassName?: string;
};

/**
 * One-time-password input that renders a fixed-length sequence of digit
 * slots driven by the `input-otp` library.
 *
 * @remarks
 * Wraps the `OTPInput` primitive from `input-otp`. Compose it with
 * {@link InputOTPGroup}, {@link InputOTPSlot}, and {@link InputOTPSeparator}
 * to build the visible slot layout; the invisible `<OTPInput>` element
 * still owns focus and keyboard input while each slot reads its character
 * from `OTPInputContext`.
 *
 * - `maxLength` (required by the primitive) controls how many characters the
 *   hidden input accepts; match it to the total number of
 *   {@link InputOTPSlot}s rendered.
 * - `spellCheck` is forced `false` to avoid browser autocorrect overlays on
 *   numeric codes.
 * - Slots reflect `aria-invalid` from an enclosing form library automatically
 *   via the group's `has-aria-invalid` selector.
 *
 * @example
 * ```tsx
 * <InputOTP maxLength={6} value={otp} onChange={setOtp}>
 *   <InputOTPGroup>
 *     <InputOTPSlot index={0} />
 *     <InputOTPSlot index={1} />
 *     <InputOTPSlot index={2} />
 *   </InputOTPGroup>
 *   <InputOTPSeparator />
 *   <InputOTPGroup>
 *     <InputOTPSlot index={3} />
 *     <InputOTPSlot index={4} />
 *     <InputOTPSlot index={5} />
 *   </InputOTPGroup>
 * </InputOTP>
 * ```
 */
function InputOTP({ className, containerClassName, ...props }: InputOTPProps) {
  return (
    <OTPInput
      className={cn("disabled:cursor-not-allowed", className)}
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      data-slot="input-otp"
      spellCheck={false}
      {...props}
    />
  );
}

/**
 * Horizontal group of {@link InputOTPSlot}s with shared border-radius and
 * validation ring; used as a direct child of {@link InputOTP}.
 */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      data-slot="input-otp-group"
      {...props}
    />
  );
}

/**
 * A single character cell inside an {@link InputOTPGroup}.
 *
 * @remarks
 * Reads its display character and active state from `OTPInputContext` using
 * the `index` prop. When the slot is active but has no character yet, a
 * blinking fake caret is rendered to match native `<input>` behaviour.
 *
 * Use the `size` prop (`"sm"` | `"default"` | `"lg"`) to match the height
 * of other form fields in the layout. The default (`"default"`) is identical
 * to the previous `size-8` appearance.
 */
function InputOTPSlot({
  index,
  className,
  size,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof otpSlotVariants> & {
    index: number;
  }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  // Each slot reads only the slice of context it owns.
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      className={cn(
        "relative flex items-center justify-center border-input border-y border-r text-sm outline-none transition-colors first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        otpSlotVariants({ size }),
        className
      )}
      data-active={isActive}
      data-slot="input-otp-slot"
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

/**
 * Decorative dash rendered between {@link InputOTPGroup}s inside an
 * {@link InputOTP}; hidden from assistive technology via `aria-hidden`.
 */
function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    // A purely visual divider between OTP digit groups; the icon conveys no
    // information to assistive tech, so it is hidden rather than given a role.
    <div
      aria-hidden="true"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      data-slot="input-otp-separator"
      {...props}
    >
      <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
