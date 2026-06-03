import {
  ActivityFeed,
  type ActivityItem,
} from "@strait/ui/components/activity-feed";

const items: ActivityItem[] = [
  {
    id: "1",
    status: "completed",
    title: "Deploy to production",
    timestamp: new Date(Date.now() - 2 * 60_000),
    description: "v3.1.0 · us-east-1",
  },
  {
    id: "2",
    status: "running",
    title: "Integration tests",
    timestamp: new Date(Date.now() - 8 * 60_000),
    description: "CI pipeline #482",
  },
  {
    id: "3",
    status: "failed",
    title: "Schema migration",
    timestamp: new Date(Date.now() - 20 * 60_000),
    description: "Constraint violation on users table",
  },
  {
    id: "4",
    status: "pending",
    title: "Notify stakeholders",
    timestamp: new Date(Date.now() - 45 * 60_000),
  },
  {
    id: "5",
    status: "delayed",
    title: "Nightly backup",
    timestamp: new Date(Date.now() - 120 * 60_000),
    description: "Storage quota nearly exhausted",
  },
  {
    id: "6",
    title: "Config updated",
    timestamp: new Date(Date.now() - 200 * 60_000),
    description: "No status — neutral dot",
  },
];

export default function ActivityFeedStatuses() {
  return (
    <div className="w-96">
      <ActivityFeed height={320} items={items} />
    </div>
  );
}
