"use client";

import { Scrollspy } from "@strait/ui/components/scrollspy";
import { cn } from "@strait/ui/utils";
import { useRef } from "react";

const sections = [
  {
    id: "design",
    title: "Design",
    body: "Tokens, typography, and the visual language of the system.",
  },
  {
    id: "components",
    title: "Components",
    body: "Accessible, composable UI primitives built on Base UI.",
  },
  {
    id: "theming",
    title: "Theming",
    body: "Single-token rebrand via the --brand custom property.",
  },
  {
    id: "release",
    title: "Release",
    body: "Changesets-driven publish with OIDC provenance.",
  },
];

const linkClass = cn(
  "whitespace-nowrap rounded-md px-3 py-1.5 text-muted-foreground text-sm transition-colors",
  "hover:text-foreground",
  "data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-accent-foreground"
);

export default function ScrollspyHorizontalDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex w-[34rem] flex-col gap-3">
      <Scrollspy targetRef={containerRef}>
        <nav className="flex gap-1 overflow-x-auto border-b pb-2">
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
        className="h-64 overflow-y-auto rounded-lg border p-4"
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
