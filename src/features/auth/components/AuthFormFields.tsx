import { authFormStyles } from "@/features/auth/components/authFormStyles";
import type {
  AuthEmailFieldProps,
  AuthFormAlertProps,
  AuthPasswordFieldProps,
} from "@/features/auth/types/components";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "@/shared/ui/PasswordInput";

export function AuthEmailField({
  id,
  value,
  onChange,
  disabled = false,
  autoComplete = "email",
}: AuthEmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={authFormStyles.label}>
        Email
      </Label>
      <Input
        id={id}
        type="email"
        autoComplete={autoComplete}
        placeholder="you@company.com"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={authFormStyles.input}
        required
        disabled={disabled}
      />
    </div>
  );
}

export function AuthPasswordField({
  id,
  label,
  value,
  onChange,
  disabled = false,
  autoComplete,
  placeholder,
}: AuthPasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={authFormStyles.label}>
        {label}
      </Label>
      <PasswordInput
        id={id}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={authFormStyles.input}
        required
        disabled={disabled}
      />
    </div>
  );
}

export function AuthFormAlert({ message, variant }: AuthFormAlertProps) {
  const className =
    variant === "success" ? authFormStyles.successAlert : authFormStyles.errorAlert;

  return (
    <p className={className} role={variant === "success" ? "status" : "alert"}>
      {message}
    </p>
  );
}
