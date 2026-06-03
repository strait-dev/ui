"use client";

import { Scrollspy } from "@strait/ui/components/scrollspy";
import { cn } from "@strait/ui/utils";
import { useRef } from "react";

const sections = [
  {
    id: "overview",
    title: "Overview",
    body: "A high-level summary of what the component does and when to reach for it.",
  },
  {
    id: "installation",
    title: "Installation",
    body: "Add the package to your workspace and import the parts you need.",
  },
  {
    id: "usage",
    title: "Usage",
    body: "Compose the parts together and wire up the controlled state.",
  },
  {
    id: "api",
    title: "API Reference",
    body: "Every prop, its type, default value, and a short description.",
  },
];

const linkClass = cn(
  "rounded-md px-3 py-1.5 text-muted-foreground text-sm transition-colors",
  "hover:text-foreground",
  "data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground"
);

export default function ScrollspyDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-[34rem] gap-6">
      <Scrollspy targetRef={containerRef}>
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
