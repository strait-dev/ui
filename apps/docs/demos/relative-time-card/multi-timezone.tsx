import { RelativeTimeCard } from "@strait/ui/components/relative-time-card";

const date = new Date(Date.now() - 3 * 60_000);

export default function RelativeTimeCardMultiTimezoneDemo() {
  return (
    <div className="flex items-center gap-4">
      <RelativeTimeCard
        date={date}
        timezones={["America/New_York", "Europe/London", "Asia/Tokyo"]}
        variant="ghost"
      >
        Hover to see timezones
      </RelativeTimeCard>
    </div>
  );
}
