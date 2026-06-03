import { InputPasswordWithStrengthIndicator } from "@strait/ui/components/input-password-with-strength-indicator";

export default function InputPasswordErrorState() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <InputPasswordWithStrengthIndicator
        error
        id="password-error"
        label="Password"
        placeholder="Enter your password"
        showStrengthIndicator={false}
      />
      <p className="text-destructive text-sm">Password is required.</p>
    </div>
  );
}
