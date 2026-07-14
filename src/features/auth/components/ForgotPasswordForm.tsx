import { Link } from "react-router";

import {
  AuthEmailField,
  AuthFormAlert,
} from "@/features/auth/components/AuthFormFields";
import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { AUTH_FORM_TYPES } from "@/features/auth/constants/auth";
import { useForgotPasswordForm } from "@/features/auth/hooks/useForgotPasswordForm";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ForgotPasswordForm() {
  const { email, setEmail, error, success, isSubmitting, handleSubmit } =
    useForgotPasswordForm();

  return (
    <div className="space-y-6">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <AuthEmailField
          id="forgot-password-email"
          value={email}
          onChange={setEmail}
          disabled={isSubmitting}
        />

        {error ? <AuthFormAlert message={error} variant="error" /> : null}
        {success ? <AuthFormAlert message={success} variant="success" /> : null}

        <Button
          type="submit"
          className={cn(authFormStyles.submitButton, "mt-2")}
          disabled={isSubmitting || !email.trim()}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              Sending link...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          to={buildAuthUrl(AUTH_FORM_TYPES.login)}
          className="font-semibold text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
