import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  AuthFormAlert,
} from "@/features/auth/components/AuthFormFields";
import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { useResetPasswordForm } from "@/features/auth/hooks/useResetPasswordForm";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";

export function ResetPasswordForm() {
  const {
    password,
    setPassword,
    confirm,
    setConfirm,
    error,
    isSubmitting,
    handleSubmit,
  } = useResetPasswordForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-password" className={authFormStyles.label}>
          New password
        </Label>
        <div className="relative">
          <Input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            className={cn(authFormStyles.input, "pr-10")}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-password-confirm" className={authFormStyles.label}>
          Confirm password
        </Label>
        <div className="relative">
          <Input
            id="reset-password-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            disabled={isSubmitting}
            className={cn(authFormStyles.input, "pr-10")}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
            onClick={() => setShowConfirm((prev) => !prev)}
            aria-label={
              showConfirm ? "Hide confirm password" : "Show confirm password"
            }
          >
            {showConfirm ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {error ? <AuthFormAlert message={error} variant="error" /> : null}

      <Button
        type="submit"
        className={cn(authFormStyles.submitButton, "mt-2")}
        disabled={isSubmitting || !password || !confirm}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner size="sm" />
            Updating...
          </>
        ) : (
          "Update password"
        )}
      </Button>
    </form>
  );
}
