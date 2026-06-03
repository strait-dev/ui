import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@strait/ui/components/timeline";

const steps = [
  {
    step: 1,
    title: "Build queued",
    date: "09:00",
    content: "Job added to queue.",
  },
  {
    step: 2,
    title: "Build started",
    date: "09:01",
    content: "Runner assigned.",
  },
  {
    step: 3,
    title: "Tests passed",
    date: "09:04",
    content: "All tests passed.",
  },
  {
    step: 4,
    title: "Deployed",
    date: "09:06",
    content: "Released to production.",
  },
];

const variants = ["primary", "success", "info", "warning"] as const;

export default function TimelineVariantsDemo() {
  return (
    <div className="grid grid-cols-2 gap-8">
      {variants.map((variant) => (
        <div key={variant}>
          <p className="mb-3 font-medium text-muted-foreground text-xs capitalize">
            {variant}
          </p>
          <Timeline defaultValue={3} size="sm" variant={variant}>
            {steps.map(({ step, title, date, content }) => (
              <TimelineItem key={step} step={step}>
                <TimelineSeparator />
                <TimelineIndicator />
                <TimelineHeader>
                  <TimelineDate>{date}</TimelineDate>
                  <TimelineTitle>{title}</TimelineTitle>
                </TimelineHeader>
                <TimelineContent>{content}</TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      ))}
    </div>
  );
}
