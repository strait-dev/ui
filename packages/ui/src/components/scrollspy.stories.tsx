import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";

import { cn } from "../utils/index";
import { Scrollspy } from "./scrollspy";

const meta = {
  title: "Navigation/Scrollspy",
  component: Scrollspy,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Highlights the navigation anchor for the section currently in view and",
          "smooth-scrolls to a section when its anchor is clicked.",
          "",
          "Wrap the navigation in `Scrollspy`. Mark each link with",
          '`data-scrollspy-anchor="<section-id>"` and give the matching content a',
          '`id` of the same value — the active link receives `data-active="true"`,',
          "which you style with `data-[active=true]:…`.",
          "",
          "**Target** — pass `targetRef` pointing at the scroll container (or one",
          'wrapping a `data-slot="scroll-area-viewport"`); omit it to spy on the',
          "document. Override the snap offset globally with `offset` or per anchor",
          "with `data-scrollspy-offset`.",
        ].join("\n"),
      },
    },
  },
  // Stories render self-contained demos, so supply inert children to satisfy
  // the required root prop.
  args: {
    children: null,
  },
} satisfies Meta<typeof Scrollspy>;

export default meta;

type Story = StoryObj<typeof meta>;

type Section = { id: string; title: string; body: string };

const SECTIONS: Section[] = [
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
    id: "accessibility",
    title: "Accessibility",
    body: "Keyboard support, focus management, and the ARIA roles in play.",
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

const sectionClass = "scroll-mt-4 space-y-1.5";

/** Vertical nav alongside a scrollable panel — the canonical setup. */
function VerticalDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex w-[34rem] gap-6">
      <Scrollspy targetRef={containerRef}>
        <nav className="sticky top-0 flex flex-col gap-1">
          {SECTIONS.map((section) => (
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
      <div
        className="h-72 flex-1 overflow-y-auto rounded-lg border p-4"
        ref={containerRef}
      >
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <section className={sectionClass} id={section.id} key={section.id}>
              <h3 className="font-semibold text-base">{section.title}</h3>
              <p className="text-muted-foreground text-sm">{section.body}</p>
              <div className="h-40 rounded-md bg-muted/40" />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: () => <VerticalDemo />,
};

/** A horizontal anchor bar above the scrollable content. */
export const Horizontal: Story = {
  render: () => {
    function HorizontalDemo() {
      const containerRef = useRef<HTMLDivElement>(null);
      return (
        <div className="flex w-[34rem] flex-col gap-3">
          <Scrollspy targetRef={containerRef}>
            <nav className="flex gap-1 border-b pb-2">
              {SECTIONS.map((section) => (
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
          <div
            className="h-72 overflow-y-auto rounded-lg border p-4"
            ref={containerRef}
          >
            <div className="space-y-8">
              {SECTIONS.map((section) => (
                <section
                  className={sectionClass}
                  id={section.id}
                  key={section.id}
                >
                  <h3 className="font-semibold text-base">{section.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {section.body}
                  </p>
                  <div className="h-40 rounded-md bg-muted/40" />
                </section>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return <HorizontalDemo />;
  },
};
