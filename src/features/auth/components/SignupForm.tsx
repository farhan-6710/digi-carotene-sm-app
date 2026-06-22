import {
  AuthEmailField,
  AuthFormAlert,
  AuthPasswordField,
} from "@/features/auth/components/AuthFormFields";
import { AuthGoogleSignIn } from "@/features/auth/components/AuthGoogleSignIn";
import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { useSignupForm } from "@/features/auth/hooks/useSignupForm";
import type { SignupFormProps } from "@/features/auth/types/components";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";

export function SignupForm({
  signupAsStaff = false,
  disabled = false,
}: SignupFormProps) {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    successMessage,
    isSubmitting,
    handleSubmit,
    clearMessages,
  } = useSignupForm({ signupAsStaff });

  const isBusy = isSubmitting || disabled;

  return (
    <div className="space-y-6">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name" className={authFormStyles.label}>
            Name
          </Label>
          <Input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={authFormStyles.input}
            required
            disabled={isBusy}
          />
        </div>

        <AuthEmailField
          id="signup-email"
          value={email}
          onChange={setEmail}
          disabled={isBusy}
        />

        <AuthPasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="Create a password"
          disabled={isBusy}
        />

        <AuthPasswordField
          id="signup-confirm-password"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          placeholder="Confirm your password"
          disabled={isBusy}
        />

        {error ? <AuthFormAlert message={error} variant="error" /> : null}
        {successMessage ? (
          <AuthFormAlert message={successMessage} variant="success" />
        ) : null}

        <Button
          type="submit"
          className={cn(authFormStyles.submitButton, "mt-2")}
          disabled={isBusy}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <AuthGoogleSignIn
        disabled={isBusy}
        signupAsStaff={signupAsStaff}
        onError={setError}
        onBeforeSignIn={clearMessages}
      />
    </div>
  );
}
