import { Label } from "@strait/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@strait/ui/components/radio-group";

const options = [
  {
    value: "standard",
    label: "Standard",
    desc: "Delivered in 5–7 business days.",
  },
  {
    value: "express",
    label: "Express",
    desc: "Delivered in 2–3 business days.",
  },
  {
    value: "overnight",
    label: "Overnight",
    desc: "Next business day delivery.",
  },
];

export default function RadioGroupWithDescriptions() {
  return (
    <RadioGroup className="w-72" defaultValue="standard">
      {options.map((opt) => (
        <div className="flex gap-2" key={opt.value}>
          <RadioGroupItem
            className="mt-0.5"
            id={`ship-${opt.value}`}
            value={opt.value}
          />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={`ship-${opt.value}`}>{opt.label}</Label>
            <p className="text-muted-foreground text-sm">{opt.desc}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
}
