import { Label } from "@strait/ui/components/label";
import { SecretInput } from "@strait/ui/components/secret-input";

export default function SecretInputVariants() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Both actions (default)</Label>
        <SecretInput
          copyable
          placeholder="sk_live_…"
          revealable
          value="sk_live_AbCdEfGhIjKl"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Reveal only</Label>
        <SecretInput
          copyable={false}
          placeholder="sk_live_…"
          revealable
          value="sk_live_AbCdEfGhIjKl"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Copy only</Label>
        <SecretInput
          copyable
          placeholder="sk_live_…"
          revealable={false}
          value="sk_live_AbCdEfGhIjKl"
        />
      </div>
    </div>
  );
}
