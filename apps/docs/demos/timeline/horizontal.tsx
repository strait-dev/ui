import {
  Timeline,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@strait/ui/components/timeline";

const milestones = [
  { step: 1, date: "Q1", title: "Foundations" },
  { step: 2, date: "Q2", title: "Components" },
  { step: 3, date: "Q3", title: "Theming" },
  { step: 4, date: "Q4", title: "1.0 Release" },
];

export default function TimelineHorizontalDemo() {
  return (
    <Timeline defaultValue={2} line="dotted" orientation="horizontal">
      {milestones.map(({ step, date, title }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
