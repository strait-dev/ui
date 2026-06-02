import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@strait/ui/components/accordion";

export default function AccordionIndicators() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          chevron (default)
        </p>
        <Accordion className="w-96" defaultValue={["i1"]}>
          <AccordionItem value="i1">
            <AccordionTrigger indicator="chevron">
              How does billing work?
            </AccordionTrigger>
            <AccordionContent>
              You are billed monthly at the start of each cycle. You can cancel
              at any time before renewal.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="i2">
            <AccordionTrigger indicator="chevron">
              Can I switch plans?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Plan changes take effect immediately; you are only charged
              the prorated difference.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div>
        <p className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
          plus-minus
        </p>
        <Accordion className="w-96" defaultValue={["j1"]}>
          <AccordionItem value="j1">
            <AccordionTrigger indicator="plus-minus">
              What is included in the free tier?
            </AccordionTrigger>
            <AccordionContent>
              The free tier includes up to 3 projects, 1 GB of storage, and
              community support.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="j2">
            <AccordionTrigger indicator="plus-minus">
              Is there a student discount?
            </AccordionTrigger>
            <AccordionContent>
              Yes. Verify your academic email to receive 50 % off any paid plan.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
