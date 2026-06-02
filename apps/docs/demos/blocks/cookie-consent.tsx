import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";

export default function CookieConsentBlock() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>We use cookies</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          We use cookies and similar technologies to improve your experience,
          analyse traffic, and personalise content. You can choose which
          categories to allow below.
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t-0 bg-transparent">
        <Button variant="brand-solid">Accept all</Button>
        <Button variant="outline">Reject</Button>
        <Button variant="ghost">Preferences</Button>
      </CardFooter>
    </Card>
  );
}
