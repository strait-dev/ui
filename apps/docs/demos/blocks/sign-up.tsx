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

export default function SignUpBlock() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Fill in the details below to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-name">Name</Label>
          <Input id="signup-name" placeholder="Jane Smith" type="text" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" placeholder="you@example.com" type="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <Input id="signup-password" type="password" />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="signup-terms" />
          <Label className="font-normal" htmlFor="signup-terms">
            I agree to the terms
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button className="w-full" variant="brand-solid">
          Create account
        </Button>
        <p className="text-center text-muted-foreground text-sm">
          Already have an account?{" "}
          <Button className="h-auto p-0 text-sm" variant="link">
            Sign in
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
