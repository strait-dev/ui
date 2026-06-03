import { RelativeTimeCard } from "@strait/ui/components/relative-time-card";

export default function RelativeTimeCardDemo() {
  return (
    <div className="flex flex-col gap-4">
      <RelativeTimeCard
        date={new Date(Date.now() - 5 * 60_000)}
        timezones={["UTC", "America/New_York"]}
      />
      <RelativeTimeCard
        date={new Date(Date.now() - 2 * 60 * 60_000)}
        timezones={["UTC"]}
        variant="muted"
      />
      <RelativeTimeCard
        date={new Date(Date.now() - 24 * 60 * 60_000)}
        variant="ghost"
      />
    </div>
  );
}
