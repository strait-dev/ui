import { ScrollArea } from "@strait/ui/components/scroll-area";
import { Separator } from "@strait/ui/components/separator";

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
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "Vercel",
  "Cloudflare",
];

export default function ScrollAreaVertical() {
  return (
    <ScrollArea className="h-48 w-56 rounded-lg border">
      <div className="p-4">
        <p className="mb-3 font-semibold text-sm">Technologies</p>
        {tags.map((tag, i) => (
          <div key={tag}>
            <div className="py-1.5 text-sm">{tag}</div>
            {i < tags.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
