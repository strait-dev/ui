import { CardCheckboxItem } from "@strait/ui/components/card-checkbox";

export default function CardCheckboxCompact() {
  return (
    <div className="flex gap-3">
      <CardCheckboxItem
        defaultChecked
        id="compact-a"
        label="Option A"
        variant="compact"
      />
      <CardCheckboxItem id="compact-b" label="Option B" variant="compact" />
      <CardCheckboxItem id="compact-c" label="Option C" variant="compact" />
    </div>
  );
}
