import { Link, Navigate, useLocation, useSearchParams } from "react-router";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { SignupForm } from "@/features/auth/components/SignupForm";
import {
  AUTH_FORM_TYPE_PARAM,
  AUTH_FORM_TYPES,
} from "@/features/auth/constants/auth";
import { isTeamPath, isClientPath } from "@/features/auth/constants/routes";
import { agencyMeta } from "@/features/public/constants/agency";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function AuthPage() {
  const { user, loading, profile, homePath, isTeam, isClient } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const rawFormType = searchParams.get(AUTH_FORM_TYPE_PARAM);
  const isSignup = rawFormType === AUTH_FORM_TYPES.signup;

  const hasInvalidFormType =
    rawFormType !== null &&
    rawFormType !== AUTH_FORM_TYPES.login &&
    rawFormType !== AUTH_FORM_TYPES.signup;

  const needsRedirect = rawFormType === null || hasInvalidFormType;
  const canonicalPath = buildAuthUrl(
    isSignup ? AUTH_FORM_TYPES.signup : AUTH_FORM_TYPES.login,
  );

  const requestedPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? undefined;

  let redirectPath = homePath;
  if (requestedPath) {
    if (isTeam && isTeamPath(requestedPath)) {
      redirectPath = requestedPath;
    } else if (isClient && isClientPath(requestedPath)) {
      redirectPath = requestedPath;
    }
  }

  if (needsRedirect) {
    return <Navigate to={canonicalPath} replace />;
  }

  if (loading || (user && !profile)) {
    return <CenteredLoading />;
  }

  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  const switchFormPath = buildAuthUrl(
    isSignup ? AUTH_FORM_TYPES.login : AUTH_FORM_TYPES.signup,
  );

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-3xl font-semibold tracking-wider text-muted-foreground uppercase transition hover:text-foreground"
          >
            {agencyMeta.name}
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold tracking-tight">
              {isSignup ? "Create account" : "Log in"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignup
                ? "Create your account with email and password."
                : "Sign in to the Digi Carotene team or client portal."}
            </p>
          </div>

          {isSignup ? <SignupForm /> : <LoginForm />}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link
              to={switchFormPath}
              className="font-semibold text-primary hover:underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
