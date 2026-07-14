export const AUTH_FORM_TYPE_PARAM = "form-type";

export const AUTH_FORM_TYPES = {
  login: "login",
  signup: "signup",
  forgotPassword: "forgot-password",
  resetPassword: "reset-password",
} as const;

export type AuthFormType =
  (typeof AUTH_FORM_TYPES)[keyof typeof AUTH_FORM_TYPES];

/** Valid `form-type` query values for `/auth`. */
export const AUTH_FORM_TYPE_VALUES: readonly AuthFormType[] = [
  AUTH_FORM_TYPES.login,
  AUTH_FORM_TYPES.signup,
  AUTH_FORM_TYPES.forgotPassword,
  AUTH_FORM_TYPES.resetPassword,
];

/** Supabase minimum; used for signup validation. */
export const MIN_AUTH_PASSWORD_LENGTH = 6;
