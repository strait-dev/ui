import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta = {
  title: "Layout/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A vertically stacked list of disclosure panels.",
          "Built on Base UI's `Accordion` primitive.",
          "",
          "Key props on `Accordion` (root):",
          "- **`multiple`** — allow more than one panel open at a time (default `false`).",
          "- **`defaultValue`** — array of open item values on first render.",
          "- **`value` / `onValueChange`** — controlled open state.",
          "- **`disabled`** — disables all triggers.",
          "",
          "Each `AccordionItem` needs a `value` string. Triggers include",
          "animated chevrons via `ArrowDown01Icon` / `ArrowUp01Icon`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Allow multiple items to be expanded simultaneously.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: {
      control: "boolean",
      description: "Disable all accordion triggers.",
      table: { defaultValue: { summary: "false" } },
    },
  },
  args: {
    multiple: false,
    disabled: false,
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const faqItems = [
  {
    value: "item-1",
    trigger: "What is Strait UI?",
    content:
      "Strait UI is a design system built on Base UI primitives and styled with Tailwind CSS. It provides accessible, composable components for building consistent product interfaces.",
  },
  {
    value: "item-2",
    trigger: "How do I install the package?",
    content:
      'Run `bun add @strait/ui` in your project root, then import components directly: `import { Button } from "@strait/ui"`. All components are tree-shakeable.',
  },
  {
    value: "item-3",
    trigger: "Can I customise the colour palette?",
    content:
      "Yes. Strait UI uses CSS custom properties for all design tokens. Override them in your global stylesheet or Tailwind config to match your brand colours.",
  },
  {
    value: "item-4",
    trigger: "Is server-side rendering supported?",
    content:
      'All interactive components are marked `"use client"`. Static components render on the server without any additional configuration.',
  },
];

/** Interactive playground — toggle `multiple` and `disabled` in the controls. */
export const Playground: Story = {
  args: { defaultValue: ["item-1"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** Single-open mode (default): only one panel can be expanded at a time. */
export const Single: Story = {
  args: { multiple: false, defaultValue: ["item-1"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** Multiple-open mode: any number of panels can be expanded simultaneously. */
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["item-1", "item-3"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** All panels closed initially. */
export const AllClosed: Story = {
  args: { defaultValue: [] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/** Disabled — all triggers are non-interactive. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: ["item-2"] },
  render: (args) => (
    <Accordion {...args} className="w-96">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * Rich content inside panels — paragraphs, links, and nested lists
 * to verify the typography styles applied by `AccordionContent`.
 */
export const RichContent: Story = {
  args: { multiple: true, defaultValue: ["changelog", "links"] },
  render: (args) => (
    <Accordion {...args} className="w-[28rem]">
      <AccordionItem value="changelog">
        <AccordionTrigger>Release notes — v2.0</AccordionTrigger>
        <AccordionContent>
          <p>
            Version 2.0 introduces a redesigned token system and full Base UI
            alignment.
          </p>
          <p>
            Migration from v1 requires updating import paths. See the{" "}
            <a href="https://example.com/migration">migration guide</a> for
            details.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="links">
        <AccordionTrigger>Useful links</AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-4 text-sm">
            <li>
              <a href="https://example.com/docs">Documentation</a>
            </li>
            <li>
              <a href="https://github.com/example/strait">GitHub repository</a>
            </li>
            <li>
              <a href="https://example.com/tokens">Design tokens reference</a>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>Support &amp; community</AccordionTrigger>
        <AccordionContent>
          Join the Discord community or open an issue on GitHub for help with
          integration, bug reports, or feature requests.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
