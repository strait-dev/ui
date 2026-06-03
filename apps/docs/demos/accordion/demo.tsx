import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@strait/ui/components/accordion";

const items = [
  {
    value: "item-1",
    trigger: "What is Strait UI?",
    content:
      "Strait UI is a design system built on Base UI primitives and styled with Tailwind CSS v4. It provides accessible, composable components for building consistent product interfaces.",
  },
  {
    value: "item-2",
    trigger: "How do I install it?",
    content:
      "Run `bun add @strait/ui` in your project, then import components directly. All components are tree-shakeable via subpath exports.",
  },
  {
    value: "item-3",
    trigger: "Can I customise the colours?",
    content:
      "Yes. Strait UI uses CSS custom properties for all design tokens. Override them in your global stylesheet to match your brand.",
  },
];

export default function AccordionDemo() {
  return (
    <Accordion className="w-96" defaultValue={["item-1"]} variant="outline">
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
