import { useState } from "react";

import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { GoogleIcon } from "@/features/auth/components/GoogleIcon";
import type { AuthGoogleSignInProps } from "@/features/auth/types/components";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { Button } from "@/shared/ui/button";

export function AuthGoogleSignIn({
  disabled = false,
  isSignup = false,
  onError,
  onBeforeSignIn,
}: AuthGoogleSignInProps) {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    onBeforeSignIn?.();
    setIsLoading(true);

    const authError = await signInWithGoogle({ isSignup });
    if (authError) {
      onError(authError.message);
      setIsLoading(false);
    }
  }

  return (
    <>
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
        onClick={() => void handleGoogleSignIn()}
        disabled={disabled || isLoading}
      >
        {isLoading ? <LoadingSpinner size="sm" /> : <GoogleIcon />}
        Continue with Google
      </Button>
    </>
  );
}
