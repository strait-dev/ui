import { CopyField } from "@strait/ui/components/copy-field";

export default function CopyFieldStatuses() {
  return (
    <div className="grid w-full max-w-md gap-4">
      {(["default", "success", "warning", "destructive", "info"] as const).map(
        (status) => (
          <CopyField
            description={undefined}
            key={status}
            label={status}
            status={status}
            value="token_8f3a91c2e7"
          />
        )
      )}
    </div>
  );
}
