import { useState, type FormEvent } from "react";

import { AuthGoogleSignIn } from "@/features/auth/components/AuthGoogleSignIn";
import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";

export function LoginForm() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const authError = await signInWithEmail(email.trim(), password);
    if (authError) {
      setError(authError.message);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email" className={authFormStyles.label}>
            Email
          </Label>
          <Input
            id="login-email"
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
          <Label htmlFor="login-password" className={authFormStyles.label}>
            Password
          </Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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

        <Button
          type="submit"
          className={cn(authFormStyles.submitButton, "mt-2")}
          disabled={isBusy}
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
        disabled={isBusy}
        onError={setError}
        onBeforeSignIn={() => setError(null)}
      />
    </div>
  );
}
