export type AuthGoogleSignInProps = {
  disabled?: boolean;
  signupAsStaff?: boolean;
  onError: (message: string) => void;
  onBeforeSignIn?: () => void;
};

export type StaffAccessCodeModalProps = {
  open: boolean;
  onVerified: () => void;
};

export type SignupFormProps = {
  signupAsStaff?: boolean;
  disabled?: boolean;
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