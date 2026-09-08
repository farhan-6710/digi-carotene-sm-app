import {
  AuthFormAlert,
  AuthPasswordField,
} from "@/features/auth/components/AuthFormFields";
import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { useResetPasswordForm } from "@/features/auth/hooks/useResetPasswordForm";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ResetPasswordForm() {
  const {
    password,
    setPassword,
    confirm,
    setConfirm,
    error,
    success,
    isSubmitting,
    handleSubmit,
  } = useResetPasswordForm();

  if (success) {
    return (
      <div className="space-y-4">
        <AuthFormAlert
          message="Password changed successfully. Redirecting you to your portal…"
          variant="success"
        />
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      <AuthPasswordField
        id="reset-password"
        label="New password"
        value={password}
        onChange={setPassword}
        disabled={isSubmitting}
        autoComplete="new-password"
        placeholder="Enter new password"
      />

      <AuthPasswordField
        id="reset-password-confirm"
        label="Confirm password"
        value={confirm}
        onChange={setConfirm}
        disabled={isSubmitting}
        autoComplete="new-password"
        placeholder="Confirm new password"
      />

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
