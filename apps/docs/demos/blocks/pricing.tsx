import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@strait/ui/components/badge";
import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";

const plans = [
  {
    name: "Starter",
    price: "$9",
    highlight: false,
    cta: "Get started",
    features: [
      "Up to 3 projects",
      "5 GB storage",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    highlight: true,
    cta: "Get started",
    features: [
      "Unlimited projects",
      "50 GB storage",
      "Advanced analytics",
      "Priority support",
      "Custom domains",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    highlight: false,
    cta: "Contact sales",
    features: [
      "Unlimited projects",
      "500 GB storage",
      "Enterprise analytics",
      "Dedicated support",
      "Custom domains",
      "SSO & audit logs",
    ],
  },
];

export default function PricingBlock() {
  return (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
      {plans.map((plan) => (
        <Card
          className={
            plan.highlight ? "border border-primary ring-2 ring-primary/20" : ""
          }
          key={plan.name}
          variant={plan.highlight ? "outline" : "default"}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{plan.name}</CardTitle>
              {plan.highlight ? (
                <Badge size="sm" variant="primary-light">
                  Most popular
                </Badge>
              ) : null}
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-bold text-3xl">{plan.price}</span>
              <span className="text-muted-foreground text-sm">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            <ul className="flex flex-col gap-2">
              {plan.features.map((feature) => (
                <li className="flex items-center gap-2 text-sm" key={feature}>
                  <HugeiconsIcon
                    className="size-4 shrink-0 text-primary"
                    icon={Tick02Icon}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="border-t-0 bg-transparent pt-0">
            <Button
              className="w-full"
              variant={plan.highlight ? "brand-solid" : "outline"}
            >
              {plan.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
