import { Button } from "@strait/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@strait/ui/components/card";
import { Checkbox } from "@strait/ui/components/checkbox";
import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";

export default function AuthFormBlock() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to continue.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="auth-email">Email</Label>
          <Input id="auth-email" placeholder="you@example.com" type="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="auth-password">Password</Label>
          <Input id="auth-password" type="password" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="auth-remember" />
          <Label className="font-normal" htmlFor="auth-remember">
            Remember me
          </Label>
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
