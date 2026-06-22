import { useState } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { StaffAccessCodeModal } from "@/features/auth/components/StaffAccessCodeModal";
import {
  AUTH_FORM_TYPE_PARAM,
  AUTH_FORM_TYPES,
  AUTH_PORTAL_PARAM,
  AUTH_PORTAL_TYPES,
} from "@/features/auth/constants/auth";
import { isStaffPath, isClientPath } from "@/features/auth/constants/routes";
import { agencyMeta } from "@/features/public/constants/agency";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function AuthPage() {
  const { user, loading, profile, homePath, isStaff, isClient } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [staffCodeVerified, setStaffCodeVerified] = useState(false);

  const rawFormType = searchParams.get(AUTH_FORM_TYPE_PARAM);
  const rawPortal = searchParams.get(AUTH_PORTAL_PARAM);
  const isSignup = rawFormType === AUTH_FORM_TYPES.signup;
  const isStaffSignup =
    isSignup && rawPortal === AUTH_PORTAL_TYPES.staff;
  const showStaffCodeModal = isStaffSignup && !staffCodeVerified;

  const hasInvalidFormType =
    rawFormType !== null &&
    rawFormType !== AUTH_FORM_TYPES.login &&
    rawFormType !== AUTH_FORM_TYPES.signup;
  const hasInvalidPortal =
    rawPortal !== null && rawPortal !== AUTH_PORTAL_TYPES.staff;
  const portalOnLogin = !isSignup && rawPortal !== null;

  const needsRedirect =
    rawFormType === null ||
    hasInvalidFormType ||
    hasInvalidPortal ||
    portalOnLogin;

  const canonicalPath = buildAuthUrl({
    formType: isSignup ? AUTH_FORM_TYPES.signup : AUTH_FORM_TYPES.login,
    staffPortal: isStaffSignup,
  });

  const requestedPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? undefined;

  let redirectPath = homePath;
  if (requestedPath) {
    if (isStaff && isStaffPath(requestedPath)) {
      redirectPath = requestedPath;
    } else if (isClient && isClientPath(requestedPath)) {
      redirectPath = requestedPath;
    }
  }

  if (needsRedirect) {
    return <Navigate to={canonicalPath} replace />;
  }

  if (loading) {
    return <CenteredLoading />;
  }

  if (user && !profile) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
        <p className="text-lg font-semibold">Could not load your profile</p>
        <p className="max-w-md text-sm text-muted-foreground">
          You are signed in, but no profile row was found. Run{" "}
          <code className="text-xs">scripts/setup-database.sql</code> in Supabase,
          then sign up again or ask an admin to create your profile row.
        </p>
        <Link
          to="/"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  const switchFormPath = isSignup
    ? buildAuthUrl({ formType: AUTH_FORM_TYPES.login })
    : isStaffSignup
      ? buildAuthUrl({ formType: AUTH_FORM_TYPES.signup, staffPortal: true })
      : buildAuthUrl({ formType: AUTH_FORM_TYPES.signup });

  const heading = isSignup
    ? isStaffSignup
      ? "Create staff account"
      : "Create account"
    : "Log in";

  const description = isSignup
    ? isStaffSignup
      ? "Sign up for the Digi Carotene staff portal."
      : "Sign up for client portal access."
    : "Sign in to your staff or client portal.";

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <StaffAccessCodeModal
        open={showStaffCodeModal}
        onVerified={() => setStaffCodeVerified(true)}
      />

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
            <h2 className="text-lg font-semibold tracking-tight">{heading}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>

          {isSignup ? (
            <SignupForm
              signupAsStaff={isStaffSignup}
              disabled={showStaffCodeModal}
            />
          ) : (
            <LoginForm />
          )}

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
