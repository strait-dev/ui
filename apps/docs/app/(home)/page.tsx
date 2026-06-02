import { Badge } from "@strait/ui/components/badge";
import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";
import { Switch } from "@strait/ui/components/switch";
import Link from "next/link";

const features = [
  {
    title: "Single-token theming",
    description:
      "Set --brand and the whole system rebrands — the brand triad, charts, and sidebar all follow.",
  },
  {
    title: "Accessible by default",
    description:
      "Built on Base UI primitives: focus management, ARIA wiring, and keyboard support come for free.",
  },
  {
    title: "Tree-shakeable",
    description:
      "One subpath export per component, so you ship only the components you actually import.",
  },
  {
    title: "120+ components",
    description:
      "Forms, overlays, data display, navigation, and rich application patterns out of the box.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-20">
      <section className="flex max-w-3xl flex-col items-center gap-6 text-center">
        <Badge variant="secondary">React 19 · Tailwind v4 · Base UI</Badge>
        <h1 className="text-balance font-semibold text-5xl text-foreground tracking-tight">
          The Strait UI design system
        </h1>
        <p className="max-w-xl text-balance text-lg text-muted-foreground">
          120+ accessible, themeable React components built on semantic oklch
          tokens. Browse a live example, copy the code, ship.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            render={<Link href="/docs">Get started</Link>}
            size="lg"
            variant="brand-solid"
          />
          <Button
            render={<Link href="/docs/components">Browse components</Link>}
            size="lg"
            variant="outline"
          />
        </div>
      </section>

      <section className="mt-16 w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Real components, real tokens</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="brand-solid">Brand</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Badge variant="success">Success</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="home-email">Email</Label>
              <Input
                id="home-email"
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch defaultChecked id="home-switch" />
              <Label htmlFor="home-switch">Enable notifications</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {features.map((f) => (
          <div className="flex flex-col gap-1.5" key={f.title}>
            <h3 className="font-medium text-foreground">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
