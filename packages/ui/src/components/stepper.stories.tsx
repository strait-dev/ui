import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "./button";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "./stepper";

const meta: Meta<typeof Stepper> = {
  title: "Navigation/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A multi-step progress indicator that tracks flow through a sequence of steps.",
          "",
          "Built with Base UI's `useRender` for the trigger. Key composition:",
          "- `Stepper` — root; props: `defaultValue`, `value`, `onValueChange`,",
          "  `orientation` (`horizontal` | `vertical`).",
          "- `StepperItem` — wraps one step; props: `step` (number), `completed`,",
          "  `disabled`, `loading`.",
          "- `StepperTrigger` — clickable button to jump to a step.",
          "- `StepperIndicator` — circular badge showing step number, checkmark,",
          "  or spinner. Derives its state from `StepItemContext`.",
          "- `StepperTitle` / `StepperDescription` — text content next to the indicator.",
          "- `StepperSeparator` — the line between steps.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Layout direction.",
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
  args: {
    defaultValue: 1,
    orientation: "horizontal",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const steps = [
  { step: 1, title: "Account", description: "Create your account" },
  { step: 2, title: "Profile", description: "Set up your profile" },
  { step: 3, title: "Billing", description: "Enter payment details" },
  { step: 4, title: "Review", description: "Confirm and submit" },
];

/** Interactive playground — click a step indicator to jump to it. */
export const Playground: Story = {
  render: (args) => (
    <Stepper {...args} className="w-full max-w-2xl">
      {steps.map(({ step, title, description }, idx) => (
        <StepperItem className="flex-1" key={step} step={step}>
          <StepperTrigger className="flex-col gap-1">
            <StepperIndicator />
            <div className="text-center">
              <StepperTitle>{title}</StepperTitle>
              <StepperDescription>{description}</StepperDescription>
            </div>
          </StepperTrigger>
          {idx < steps.length - 1 && <StepperSeparator />}
        </StepperItem>
      ))}
    </Stepper>
  ),
};

/** Controlled stepper with Next / Back buttons. */
export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState(1);
    const total = steps.length;

    return (
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Stepper className="w-full" onValueChange={setActive} value={active}>
          {steps.map(({ step, title }, idx) => (
            <StepperItem className="flex-1" key={step} step={step}>
              <StepperTrigger>
                <StepperIndicator />
                <StepperTitle>{title}</StepperTitle>
              </StepperTrigger>
              {idx < steps.length - 1 && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>

        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">
            Step {active}: {steps[active - 1]?.description}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            disabled={active === 1}
            onClick={() => setActive((s) => Math.max(1, s - 1))}
            variant="outline"
          >
            Back
          </Button>
          <Button
            disabled={active === total}
            onClick={() => setActive((s) => Math.min(total, s + 1))}
          >
            {active === total ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    );
  },
};

/** Vertical orientation — steps stack top-to-bottom. */
export const Vertical: Story = {
  render: (args) => (
    <Stepper
      {...args}
      className="max-w-xs"
      defaultValue={2}
      orientation="vertical"
    >
      {steps.map(({ step, title, description }, idx) => (
        <StepperItem key={step} step={step}>
          <StepperTrigger className="gap-3">
            <StepperIndicator />
            <div>
              <StepperTitle>{title}</StepperTitle>
              <StepperDescription>{description}</StepperDescription>
            </div>
          </StepperTrigger>
          {idx < steps.length - 1 && <StepperSeparator />}
        </StepperItem>
      ))}
    </Stepper>
  ),
};

/** All steps completed — every indicator shows the checkmark. */
export const AllCompleted: Story = {
  render: (args) => (
    <Stepper {...args} className="w-full max-w-2xl" value={5}>
      {steps.map(({ step, title }, idx) => (
        <StepperItem className="flex-1" completed key={step} step={step}>
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>{title}</StepperTitle>
          </StepperTrigger>
          {idx < steps.length - 1 && <StepperSeparator />}
        </StepperItem>
      ))}
    </Stepper>
  ),
};

/** Loading state on the active step — the indicator spins. */
export const LoadingStep: Story = {
  render: (args) => (
    <Stepper {...args} className="w-full max-w-2xl" value={2}>
      {steps.map(({ step, title }, idx) => (
        <StepperItem
          className="flex-1"
          key={step}
          loading={step === 2}
          step={step}
        >
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>{title}</StepperTitle>
          </StepperTrigger>
          {idx < steps.length - 1 && <StepperSeparator />}
        </StepperItem>
      ))}
    </Stepper>
  ),
};

/** Disabled steps are non-interactive and shown at reduced opacity. */
export const WithDisabled: Story = {
  render: (args) => (
    <Stepper {...args} className="w-full max-w-2xl" value={1}>
      {steps.map(({ step, title }, idx) => (
        <StepperItem
          className="flex-1"
          disabled={step === 3}
          key={step}
          step={step}
        >
          <StepperTrigger>
            <StepperIndicator />
            <StepperTitle>
              {step === 3 ? `${title} (disabled)` : title}
            </StepperTitle>
          </StepperTrigger>
          {idx < steps.length - 1 && <StepperSeparator />}
        </StepperItem>
      ))}
    </Stepper>
  ),
};

/** Minimal stepper — indicators only, no text labels. */
export const IndicatorsOnly: Story = {
  render: (args) => (
    <Stepper {...args} className="w-full max-w-md" value={2}>
      {steps.map(({ step }, idx) => (
        <StepperItem className="flex-1" key={step} step={step}>
          <StepperTrigger aria-label={`Step ${step}`}>
            <StepperIndicator />
          </StepperTrigger>
          {idx < steps.length - 1 && <StepperSeparator />}
        </StepperItem>
      ))}
    </Stepper>
  ),
};
