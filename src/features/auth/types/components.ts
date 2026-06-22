export type AuthGoogleSignInProps = {
  disabled?: boolean;
  onError: (message: string) => void;
  onBeforeSignIn?: () => void;
};

export type AuthEmailFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoComplete?: "email";
};

export type AuthPasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoComplete: string;
  placeholder: string;
};

export type AuthFormAlertProps = {
  message: string;
  variant: "error" | "success";
};

export type AdminAccessRouteProps = {
  module: "posts-management" | "projects-management" | "clients-management" | "team-management" | "analytics" | "reports" | "settings" | "account" | "dashboard";
};