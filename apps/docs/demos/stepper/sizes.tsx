import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@strait/ui/components/stepper";

const steps = [
  { step: 1, title: "Account", description: "Create your account" },
  { step: 2, title: "Profile", description: "Set up your profile" },
  { step: 3, title: "Billing", description: "Enter payment details" },
];

export default function StepperSizesDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      {(["default", "sm"] as const).map((size) => (
        <div key={size}>
          <p className="mb-3 text-muted-foreground text-xs">
            size=&quot;{size}&quot;
          </p>
          <Stepper className="w-full" defaultValue={2} size={size}>
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
        </div>
      ))}
    </div>
  );
}
