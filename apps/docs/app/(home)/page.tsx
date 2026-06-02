import { Button } from "@strait/ui/components/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="font-semibold text-foreground text-h1 tracking-tight">
          Strait UI
        </h1>
        <p className="max-w-xl text-balance text-muted-foreground">
          A custom React design system built on Tailwind CSS v4, Base UI, and
          semantic oklch tokens. 120+ accessible, themeable components.
        </p>
      </div>
      {/* Smoke test: these render with the real @strait/ui tokens. */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button render={<Link href="/docs">Get started</Link>} />
        <Button
          render={<Link href="/docs/components">Browse components</Link>}
          variant="outline"
        />
        <Button variant="brand">Brand</Button>
      </div>
    </main>
  );
}
