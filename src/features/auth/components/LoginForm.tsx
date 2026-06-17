import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/features/auth/providers/AuthProvider";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginForm() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const authError = await signInWithEmail(email.trim(), password);
    if (authError) {
      setError(authError.message);
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    const authError = await signInWithGoogle();
    if (authError) {
      setError(authError.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isSubmitting || isGoogleLoading}
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
            disabled={isSubmitting || isGoogleLoading}
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
          disabled={isSubmitting || isGoogleLoading}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/80" />
        </div>
        <div className="relative flex justify-center">
          <span className={authFormStyles.divider}>
            Or continue with Google
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className={authFormStyles.googleButton}
        onClick={handleGoogleSignIn}
        disabled={isSubmitting || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </Button>
    </div>
  );
}
