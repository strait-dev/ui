import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";

export default function CardSizes() {
  return (
    <div className="flex flex-wrap items-start gap-4">
      <Card className="w-56" size="sm">
        <CardHeader>
          <CardTitle>Small</CardTitle>
          <CardDescription>Compact spacing (sm).</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Tighter gap and padding for dense layouts.
          </p>
        </CardContent>
      </Card>

      <Card className="w-56" size="default">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Standard spacing.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Balanced gap and padding for most use cases.
          </p>
        </CardContent>
      </Card>

      <Card className="w-56" size="lg">
        <CardHeader>
          <CardTitle>Large</CardTitle>
          <CardDescription>Generous spacing (lg).</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            More breathing room for prominent content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
