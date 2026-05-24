"use client";

import {
  Cancel01Icon,
  Tick02Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import { cn } from "../utils/index";
import { Input } from "./input";
import { Label } from "./label";

// Total number of password requirements; used to compute strength percentage.
const MAX_STRENGTH = 4;
// Multiplier converting a 0-1 fraction to a CSS percentage integer.
const PERCENTAGE_TO_WIDTH = 100;

/**
 * Props for {@link InputPasswordWithStrengthIndicator}.
 *
 * @remarks
 * `type` is omitted — the component manages `"password"` / `"text"` itself.
 * `showStrengthIndicator` defaults to `true`; set it to `false` to render
 * the field as a plain show/hide password input without the strength UI.
 */
export type InputPasswordWithStrengthIndicatorProps = Omit<
  React.ComponentProps<"input">,
  "type"
> & {
  label?: string;
  error?: boolean;
  showStrengthIndicator?: boolean;
};

/**
 * Ordered list of regex rules that constitute a strong password.
 * Each entry contributes 1 point to the strength score (max {@link MAX_STRENGTH}).
 */
const requirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
] as const;

/**
 * Maps a 0-4 strength score to a Tailwind background color token.
 * 0 → border (empty), 1 → destructive (weak), 2 → warning/80,
 * 3 → warning (medium), 4 → success (strong).
 */
const getStrengthColor = (score: number) => {
  const SCORE_THRESHOLDS = {
    WEAK: 1,
    MEDIUM: 2,
    STRONG: 3,
  };

  if (score === 0) {
    return "bg-border";
  }
  if (score <= SCORE_THRESHOLDS.WEAK) {
    return "bg-destructive";
  }
  if (score <= SCORE_THRESHOLDS.MEDIUM) {
    return "bg-warning/80";
  }
  if (score === SCORE_THRESHOLDS.STRONG) {
    return "bg-warning";
  }
  return "bg-success";
};

/**
 * Maps a 0-4 strength score to a human-readable label displayed above the
 * requirements checklist.
 */
const getStrengthText = (score: number) => {
  const SCORE_THRESHOLDS = {
    WEAK: 1,
    MEDIUM: 2,
    STRONG: 3,
  };

  if (score === 0) {
    return "Type your password";
  }
  if (score <= SCORE_THRESHOLDS.WEAK) {
    return "Weak password";
  }
  if (score === SCORE_THRESHOLDS.MEDIUM) {
    return "Medium password";
  }
  return "Strong password";
};

/**
 * A password field that reveals a live strength meter and per-requirement
 * checklist after the user first focuses the input.
 *
 * @remarks
 * Composes the `Input` and `Label` primitives with:
 * - A show/hide toggle button (same pattern as {@link PasswordInput}).
 * - An animated progress bar whose width and color are driven by a 0-4
 *   strength score computed from {@link requirements}.
 * - A checklist (`<ul>`) listing each requirement with a tick/cross icon.
 *
 * Strength scoring: each regex in {@link requirements} that the current
 * password satisfies adds 1 point. Color and text labels are derived by
 * {@link getStrengthColor} and {@link getStrengthText}.
 *
 * The strength UI is only shown once `showStrengthIndicator` is `true`,
 * the field has been focused (`isTouched`), and the field is non-empty —
 * avoiding premature feedback on untouched forms.
 *
 * `aria-invalid` is set on the input whenever the password exists but does
 * not meet all requirements, or when `error` is forced externally. The
 * progress bar is exposed as `role="progressbar"` with `aria-valuenow`.
 *
 * An external form reset (`value=""`) clears internal state including the
 * touched flag, resetting the UI back to its pre-interaction state.
 *
 * @example
 * ```tsx
 * <InputPasswordWithStrengthIndicator
 *   id="new-password"
 *   label="New password"
 *   placeholder="Create a password"
 * />
 * ```
 */
