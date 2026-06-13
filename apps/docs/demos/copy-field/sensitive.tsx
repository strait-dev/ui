import { CopyField } from "@strait/ui/components/copy-field";

export default function CopyFieldSensitive() {
  return (
    <div className="w-full max-w-md">
      <CopyField
        description="Copying still writes the original secret value."
        label="API key"
        sensitive
        status="warning"
        value="sk_live_51J8f3a91c2e7Secret"
      />
    </div>
  );
}
