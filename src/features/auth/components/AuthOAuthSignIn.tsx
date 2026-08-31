import { useState, type ReactNode } from "react";

import { authFormStyles } from "@/features/auth/components/authFormStyles";
import { FacebookIcon } from "@/features/auth/components/FacebookIcon";
import { GoogleIcon } from "@/features/auth/components/GoogleIcon";
import type { AuthOAuthSignInProps } from "@/features/auth/types/components";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { AuthOAuthProvider } from "@/services/authService";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { showToast } from "@/shared/utils/showToast";
import { Button } from "@/shared/ui/button";

// Facebook is a placeholder for now — the button renders but does nothing.
// Portal Facebook auth is on hold until the Growth/analytics auth flow lands.
const OAUTH_OPTIONS: Array<{
  provider: AuthOAuthProvider;
  label: string;
  icon: ReactNode;
  enabled: boolean;
}> = [
  { provider: "google", label: "Continue with Google", icon: <GoogleIcon />, enabled: true },
  {
    provider: "facebook",
    label: "Continue with Facebook",
    icon: <FacebookIcon />,
    enabled: false,
  },
];

export function AuthOAuthSignIn({
  disabled = false,
  isSignup = false,
  onError,
  onBeforeSignIn,
}: AuthOAuthSignInProps) {
  const { signInWithOAuthProvider } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<AuthOAuthProvider | null>(
    null,
  );

  async function handleOAuthSignIn(provider: AuthOAuthProvider) {
    onBeforeSignIn?.();
    setLoadingProvider(provider);

    const result = await signInWithOAuthProvider(provider, { isSignup });
    setLoadingProvider(null);

    if (result.ok) {
      return;
    }

    if (result.popupBlocked) {
      showToast(
        "error",
        "Popup blocked. Allow popups for this site and try again.",
      );
      return;
    }

    if (result.cancelled) {
      return;
    }

    onError(result.error?.message ?? "Google sign-in failed.");
  }

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/80" />
        </div>
        <div className="relative flex justify-center">
          <span className={authFormStyles.divider}>Or continue with</span>
        </div>
      </div>

      <div className="space-y-2">
        {OAUTH_OPTIONS.map((option) => {
          const isLoading = loadingProvider === option.provider;

          return (
            <Button
              key={option.provider}
              type="button"
              variant="outline"
              className={authFormStyles.oauthButton}
              onClick={() => {
                if (option.enabled) {
                  void handleOAuthSignIn(option.provider);
                  return;
                }

                if (option.provider === "facebook") {
                  showToast(
                    "info",
                    "Facebook sign-in is coming soon. Use Google or email for now.",
                  );
                }
              }}
              disabled={disabled || loadingProvider != null}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : option.icon}
              {isLoading ? "Signing in..." : option.label}
            </Button>
          );
        })}
      </div>
    </>
  );
}
