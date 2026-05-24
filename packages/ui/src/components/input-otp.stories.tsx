import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FC } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";
import { Label } from "./label";

// InputOTP's props are a discriminated union (render vs. children), which makes
// the inferred Storybook args collapse to `never`. Describe the controllable
// args explicitly instead.
type InputOTPStoryArgs = {
  maxLength: number;
  disabled?: boolean;
};

const meta: Meta<InputOTPStoryArgs> = {
  title: "Patterns/Input OTP",
  // InputOTP requires `children`/`render`; cast so the render-only stories can
  // describe just the controllable args.
  component: InputOTP as FC<InputOTPStoryArgs>,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A one-time-password (OTP) / PIN input built on `input-otp`.",
          "",
          "Exposes four composable parts: `InputOTP` (root), `InputOTPGroup`",
          "(slot container), `InputOTPSlot` (individual character cell), and",
          "`InputOTPSeparator` (visual dash between groups).",
          "",
          "The root accepts `maxLength` (total character count) and the optional",
          "`onChange` callback. Arrange groups and separators freely to match your",
          "token format (e.g. 6-digit code, 8-char split 4-4).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    maxLength: {
      control: "number",
      description: "Total number of OTP characters.",
    },
    disabled: {
      control: "boolean",
      description: "Disable all OTP slots.",
    },
  },
  args: {
    maxLength: 6,
  },
};

export default meta;

type Story = StoryObj<InputOTPStoryArgs>;

/** Interactive playground — type your code into the slots. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="otp-playground">One-time code</Label>
      <InputOTP {...args} id="otp-playground">
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
    </div>
  ),
};

/** Six-digit code split 3-3 with a separator dash. */
export const SixDigitCode: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="otp-6">Verification code</Label>
      <InputOTP {...args} id="otp-6" maxLength={6}>
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
    </div>
  ),
};

/** Four-digit PIN — a single group, no separator. */
export const FourDigitPin: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="otp-4">PIN</Label>
      <InputOTP {...args} id="otp-4" maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
};

/** Eight-character code split 4-4. */
export const EightCharSplit: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="otp-8">Recovery key</Label>
      <InputOTP {...args} id="otp-8" maxLength={8}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  ),
};

/** Disabled — slots are dimmed and non-interactive. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="otp-disabled">Code (expired)</Label>
      <InputOTP {...args} disabled id="otp-disabled" maxLength={6}>
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
    </div>
  ),
};
