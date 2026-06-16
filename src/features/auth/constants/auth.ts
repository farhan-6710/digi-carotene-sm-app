export const AUTH_FORM_TYPE_PARAM = "form-type";
export const AUTH_SIGNUP_CODE_PARAM = "code";

export const AUTH_FORM_TYPES = {
  login: "login",
  signup: "signup",
} as const;

export type AuthFormType =
  (typeof AUTH_FORM_TYPES)[keyof typeof AUTH_FORM_TYPES];

export const SIGNUP_INVITE_CODE = "Digicarotene@2";

export function isValidSignupInviteCode(code: string | null): boolean {
  return code === SIGNUP_INVITE_CODE;
}

export function resolveAuthFormType(
  formType: string | null,
  code: string | null,
): AuthFormType {
  if (
    formType === AUTH_FORM_TYPES.signup &&
    isValidSignupInviteCode(code)
  ) {
    return AUTH_FORM_TYPES.signup;
  }

  return AUTH_FORM_TYPES.login;
}
