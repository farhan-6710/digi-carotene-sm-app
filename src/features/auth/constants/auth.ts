export const AUTH_FORM_TYPE_PARAM = "form-type";

export const AUTH_FORM_TYPES = {
  login: "login",
  signup: "signup",
} as const;

export type AuthFormType =
  (typeof AUTH_FORM_TYPES)[keyof typeof AUTH_FORM_TYPES];

export const AUTH_PORTAL_PARAM = "portal";

export const AUTH_PORTAL_TYPES = {
  staff: "staff",
} as const;

export type AuthPortalType =
  (typeof AUTH_PORTAL_TYPES)[keyof typeof AUTH_PORTAL_TYPES];

/** Shown on staff signup when `portal=staff` is in the auth URL. */
export const STAFF_SIGNUP_ACCESS_CODE = "Digicarotene@2";

/** Stored in auth user metadata; read by the signup profile trigger. */
export const SIGNUP_PORTAL_METADATA_KEY = "signup_portal";

export const SIGNUP_PORTAL_STAFF_VALUE = "staff";

/** Set when staff signup starts Google OAuth; cleared after callback. */
export const STAFF_OAUTH_SIGNUP_SESSION_KEY = "digi_staff_oauth_signup";

/** Max time between access-code verification + Google click and OAuth return. */
export const STAFF_OAUTH_SIGNUP_TTL_MS = 10 * 60 * 1000;
