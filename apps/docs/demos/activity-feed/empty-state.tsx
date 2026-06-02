import { ActivityFeed } from "@strait/ui/components/activity-feed";

export default function ActivityFeedEmptyState() {
  return (
    <div className="w-96">
      <ActivityFeed
        emptyState={
          <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
            <span className="font-medium text-sm">Nothing here yet</span>
            <span className="text-xs">
              Activity will appear as events occur.
            </span>
          </div>
        }
        height={200}
        items={[]}
      />
    </div>
  );
}
