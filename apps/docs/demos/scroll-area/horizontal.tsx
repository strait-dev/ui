import { ScrollArea, ScrollBar } from "@strait/ui/components/scroll-area";

const tags = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Storybook",
  "Vite",
  "Bun",
  "Base UI",
  "ESLint",
  "Biome",
  "Turborepo",
  "Vitest",
  "Playwright",
  "GraphQL",
  "Prisma",
  "Docker",
];

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea className="w-80 rounded-lg border">
      <div className="flex gap-4 p-4">
        {tags.map((tag) => (
          <div
            className="flex h-20 w-28 shrink-0 items-center justify-center rounded-md bg-muted text-center font-medium text-xs"
            key={tag}
          >
            {tag}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
