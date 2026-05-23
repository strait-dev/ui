import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";

beforeAll(() => {
  // input-otp uses ResizeObserver internally
  if (!("ResizeObserver" in window)) {
    // @ts-expect-error - jsdom lacks ResizeObserver
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  Element.prototype.scrollIntoView ||= () => {};
});

describe("InputOTP", () => {
  it("renders the hidden OTP input with data-slot='input-otp'", () => {
    render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    );
    const otpInput = document.querySelector("[data-slot='input-otp']");
    expect(otpInput).toBeInTheDocument();
  });

  it("renders spellCheck=false on the underlying input", () => {
    render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
    );
    const otpInput = document.querySelector("[data-slot='input-otp']");
    expect(otpInput).toHaveAttribute("spellcheck", "false");
  });
});

describe("InputOTPGroup", () => {
  it("renders with data-slot='input-otp-group'", () => {
    render(<InputOTPGroup data-testid="group" />);
    expect(screen.getByTestId("group")).toHaveAttribute(
      "data-slot",
      "input-otp-group"
    );
  });
});

describe("InputOTPSlot", () => {
  it("renders slot cells with data-slot='input-otp-slot'", () => {
    render(
      <InputOTP maxLength={3}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
      </InputOTP>
    );
    const slots = document.querySelectorAll("[data-slot='input-otp-slot']");
    expect(slots).toHaveLength(3);
  });

  it("size='lg' applies h-9 to the slot", () => {
    render(
      <InputOTP maxLength={1}>
        <InputOTPGroup>
          <InputOTPSlot index={0} size="lg" />
        </InputOTPGroup>
      </InputOTP>
    );
    const slot = document.querySelector("[data-slot='input-otp-slot']");
    expect(slot).toHaveClass("size-9");
  });
});

describe("InputOTPSeparator", () => {
  it("renders with aria-hidden and data-slot='input-otp-separator'", () => {
    render(<InputOTPSeparator />);
    const sep = document.querySelector("[data-slot='input-otp-separator']");
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveAttribute("aria-hidden", "true");
  });
});

describe("InputOTP with separator", () => {
  it("renders groups and separator", () => {
    render(
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    );
    expect(
      document.querySelectorAll("[data-slot='input-otp-slot']")
    ).toHaveLength(6);
    expect(
      document.querySelector("[data-slot='input-otp-separator']")
    ).toBeInTheDocument();
  });
});
