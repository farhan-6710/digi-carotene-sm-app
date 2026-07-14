import { Link, Navigate, useLocation, useSearchParams } from "react-router";

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { SignupForm } from "@/features/auth/components/SignupForm";
import {
  AUTH_FORM_TYPE_PARAM,
  AUTH_FORM_TYPE_VALUES,
  AUTH_FORM_TYPES,
  type AuthFormType,
} from "@/features/auth/constants/auth";
import { isTeamPath, isClientPath } from "@/features/auth/constants/routes";
import { agencyMeta } from "@/features/public/constants/agency";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

function isAuthFormType(value: string | null): value is AuthFormType {
  return (
    value !== null &&
    (AUTH_FORM_TYPE_VALUES as readonly string[]).includes(value)
  );
}

export function AuthPage() {
  const {
    user,
    loading,
    profile,
    homePath,
    isTeam,
    isClient,
    isPasswordRecovery,
  } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const rawFormType = searchParams.get(AUTH_FORM_TYPE_PARAM);
  const formType: AuthFormType = isAuthFormType(rawFormType)
    ? rawFormType
    : AUTH_FORM_TYPES.login;

  const needsRedirect = !isAuthFormType(rawFormType);
  const canonicalPath = buildAuthUrl(formType);

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

  if (loading || (user && !profile && !isPasswordRecovery)) {
    return <CenteredLoading />;
  }

  const showResetPassword =
    isPasswordRecovery || formType === AUTH_FORM_TYPES.resetPassword;

  // Recovery session must stay on this page to set a new password.
  if (user && !showResetPassword) {
    return <Navigate to={redirectPath} replace />;
  }

  // Reset link without an active recovery session — send them to forgot-password.
  if (
    formType === AUTH_FORM_TYPES.resetPassword &&
    !isPasswordRecovery &&
    !user
  ) {
    return <Navigate to={buildAuthUrl(AUTH_FORM_TYPES.forgotPassword)} replace />;
  }

  const switchFormPath = buildAuthUrl(
    formType === AUTH_FORM_TYPES.signup
      ? AUTH_FORM_TYPES.login
      : AUTH_FORM_TYPES.signup,
  );

  const title = showResetPassword
    ? "Choose a new password"
    : formType === AUTH_FORM_TYPES.forgotPassword
      ? "Reset password"
      : formType === AUTH_FORM_TYPES.signup
        ? "Create account"
        : "Log in";

  const description = showResetPassword
    ? "Enter a new password for your Digi Carotene account."
    : formType === AUTH_FORM_TYPES.forgotPassword
      ? "We’ll email you a link to choose a new password."
      : formType === AUTH_FORM_TYPES.signup
        ? "Create your account with email and password."
        : "Sign in to the Digi Carotene team or client portal.";

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
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>

          {showResetPassword ? (
            <ResetPasswordForm />
          ) : formType === AUTH_FORM_TYPES.forgotPassword ? (
            <ForgotPasswordForm />
          ) : formType === AUTH_FORM_TYPES.signup ? (
            <SignupForm />
          ) : (
            <LoginForm />
          )}

          {!showResetPassword &&
          formType !== AUTH_FORM_TYPES.forgotPassword ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {formType === AUTH_FORM_TYPES.signup
                ? "Already have an account?"
                : "Need an account?"}{" "}
              <Link
                to={switchFormPath}
                className="font-semibold text-primary hover:underline"
              >
                {formType === AUTH_FORM_TYPES.signup ? "Log in" : "Sign up"}
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
