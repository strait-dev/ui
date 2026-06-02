"use client";

import {
  ActivityFeed,
  type ActivityItem,
} from "@strait/ui/components/activity-feed";

const items: ActivityItem[] = [
  {
    id: "1",
    status: "completed",
    title: "Deployment succeeded",
    timestamp: new Date(Date.now() - 3 * 60_000),
  },
  {
    id: "2",
    status: "running",
    title: "Build in progress",
    timestamp: new Date(Date.now() - 10 * 60_000),
  },
  {
    id: "3",
    status: "failed",
    title: "Health check failed",
    timestamp: new Date(Date.now() - 30 * 60_000),
  },
];

export default function ActivityFeedCustomRender() {
  return (
    <div className="w-96">
      <ActivityFeed
        height={200}
        items={items}
        renderItem={(item) => (
          <div
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
            data-slot="activity-feed-item"
            key={item.id}
          >
            <span className="font-medium">{item.title}</span>
            {item.status !== undefined && (
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
                {item.status}
              </span>
            )}
          </div>
        )}
      />
    </div>
  );
}
