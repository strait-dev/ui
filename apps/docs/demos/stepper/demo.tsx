"use client";

import { Button } from "@strait/ui/components/button";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@strait/ui/components/stepper";
import { useState } from "react";

const steps = [
  { step: 1, title: "Account", description: "Create your account" },
  { step: 2, title: "Profile", description: "Set up your profile" },
  { step: 3, title: "Billing", description: "Enter payment details" },
  { step: 4, title: "Review", description: "Confirm and submit" },
];

export default function StepperDemo() {
  const [active, setActive] = useState(1);
  const total = steps.length;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <Stepper className="w-full" onValueChange={setActive} value={active}>
        {steps.map(({ step, title, description }, idx) => (
          <StepperItem className="flex-1" key={step} step={step}>
            <StepperTrigger>
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
}
