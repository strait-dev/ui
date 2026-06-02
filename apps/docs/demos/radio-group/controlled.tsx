"use client";

import { Label } from "@strait/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@strait/ui/components/radio-group";
import { useState } from "react";

const plans = [
  { value: "monthly", label: "Monthly", price: "$12/mo" },
  { value: "yearly", label: "Yearly", price: "$99/yr" },
  { value: "lifetime", label: "Lifetime", price: "$299 once" },
];

export default function RadioGroupControlled() {
  const [value, setValue] = useState("monthly");

  return (
    <div className="flex flex-col gap-3">
      <RadioGroup onValueChange={setValue} value={value}>
        {plans.map((plan) => (
          <div className="flex items-center gap-2" key={plan.value}>
            <RadioGroupItem id={`plan-${plan.value}`} value={plan.value} />
            <Label htmlFor={`plan-${plan.value}`}>
              {plan.label}
              <span className="ml-1 text-muted-foreground text-xs">
                ({plan.price})
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-muted-foreground text-sm">
        Selected: <code>{value}</code>
      </p>
    </div>
  );
}
