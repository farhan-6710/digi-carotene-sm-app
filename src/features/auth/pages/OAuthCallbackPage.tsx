import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { AUTH_FORM_TYPES } from "@/features/auth/constants/auth";
import { OAUTH_CALLBACK_MESSAGE_TYPE } from "@/features/auth/constants/oauthRoutes";
import { buildAuthUrl } from "@/features/auth/utils/authUrlParams";
import { supabase } from "@/services/supabaseClient";
import { CenteredLoading } from "@/shared/components/LoadingSpinner";

function notifyOpener(success: boolean, errorMessage?: string) {
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(
      {
        type: OAUTH_CALLBACK_MESSAGE_TYPE,
        success,
        error: errorMessage,
      },
      window.location.origin,
    );
    window.close();
    return true;
  }

  return false;
}

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handledRef = useRef(false);

  const nextPath = searchParams.get("next") ?? buildAuthUrl(AUTH_FORM_TYPES.login);
  const oauthError =
    searchParams.get("error_description") ?? searchParams.get("error");

  useEffect(() => {
    if (handledRef.current) {
      return;
    }

    if (oauthError) {
      handledRef.current = true;
      if (!notifyOpener(false, oauthError)) {
        navigate(nextPath, { replace: true });
      }
      return;
    }

    let active = true;

    const complete = (success: boolean, errorMessage?: string) => {
      if (!active || handledRef.current) {
        return;
      }
      handledRef.current = true;

      if (notifyOpener(success, errorMessage)) {
        return;
      }

      navigate(nextPath, { replace: true });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        complete(true);
      }
    });

    void supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!active) {
        return;
      }
      if (error) {
        complete(false, error.message);
        return;
      }
      if (session) {
        complete(true);
      }
    });

    const timeout = window.setTimeout(() => {
      if (!handledRef.current) {
        complete(false, "Sign-in timed out. Please try again.");
      }
    }, 30_000);

    return () => {
      active = false;
      subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [navigate, nextPath, oauthError]);

  return <CenteredLoading />;
}
