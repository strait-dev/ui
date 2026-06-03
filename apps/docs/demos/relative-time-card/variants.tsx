import { RelativeTimeCard } from "@strait/ui/components/relative-time-card";

const date = new Date(Date.now() - 5 * 60_000);

export default function RelativeTimeCardVariantsDemo() {
  return (
    <div className="flex items-center gap-6">
      <RelativeTimeCard date={date} variant="default" />
      <RelativeTimeCard date={date} variant="muted" />
      <RelativeTimeCard date={date} variant="ghost" />
    </div>
  );
}
