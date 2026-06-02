import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";

export default function CardWithFooter() {
  return (
    <div className="flex flex-wrap gap-4">
      <Card className="w-72">
        <CardHeader>
          <CardTitle>Team Plan</CardTitle>
          <CardDescription>Up to 25 seats included.</CardDescription>
          <CardAction>
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-2xl">
            $49
            <span className="font-normal text-muted-foreground text-sm">
              /mo
            </span>
          </p>
          <p className="mt-1 text-muted-foreground text-sm">
            Billed annually. Cancel anytime.
          </p>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-muted-foreground text-xs">
            14-day free trial
          </span>
          <Button size="sm">Get started</Button>
        </CardFooter>
      </Card>

      <Card className="w-72" size="sm" variant="outline">
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
          <CardDescription>72 GB of 100 GB used.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[72%] rounded-full bg-primary" />
          </div>
        </CardContent>
        <CardFooter>
          <span className="text-muted-foreground text-xs">28 GB remaining</span>
        </CardFooter>
      </Card>
    </div>
  );
}
