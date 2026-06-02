import {
  ActivityFeed,
  type ActivityItem,
} from "@strait/ui/components/activity-feed";

const items: ActivityItem[] = [
  {
    id: "1",
    status: "completed",
    title: "Deployment succeeded",
    timestamp: new Date(Date.now() - 1 * 60_000),
    description: "prod-us-east-1 · v2.4.1",
  },
  {
    id: "2",
    status: "running",
    title: "Build in progress",
    timestamp: new Date(Date.now() - 4 * 60_000),
    description: "Branch: feature/dark-mode",
  },
  {
    id: "3",
    status: "failed",
    title: "Database migration failed",
    timestamp: new Date(Date.now() - 12 * 60_000),
    description: "Error: relation does not exist",
  },
  {
    id: "4",
    status: "pending",
    title: "Webhook queued",
    timestamp: new Date(Date.now() - 35 * 60_000),
  },
  {
    id: "5",
    status: "delayed",
    title: "Scheduled job paused",
    timestamp: new Date(Date.now() - 90 * 60_000),
    description: "Retries exhausted — waiting for backoff",
  },
];

export default function ActivityFeedDemo() {
  return (
    <div className="w-96">
      <ActivityFeed height={280} items={items} />
    </div>
  );
}
