"use client";

import { cn } from "../utils/index";
import { Button } from "./button";
import { Input } from "./input";

/**
 * Props for {@link InputWithInlineButton}.
 *
 * @remarks
 * Two rendering modes are available:
 * - **Text button** (default): set `buttonText` and optionally
 *   `onButtonClick`, `buttonType`, and `buttonAriaLabel`.
 * - **Custom element**: pass any React node as `button` and the component
 *   renders it inside a wrapper div instead of the built-in
 *   {@link Button}.
 */
type InputWithInlineButtonProps = React.ComponentProps<"input"> & {
  button?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  buttonClassName?: string;
  buttonAriaLabel?: string;
  wrapperClassName?: string;
  buttonType?: "button" | "submit" | "reset";
};

/**
 * A text input with an attached button fused to its trailing edge, suitable
 * for search bars, coupon fields, and newsletter sign-ups.
 *
 * @remarks
 * Composes the `Input` primitive with either a custom `button` node or the
 * built-in `Button` (outline variant, `buttonType` defaulting to
 * `"submit"`). The input's right border radius is removed and the button's
 * left radius is removed so they read as a single control.
 *
 * Focus rings appear on each element independently; `focus-visible:z-10` on
 * the input ensures the ring renders above the button when the input is
 * focused.
 *
 * @example
 * ```tsx
 * <InputWithInlineButton
 *   placeholder="your@email.com"
 *   buttonText="Subscribe"
 *   buttonType="submit"
 * />
 * ```
 */
function InputWithInlineButton({
  button,
  buttonText,
  onButtonClick,
  buttonClassName,
  buttonAriaLabel,
  wrapperClassName,
  buttonType = "submit",
  className,
  ...props
}: InputWithInlineButtonProps) {
  return (
    <div
      className={cn("flex rounded-md shadow-xs", wrapperClassName)}
      data-slot="input-with-inline-button"
    >
      <Input
        className={cn(
          "-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10",
          className
        )}
        data-slot="input"
        {...props}
      />

      {button ? (
        // Custom button/component approach
        <div
          className={cn("rounded-s-none", buttonClassName)}
          data-slot="button-container"
        >
          {button}
        </div>
      ) : (
        // Text-based button approach
        <Button
          aria-label={buttonAriaLabel || buttonText}
          className={cn("rounded-s-none", buttonClassName)}
          data-slot="button"
          onClick={onButtonClick}
          type={buttonType}
          variant="outline"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}

export type { InputWithInlineButtonProps };
export { InputWithInlineButton };
