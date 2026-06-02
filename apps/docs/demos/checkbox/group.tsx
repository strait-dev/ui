import { Checkbox } from "@strait/ui/components/checkbox";
import { Label } from "@strait/ui/components/label";

const features = [
  {
    id: "analytics",
    label: "Analytics",
    description: "Track visits and page views.",
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Email and push alerts.",
  },
  {
    id: "integrations",
    label: "Integrations",
    description: "Connect third-party apps.",
  },
];

export default function CheckboxGroup() {
  return (
    <div className="flex flex-col gap-4">
      {features.map((f) => (
        <div className="flex gap-2" key={f.id}>
          <Checkbox id={f.id} />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={f.id}>{f.label}</Label>
            <p className="text-muted-foreground text-sm">{f.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
