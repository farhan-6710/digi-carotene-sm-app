export type AuthOAuthSignInProps = {
  disabled?: boolean;
  isSignup?: boolean;
  onError: (message: string) => void;
  onBeforeSignIn?: () => void;
};

/** @deprecated Use AuthOAuthSignInProps */
export type AuthGoogleSignInProps = AuthOAuthSignInProps;

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
