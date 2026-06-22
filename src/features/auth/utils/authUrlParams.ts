import {
  AUTH_FORM_TYPE_PARAM,
  AUTH_FORM_TYPES,
  type AuthFormType,
} from "@/features/auth/constants/auth";

export function buildAuthUrl(
  formType: AuthFormType = AUTH_FORM_TYPES.login,
): string {
  const params = new URLSearchParams();
  params.set(AUTH_FORM_TYPE_PARAM, formType);
  return `/auth?${params.toString()}`;
}
