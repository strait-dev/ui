import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@strait/ui/components/accordion";

const faq = [
  {
    value: "q1",
    trigger: "What components are included?",
    content:
      "Strait UI ships over 120 accessible, tree-shakeable components for forms, overlays, data display, navigation, and rich application patterns.",
  },
  {
    value: "q2",
    trigger: "Is dark mode supported?",
    content:
      "Yes. All semantic tokens adapt automatically to dark mode via CSS custom properties. No extra configuration is required.",
  },
  {
    value: "q3",
    trigger: "Can I customise the brand colour?",
    content:
      "Set a single --brand token in your global stylesheet and all brand-derived tokens update automatically.",
  },
];

export default function AccordionVariants() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          default
        </p>
        <Accordion className="w-96" defaultValue={["q1"]} variant="default">
          {faq.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div>
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          outline
        </p>
        <Accordion className="w-96" defaultValue={["q1"]} variant="outline">
          {faq.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div>
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          solid
        </p>
        <Accordion className="w-96" defaultValue={["q1"]} variant="solid">
          {faq.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
