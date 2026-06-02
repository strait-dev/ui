import { Separator } from "@strait/ui/components/separator";

const items = [
  { label: "General", description: "Language, timezone, and display" },
  { label: "Notifications", description: "Email and push preferences" },
  { label: "Integrations", description: "Connect third-party services" },
  { label: "Advanced", description: "Experimental features" },
];

export default function SeparatorInList() {
  return (
    <div className="w-96 rounded-lg border p-4">
      {items.map((item, i) => (
        <div key={item.label}>
          <div className="flex items-center justify-between py-2">
            <span className="font-medium text-sm">{item.label}</span>
            <span className="text-muted-foreground text-xs">
              {item.description}
            </span>
          </div>
          {i < items.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
