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
    content: "Build job placed in the CI queue.",
  },
  {
    step: 2,
    title: "Build started",
    date: "09:01",
    content: "Runner picked up the job.",
  },
  {
    step: 3,
    title: "Tests passed",
    date: "09:04",
    content: "All 148 tests passed.",
  },
  {
    step: 4,
    title: "Deploying",
    date: "09:05",
    content: "Pushing image to production.",
  },
];

export default function TimelineDemo() {
  return (
    <Timeline defaultValue={3} variant="success">
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
  );
}
