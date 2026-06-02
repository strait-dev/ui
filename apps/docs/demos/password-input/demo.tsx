import { PasswordInput } from "@strait/ui/components/password-input";

export default function PasswordInputDemo() {
  return (
    <div className="w-72">
      <PasswordInput
        id="password-demo"
        label="Password"
        placeholder="Enter your password"
      />
    </div>
  );
}
