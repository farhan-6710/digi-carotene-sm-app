import {
  AuthEmailField,
  AuthFormAlert,
} from "@/features/auth/components/AuthFormFields";
import { AuthGoogleSignIn } from "@/features/auth/components/AuthGoogleSignIn";
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
    error,
    setError,
    successMessage,
    isSubmitting,
    handleSubmit,
    clearMessages,
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

        {error ? <AuthFormAlert message={error} variant="error" /> : null}
        {successMessage ? (
          <AuthFormAlert message={successMessage} variant="success" />
        ) : null}

        <Button
          type="submit"
          className={cn(authFormStyles.submitButton, "mt-2")}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" />
              Sending link...
            </>
          ) : (
            "Send sign-in link"
          )}
        </Button>
      </form>

      <AuthGoogleSignIn
        disabled={isSubmitting}
        isSignup
        onError={setError}
        onBeforeSignIn={clearMessages}
      />

      <p className="text-center text-xs text-muted-foreground">
        After sign-in you may need to wait until Digi Carotene Management grants
        team or client portal access.
      </p>
    </div>
  );
}
