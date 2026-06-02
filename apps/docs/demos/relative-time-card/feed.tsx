import { RelativeTimeCard } from "@strait/ui/components/relative-time-card";

const events = [
  {
    id: 1,
    label: "Pull request merged",
    date: new Date(Date.now() - 2 * 60_000),
  },
  { id: 2, label: "Deploy started", date: new Date(Date.now() - 10 * 60_000) },
  { id: 3, label: "Tests passed", date: new Date(Date.now() - 18 * 60_000) },
];

export default function RelativeTimeCardFeedDemo() {
  return (
    <div className="flex max-w-sm flex-col divide-y">
      {events.map(({ id, label, date }) => (
        <div
          className="flex items-center justify-between py-2 text-sm"
          key={id}
        >
          <span>{label}</span>
          <RelativeTimeCard date={date} variant="muted" />
        </div>
      ))}
    </div>
  );
}
