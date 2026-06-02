import { PasswordInput } from "@strait/ui/components/password-input";

export default function PasswordInputInvalid() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <PasswordInput
        aria-invalid
        defaultValue="short"
        id="pw-invalid"
        label="Password"
        placeholder="Enter your password"
      />
      <p className="text-destructive text-sm">
        Incorrect password. Please try again.
      </p>
    </div>
  );
}
