import { Button } from "@strait/ui/components/button";
import { FeatureLock } from "@strait/ui/components/feature-lock";

export default function FeatureLockLocked() {
  return (
    <FeatureLock
      action={
        <Button size="sm" variant="default">
          Upgrade now
        </Button>
      }
      description="Get access to advanced analytics, unlimited exports, and priority support."
      locked
      planLabel="Pro"
      title="Upgrade to Pro"
    >
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium text-sm">Monthly active users</p>
        <p className="mt-1 font-semibold text-3xl tabular-nums">24,812</p>
        <div className="mt-4 flex items-end gap-1">
          {[40, 65, 50, 80, 70, 90, 75].map((h) => (
            <div
              className="flex-1 rounded-sm bg-primary/20"
              key={h}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>
    </FeatureLock>
  );
}
