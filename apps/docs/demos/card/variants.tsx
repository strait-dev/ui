import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";

export default function CardVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Card className="w-64">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>
            Subtle ring border on a card surface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            The default card variant uses a 1 px ring.
          </p>
        </CardContent>
      </Card>

      <Card className="w-64" variant="outline">
        <CardHeader>
          <CardTitle>Outline</CardTitle>
          <CardDescription>Visible border, no ring shadow.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            The outline variant uses a standard border.
          </p>
        </CardContent>
      </Card>

      <Card className="w-64" variant="ghost">
        <CardHeader>
          <CardTitle>Ghost</CardTitle>
          <CardDescription>Transparent — no border or ring.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Use ghost inside already-surfaced containers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
