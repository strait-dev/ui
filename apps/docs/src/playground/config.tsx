import { TextBoldIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@strait/ui/components/badge";
import { Button } from "@strait/ui/components/button";
import { ChartEmptyState } from "@strait/ui/components/chart-empty-state";
import { Checkbox } from "@strait/ui/components/checkbox";
import { CodeBlock } from "@strait/ui/components/code-block";
import { ExecutionTraceBar } from "@strait/ui/components/execution-trace-bar";
import { Input } from "@strait/ui/components/input";
import { NumberInputPercentageWithChevrons } from "@strait/ui/components/number-input-percentage-with-chevrons";
import { NumberInputWithButtons } from "@strait/ui/components/number-input-with-buttons";
import { NumberInputWithChevrons } from "@strait/ui/components/number-input-with-chevrons";
import { Rating } from "@strait/ui/components/rating";
import { RelativeTimeCard } from "@strait/ui/components/relative-time-card";
import { Shell } from "@strait/ui/components/shell";
import { Slider } from "@strait/ui/components/slider";
import { Spinner } from "@strait/ui/components/spinner";
import { Textarea } from "@strait/ui/components/textarea";
import { Toggle } from "@strait/ui/components/toggle";
import type { ComponentProps, ReactNode } from "react";

/** Current value of every control: variant axes (string) + booleans. */
export type PlaygroundControls = Record<string, string | boolean>;

export type PlaygroundEntry = {
  /** Component export name used to build the generated snippet. */
  displayName: string;
  /** Renders the live preview from the current control values. */
  render: (controls: PlaygroundControls) => ReactNode;
  /** Boolean prop names exposed as `Switch` toggles (off by default). */
  booleans?: string[];
  /** Snippet children text; the tag is self-closing when omitted. */
  childrenText?: string;
  /** Raw extra attributes appended to the default snippet tag. */
  extraAttrs?: string;
  /** Full snippet override for components whose usage needs base props. */
  snippet?: (controls: PlaygroundControls) => string;
};

const SAMPLE_CODE = `import { Button } from "@strait/ui/components/button";

function App() {
  return <Button variant="brand-solid">Click me</Button>;
}`;

const TRACE_SEGMENTS = [
  { label: "Queue wait", value: 18 },
  { label: "Execution", value: 412 },
  { label: "Serialization", value: 34 },
  { label: "Network", value: 56 },
];

/**
 * Per-component playground configuration for the single-element, variant/size
 * components. Each entry pairs a live `render` (driven by the current control
 * values) with the metadata needed to generate a faithful, copy-pasteable
 * snippet. Compound components stay examples-only.
 */
export const playgrounds: Record<string, PlaygroundEntry> = {
  badge: {
    displayName: "Badge",
    childrenText: "Badge",
    render: (c) => (
      <Badge
        radius={c.radius as ComponentProps<typeof Badge>["radius"]}
        size={c.size as ComponentProps<typeof Badge>["size"]}
        variant={c.variant as ComponentProps<typeof Badge>["variant"]}
      >
        Badge
      </Badge>
    ),
  },

  button: {
    displayName: "Button",
    childrenText: "Button",
    booleans: ["disabled"],
    render: (c) => (
      <Button
        disabled={c.disabled as boolean}
        size={c.size as ComponentProps<typeof Button>["size"]}
        variant={c.variant as ComponentProps<typeof Button>["variant"]}
      >
        Button
      </Button>
    ),
  },

  checkbox: {
    displayName: "Checkbox",
    booleans: ["disabled"],
    extraAttrs: 'aria-label="Accept terms"',
    render: (c) => (
      <Checkbox
        aria-label="Accept terms"
        disabled={c.disabled as boolean}
        size={c.size as ComponentProps<typeof Checkbox>["size"]}
        variant={c.variant as ComponentProps<typeof Checkbox>["variant"]}
      />
    ),
  },

  toggle: {
    displayName: "Toggle",
    booleans: ["disabled"],
    render: (c) => (
      <Toggle
        aria-label="Toggle bold"
        disabled={c.disabled as boolean}
        emphasis={c.emphasis as ComponentProps<typeof Toggle>["emphasis"]}
        size={c.size as ComponentProps<typeof Toggle>["size"]}
        variant={c.variant as ComponentProps<typeof Toggle>["variant"]}
      >
        <HugeiconsIcon icon={TextBoldIcon} />
      </Toggle>
    ),
    snippet: (c) =>
      `<Toggle aria-label="Toggle bold" variant="${c.variant}" emphasis="${c.emphasis}" size="${c.size}"${c.disabled ? " disabled" : ""}>
  <HugeiconsIcon icon={TextBoldIcon} />
</Toggle>`,
  },

  spinner: {
    displayName: "Spinner",
    extraAttrs: 'aria-label="Loading"',
    render: (c) => (
      <Spinner
        aria-label="Loading"
        size={c.size as ComponentProps<typeof Spinner>["size"]}
      />
    ),
  },

  input: {
    displayName: "Input",
    booleans: ["disabled"],
    extraAttrs: 'placeholder="Email" className="w-64"',
    render: (c) => (
      <Input
        className="w-64"
        disabled={c.disabled as boolean}
        placeholder="Email"
        size={c.size as ComponentProps<typeof Input>["size"]}
      />
    ),
  },

  textarea: {
    displayName: "Textarea",
    booleans: ["disabled"],
    extraAttrs: 'placeholder="Message" className="w-72"',
    render: (c) => (
      <Textarea
        className="w-72"
        disabled={c.disabled as boolean}
        placeholder="Message"
        resize={c.resize as ComponentProps<typeof Textarea>["resize"]}
        size={c.size as ComponentProps<typeof Textarea>["size"]}
      />
    ),
  },

  slider: {
    displayName: "Slider",
    booleans: ["disabled"],
    extraAttrs:
      'defaultValue={[60]} max={100} aria-label="Volume" className="w-64"',
    render: (c) => (
      <Slider
        aria-label="Volume"
        className="w-64"
        defaultValue={[60]}
        disabled={c.disabled as boolean}
        max={100}
        size={c.size as ComponentProps<typeof Slider>["size"]}
      />
    ),
  },

  rating: {
    displayName: "Rating",
    booleans: ["disabled"],
    extraAttrs: 'defaultValue={3} max={5} aria-label="Rating"',
    render: (c) => (
      <Rating
        aria-label="Rating"
        defaultValue={3}
        disabled={c.disabled as boolean}
        max={5}
        size={c.size as ComponentProps<typeof Rating>["size"]}
      />
    ),
  },

  "number-input-with-buttons": {
    displayName: "NumberInputWithButtons",
    booleans: ["disabled"],
    extraAttrs:
      'name="quantity" defaultValue={1} min={1} max={99} aria-label="Quantity"',
    render: (c) => (
      <NumberInputWithButtons
        aria-label="Quantity"
        defaultValue={1}
        disabled={c.disabled as boolean}
        max={99}
        min={1}
        name="quantity"
        size={c.size as ComponentProps<typeof NumberInputWithButtons>["size"]}
      />
    ),
  },

  "number-input-with-chevrons": {
    displayName: "NumberInputWithChevrons",
    booleans: ["disabled"],
    extraAttrs:
      'name="price" defaultValue={9.99} min={0} step={0.01} aria-label="Price"',
    render: (c) => (
      <NumberInputWithChevrons
        aria-label="Price"
        defaultValue={9.99}
        disabled={c.disabled as boolean}
        min={0}
        name="price"
        size={c.size as ComponentProps<typeof NumberInputWithChevrons>["size"]}
        step={0.01}
      />
    ),
  },

  "number-input-percentage-with-chevrons": {
    displayName: "NumberInputPercentageWithChevrons",
    booleans: ["disabled"],
    extraAttrs: 'name="discount" defaultValue={25} aria-label="Discount"',
    render: (c) => (
      <NumberInputPercentageWithChevrons
        aria-label="Discount"
        defaultValue={25}
        disabled={c.disabled as boolean}
        name="discount"
        size={
          c.size as ComponentProps<
            typeof NumberInputPercentageWithChevrons
          >["size"]
        }
      />
    ),
  },

  "chart-empty-state": {
    displayName: "ChartEmptyState",
    render: (c) => (
      <div className="flex h-56 w-72 items-center justify-center rounded-lg border">
        <ChartEmptyState
          message="Add a data source to start seeing charts here."
          size={c.size as ComponentProps<typeof ChartEmptyState>["size"]}
          title="Nothing to display"
        />
      </div>
    ),
    snippet: (c) =>
      `<ChartEmptyState
  title="Nothing to display"
  message="Add a data source to start seeing charts here."
  size="${c.size}"
/>`,
  },

  "execution-trace-bar": {
    displayName: "ExecutionTraceBar",
    render: (c) => (
      <div className="w-full max-w-xl">
        <ExecutionTraceBar
          formatValue={(n) => `${n}ms`}
          segments={TRACE_SEGMENTS}
          size={c.size as ComponentProps<typeof ExecutionTraceBar>["size"]}
        />
      </div>
    ),
    snippet: (c) =>
      `<ExecutionTraceBar
  size="${c.size}"
  formatValue={(n) => \`\${n}ms\`}
  segments={[
    { label: "Queue wait", value: 18 },
    { label: "Execution", value: 412 },
    { label: "Serialization", value: 34 },
    { label: "Network", value: 56 },
  ]}
/>`,
  },

  "code-block": {
    displayName: "CodeBlock",
    render: (c) => (
      <div className="w-full max-w-xl">
        <CodeBlock
          code={SAMPLE_CODE}
          language="tsx"
          showLineNumbers
          variant={c.variant as ComponentProps<typeof CodeBlock>["variant"]}
        />
      </div>
    ),
    snippet: (c) =>
      `<CodeBlock variant="${c.variant}" language="tsx" showLineNumbers code={code} />`,
  },

  "relative-time-card": {
    displayName: "RelativeTimeCard",
    render: (c) => (
      <RelativeTimeCard
        date={new Date(Date.now() - 2 * 60 * 60_000)}
        timezones={["UTC", "America/New_York"]}
        variant={
          c.variant as ComponentProps<typeof RelativeTimeCard>["variant"]
        }
      />
    ),
    snippet: (c) =>
      `<RelativeTimeCard
  variant="${c.variant}"
  date={new Date(Date.now() - 2 * 60 * 60_000)}
  timezones={["UTC", "America/New_York"]}
/>`,
  },

  shell: {
    displayName: "Shell",
    render: (c) => (
      <div className="w-full rounded-lg border">
        <Shell variant={c.variant as ComponentProps<typeof Shell>["variant"]}>
          <div>
            <h3 className="font-semibold text-lg">Dashboard</h3>
            <p className="text-muted-foreground text-sm">
              Welcome back. Here is what is happening today.
            </p>
          </div>
        </Shell>
      </div>
    ),
    snippet: (c) =>
      `<Shell variant="${c.variant}">
  {/* page content */}
</Shell>`,
  },
};
