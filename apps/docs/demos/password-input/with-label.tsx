import { PasswordInput } from "@strait/ui/components/password-input";

export default function PasswordInputWithLabel() {
  return (
    <div className="w-72">
      <PasswordInput
        id="pw-with-label"
        label="Password"
        placeholder="Enter your password"
      />
    </div>
  );
}
