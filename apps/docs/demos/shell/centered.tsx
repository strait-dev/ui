import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { Shell } from "@strait/ui/components/shell";

export default function ShellCentered() {
  return (
    <Shell className="min-h-64 justify-center" variant="centered">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">
            Enter your credentials to continue.
          </p>
          <Button className="w-full" variant="default">
            Continue with email
          </Button>
          <Button className="w-full" variant="outline">
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </Shell>
  );
}
