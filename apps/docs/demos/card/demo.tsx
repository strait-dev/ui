import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";

export default function CardDemo() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Project Invoice</CardTitle>
        <CardDescription>Due on June 30, 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Design system component library — milestone 2 delivery. Includes
          tokens, primitives, and documentation.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span className="font-medium text-sm">$4,800.00</span>
        <Button size="sm">Pay now</Button>
      </CardFooter>
    </Card>
  );
}
