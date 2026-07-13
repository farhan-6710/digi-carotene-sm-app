import {
  AuthEmailField,
  AuthFormAlert,
  AuthPasswordField,
} from "@/features/auth/components/AuthFormFields";
import { AuthOAuthSignIn } from "@/features/auth/components/AuthOAuthSignIn";
import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { useSignupForm } from "@/features/auth/hooks/useSignupForm";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";

export function SignupForm() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    isSubmitting,
    handleSubmit,
    clearError,
  } = useSignupForm();

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
            disabled={isSubmitting}
          />
        </div>

        <AuthEmailField
          id="signup-email"
          value={email}
          onChange={setEmail}
          disabled={isSubmitting}
        />

        <AuthPasswordField
          id="signup-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="Create a password"
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
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <AuthOAuthSignIn
        disabled={isSubmitting}
        isSignup
        onError={setError}
        onBeforeSignIn={clearError}
      />

      <p className="text-center text-xs text-muted-foreground">
        After sign-up you may need to wait until Digi Carotene Management grants
        team or client portal access.
      </p>
    </div>
  );
}
