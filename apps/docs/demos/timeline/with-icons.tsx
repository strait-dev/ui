import {
  CheckmarkCircle01Icon,
  Loading03Icon,
  RocketIcon,
} from "@hugeicons/core-free-icons";
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
    icon: CheckmarkCircle01Icon,
    date: "09:00",
    title: "Build queued",
    content: "Job added to queue.",
  },
  {
    step: 2,
    icon: CheckmarkCircle01Icon,
    date: "09:01",
    title: "Build started",
    content: "Runner assigned.",
  },
  {
    step: 3,
    icon: Loading03Icon,
    date: "09:04",
    title: "Running tests…",
    content: "Tests are currently running.",
  },
  {
    step: 4,
    icon: RocketIcon,
    date: "—",
    title: "Deploy",
    content: "Waiting for tests.",
  },
];

export default function TimelineWithIconsDemo() {
  return (
    <Timeline defaultValue={3} variant="success">
      {steps.map(({ step, icon, date, title, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator icon={icon} />
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
