import {
  AUTH_FORM_TYPE_PARAM,
  AUTH_FORM_TYPES,
  AUTH_PORTAL_PARAM,
  AUTH_PORTAL_TYPES,
  type AuthFormType,
} from "@/features/auth/constants/auth";

type BuildAuthUrlOptions = {
  formType?: AuthFormType;
  staffPortal?: boolean;
};

export function buildAuthUrl({
  formType = AUTH_FORM_TYPES.login,
  staffPortal = false,
}: BuildAuthUrlOptions = {}): string {
  const params = new URLSearchParams();
  params.set(AUTH_FORM_TYPE_PARAM, formType);

  if (staffPortal) {
    params.set(AUTH_PORTAL_PARAM, AUTH_PORTAL_TYPES.staff);
  }

  return `/auth?${params.toString()}`;
}
