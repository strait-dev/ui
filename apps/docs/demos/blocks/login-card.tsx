import { Github01Icon, GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";
import { Separator } from "@strait/ui/components/separator";

export default function LoginCardBlock() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Welcome back. Enter your credentials to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" placeholder="you@example.com" type="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-password">Password</Label>
          <Input id="login-password" type="password" />
        </div>
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs">
            or continue with
          </span>
          <Separator className="flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline">
            <HugeiconsIcon data-icon="inline-start" icon={Github01Icon} />
            GitHub
          </Button>
          <Button variant="outline">
            <HugeiconsIcon data-icon="inline-start" icon={GoogleIcon} />
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="brand-solid">
          Sign in
        </Button>
      </CardFooter>
    </Card>
  );
}