function InputPasswordWithStrengthIndicator({
  className,
  label,
  error,
  showStrengthIndicator = true,
  onChange,
  placeholder,
  value,
  id,
  ...props
}: InputPasswordWithStrengthIndicatorProps) {
  const passwordStrengthId = useId();
  const [password, setPassword] = useState<string>((value as string) || "");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  // Watch for changes in the value prop to sync with internal state
  // Only update if the value is explicitly set to empty string (form reset)
  useEffect(() => {
    if (value === "") {
      setPassword("");
      setIsTouched(false);
    }
  }, [value]);

  const toggleVisibility = useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, []);

  const strength = useMemo(
    () =>
      requirements.map((req) => ({
        met: req.regex.test(password),
        text: req.text,
      })),
    [password]
  );

  const strengthScore = useMemo(
    () => strength.filter((req) => req.met).length,
    [strength]
  );

  const strengthColor = useMemo(
    () => getStrengthColor(strengthScore),
    [strengthScore]
  );

  const strengthText = useMemo(
    () => getStrengthText(strengthScore),
    [strengthScore]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      onChange?.(e);
    },
    [onChange]
  );

  const { onFocus } = props;

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setIsTouched(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const inputProps = useMemo(
    () => ({
      id,
      type: isVisible ? "text" : "password",
      value: password,
      onChange: handleChange,
      placeholder,
      onFocus: handleFocus,
      className: cn("pe-9", error && "border-destructive", className),
      "aria-invalid": (() => {
        if (error) {
          return true;
        }
        if (isTouched && password) {
          return strengthScore < MAX_STRENGTH;
        }
        return false;
      })(),
      "aria-describedby": passwordStrengthId,
    }),
    [
      id,
      isVisible,
      password,
      handleChange,
      handleFocus,
      error,
      className,
      strengthScore,
      placeholder,
      isTouched,
      passwordStrengthId,
    ]
  );

  const buttonProps = useMemo(
    () => ({
      className:
        "absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 transition-colors hover:text-foreground focus:z-10 focus-visible:text-foreground focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      type: "button" as const,
      onClick: toggleVisibility,
      "aria-label": isVisible ? "Hide password" : "Show password",
      "aria-pressed": isVisible,
      "aria-controls": id,
    }),
    [id, isVisible, toggleVisibility]
  );

  const shouldShowIndicator = showStrengthIndicator && isTouched && password;

  return (
    <div
      className="flex flex-col gap-2"
      data-slot="input-password-with-strength-indicator"
    >
      {label ? (
        <Label
          className="font-medium text-foreground text-sm"
          data-slot="label"
          htmlFor={id}
        >
          {label}
        </Label>
      ) : null}
      <div className="relative" data-slot="input-container">
        <Input data-slot="input" {...inputProps} />
        <button data-slot="visibility-toggle" {...buttonProps}>
          {isVisible ? (
            <HugeiconsIcon
              aria-hidden="true"
              className="size-4"
              icon={ViewOffIcon}
            />
          ) : (
            <HugeiconsIcon
              aria-hidden="true"
              className="size-4"
              icon={ViewIcon}
            />
          )}
        </button>
      </div>

      {shouldShowIndicator ? (
        <div
          className="overflow-hidden transition-all duration-200 ease-in-out"
          data-slot="strength-indicator"
        >
          <div
            aria-label="Password strength"
            aria-valuemax={4}
            aria-valuemin={0}
            aria-valuenow={strengthScore}
            className="fade-in slide-in-from-top-1 mt-3 mb-4 h-1 w-full animate-in overflow-hidden rounded-md bg-border"
            data-slot="strength-progress"
            role="progressbar"
          >
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out",
                strengthColor
              )}
              data-slot="strength-progress-bar"
              style={{
                width: `${(strengthScore / MAX_STRENGTH) * PERCENTAGE_TO_WIDTH}%`,
              }}
            />
          </div>

          <div
            className="fade-in slide-in-from-top-2 animate-in"
            data-slot="strength-requirements"
          >
            <p
              className="mb-2 font-medium text-foreground text-sm"
              data-slot="strength-text"
              id={passwordStrengthId}
            >
              {strengthText}. Must contain:
            </p>

            <ul
              aria-label="Password requirements"
              className="flex flex-col gap-1.5"
              data-slot="strength-requirements-list"
            >
              {strength.map((req) => (
                <li
                  className="flex items-center gap-2.5"
                  data-slot="strength-requirement"
                  key={req.text}
                >
                  {req.met ? (
                    <HugeiconsIcon
                      aria-hidden="true"
                      className="size-4 text-success-accent"
                      icon={Tick02Icon}
                    />
                  ) : (
                    <HugeiconsIcon
                      aria-hidden="true"
                      className="size-4 text-muted-foreground/80"
                      icon={Cancel01Icon}
                    />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      req.met ? "text-success-accent" : "text-muted-foreground"
                    )}
                    data-slot="strength-requirement-text"
                  >
                    {req.text}
                    <span className="sr-only">
                      {req.met
                        ? " - Requirement met"
                        : " - Requirement not met"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { InputPasswordWithStrengthIndicator };
