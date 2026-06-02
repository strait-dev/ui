import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@strait/ui/components/accordion";

const sections = [
  {
    value: "design",
    trigger: "Design tokens",
    content:
      "All visual properties — colour, radius, spacing, typography — are expressed as semantic oklch CSS custom properties, making theming a single-source change.",
  },
  {
    value: "components",
    trigger: "Component architecture",
    content:
      "Each component is a composable set of sub-parts tagged with data-slot. Composition, not configuration, drives complex layouts.",
  },
  {
    value: "accessibility",
    trigger: "Accessibility",
    content:
      "Built on Base UI and React Aria, every interactive component ships with correct ARIA roles, keyboard navigation, and focus management out of the box.",
  },
  {
    value: "theming",
    trigger: "Theming",
    content:
      "Override the --brand custom property to recolour the entire system. Dark mode adapts automatically via oklch lightness inversion.",
  },
];

export default function AccordionMultiple() {
  return (
    <Accordion
      className="w-96"
      defaultValue={["design", "accessibility"]}
      variant="outline"
    >
      {sections.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
