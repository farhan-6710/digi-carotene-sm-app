import {
  AuthEmailField,
  AuthFormAlert,
  AuthPasswordField,
} from "@/features/auth/components/AuthFormFields";
import { AuthGoogleSignIn } from "@/features/auth/components/AuthGoogleSignIn";
import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    isSubmitting,
    handleSubmit,
    clearError,
  } = useLoginForm();

  return (
    <div className="space-y-6">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <AuthEmailField
          id="login-email"
          value={email}
          onChange={setEmail}
          disabled={isSubmitting}
        />

        <AuthPasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Enter your password"
          disabled={isSubmitting}
        />

        {error ? <AuthFormAlert message={error} variant="error" /> : null}

        <Button
          type="submit"
          className={cn(authFormStyles.submitButton, "mt-2")}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <AuthGoogleSignIn
        disabled={isSubmitting}
        onError={setError}
        onBeforeSignIn={clearError}
      />
    </div>
  );
}
