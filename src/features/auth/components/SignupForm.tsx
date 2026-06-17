import { useState, type FormEvent } from "react";

import { AuthGoogleSignIn } from "@/features/auth/components/AuthGoogleSignIn";
import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";

export function SignupForm() {
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    const authError = await signUpWithEmail(email.trim(), password, name.trim());
    if (authError) {
      setError(authError.message);
    } else {
      setSuccessMessage(
        "Account created. Check your email to confirm your address, then sign in.",
      );
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }

    setIsSubmitting(false);
  }

  function clearMessages() {
    setError(null);
    setSuccessMessage(null);
  }

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

        <div className="space-y-2">
          <Label htmlFor="signup-email" className={authFormStyles.label}>
            Email
          </Label>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={authFormStyles.input}
            required
            disabled={isBusy}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password" className={authFormStyles.label}>
            Password
          </Label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={authFormStyles.input}
            required
            disabled={isBusy}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="signup-confirm-password"
            className={authFormStyles.label}
          >
            Confirm password
          </Label>
          <Input
            id="signup-confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={authFormStyles.input}
            required
            disabled={isBusy}
          />
        </div>

        {error ? (
          <p className={authFormStyles.errorAlert} role="alert">
            {error}
          </p>
        ) : null}

        {successMessage ? (
          <p className={authFormStyles.successAlert} role="status">
            {successMessage}
          </p>
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
        onError={setError}
        onBeforeSignIn={clearMessages}
      />
    </div>
  );
}
