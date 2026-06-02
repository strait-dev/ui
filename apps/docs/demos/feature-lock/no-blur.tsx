import { Button } from "@strait/ui/components/button";
import { FeatureLock } from "@strait/ui/components/feature-lock";

export default function FeatureLockNoBlur() {
  return (
    <FeatureLock
      action={
        <Button size="sm" variant="outline">
          View plans
        </Button>
      }
      blur={false}
      description="Enable this feature by upgrading your plan."
      locked
      planLabel="Pro"
      title="Upgrade to unlock"
    >
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium text-sm">Cohort analysis</p>
        <div className="mt-4 h-32 rounded bg-muted" />
      </div>
    </FeatureLock>
  );
}
