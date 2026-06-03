import { InputPasswordWithStrengthIndicator } from "@strait/ui/components/input-password-with-strength-indicator";

export default function InputPasswordWithoutIndicator() {
  return (
    <div className="w-72">
      <InputPasswordWithStrengthIndicator
        id="password-no-indicator"
        label="Password"
        placeholder="Enter your password"
        showStrengthIndicator={false}
      />
    </div>
  );
}
