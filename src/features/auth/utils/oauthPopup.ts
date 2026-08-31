import type { AuthError } from "@supabase/supabase-js";

import { OAUTH_CALLBACK_MESSAGE_TYPE } from "@/features/auth/constants/oauthRoutes";
import { supabase } from "@/services/supabaseClient";

export type OAuthPopupResult =
  | { ok: true }
  | { ok: false; error: AuthError | null; cancelled?: boolean; popupBlocked?: boolean };

const POPUP_NAME = "digi-carotene-oauth";
const POPUP_FEATURES =
  "popup=yes,width=500,height=700,left=100,top=80,scrollbars=yes,resizable=yes";

type OAuthCallbackMessage = {
  type: typeof OAUTH_CALLBACK_MESSAGE_TYPE;
  success: boolean;
  error?: string;
};

export function openOAuthPopup(oauthUrl: string): Promise<OAuthPopupResult> {
  return new Promise((resolve) => {
    const popup = window.open(oauthUrl, POPUP_NAME, POPUP_FEATURES);

    if (!popup) {
      resolve({ ok: false, error: null, popupBlocked: true });
      return;
    }

    let settled = false;

    const finish = (result: OAuthPopupResult) => {
      if (settled) {
        return;
      }
      settled = true;
      window.removeEventListener("message", onMessage);
      window.clearInterval(closedPoll);
      subscription.unsubscribe();
      if (!popup.closed) {
        popup.close();
      }
      resolve(result);
    };

    const onMessage = (event: MessageEvent<OAuthCallbackMessage>) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data?.type !== OAUTH_CALLBACK_MESSAGE_TYPE) {
        return;
      }

      if (event.data.success) {
        finish({ ok: true });
        return;
      }

      finish({
        ok: false,
        error: event.data.error
          ? ({ message: event.data.error, name: "OAuthError", status: 400 } as AuthError)
          : null,
      });
    };

    const closedPoll = window.setInterval(() => {
      if (!popup.closed) {
        return;
      }

      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          finish({ ok: true });
        } else {
          finish({ ok: false, error: null, cancelled: true });
        }
      });
    }, 400);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        finish({ ok: true });
      }
    });

    window.addEventListener("message", onMessage);
  });
}
