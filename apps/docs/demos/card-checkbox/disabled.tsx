import { CardCheckboxItem } from "@strait/ui/components/card-checkbox";

export default function CardCheckboxDisabled() {
  return (
    <div className="w-72">
      <CardCheckboxItem
        checked
        description="This option is not available in your current plan."
        disabled
        id="disabled-item"
        label="Unavailable option"
        layout="start"
      />
    </div>
  );
}
