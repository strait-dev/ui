import { Button } from "@strait/ui/components/button";
import { FeatureLock } from "@strait/ui/components/feature-lock";

export default function FeatureLockDemo() {
  return (
    <FeatureLock
      action={<Button variant="default">Upgrade now</Button>}
      description="Get access to advanced analytics and unlimited exports."
      locked
      planLabel="Pro"
      title="Upgrade to Pro"
    >
      <div className="h-40 w-80 rounded-lg border bg-muted/30 p-4">
        <p className="font-medium text-sm">Advanced Analytics</p>
        <div className="mt-3 space-y-2">
          <div className="h-4 rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="h-4 w-1/2 rounded bg-muted" />
        </div>
      </div>
    </FeatureLock>
  );
}
