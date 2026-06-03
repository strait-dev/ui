"use client";

import { Scrollspy } from "@strait/ui/components/scrollspy";
import { cn } from "@strait/ui/utils";
import { useRef } from "react";

const sections = [
  {
    id: "intro",
    title: "Introduction",
    body: "Learn how the offset prop adjusts which section becomes active.",
  },
  {
    id: "props",
    title: "Props",
    body: "Pass a numeric offset in pixels to shift the activation threshold.",
  },
  {
    id: "examples",
    title: "Examples",
    body: "Common patterns: sticky headers, inset scroll containers.",
  },
];

const linkClass = cn(
  "rounded-md px-3 py-1.5 text-muted-foreground text-sm transition-colors",
  "hover:text-foreground",
  "data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground"
);

export default function ScrollspyWithOffsetDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-[34rem] gap-6">
      <Scrollspy offset={40} targetRef={containerRef}>
        <nav className="sticky top-0 flex flex-col gap-1">
          {sections.map((section) => (
            <a
              className={linkClass}
              data-scrollspy-anchor={section.id}
              href={`#${section.id}`}
              key={section.id}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </Scrollspy>
      <section
        aria-label="Documentation sections"
        className="h-64 flex-1 overflow-y-auto rounded-lg border p-4"
        ref={containerRef}
      >
        <div className="space-y-8">
          {sections.map((section) => (
            <section
              className="scroll-mt-4 space-y-1.5"
              id={section.id}
              key={section.id}
            >
              <h3 className="font-semibold text-base">{section.title}</h3>
              <p className="text-muted-foreground text-sm">{section.body}</p>
              <div className="h-32 rounded-md bg-muted/40" />
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
