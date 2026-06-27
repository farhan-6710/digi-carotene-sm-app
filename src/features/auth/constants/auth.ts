export const AUTH_FORM_TYPE_PARAM = "form-type";

export const AUTH_FORM_TYPES = {
  login: "login",
  signup: "signup",
} as const;

export type AuthFormType =
  (typeof AUTH_FORM_TYPES)[keyof typeof AUTH_FORM_TYPES];

/** Supabase minimum; used for signup validation. */
export const MIN_AUTH_PASSWORD_LENGTH = 6;
