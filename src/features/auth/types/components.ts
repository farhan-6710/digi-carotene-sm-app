export type AuthGoogleSignInProps = {
  disabled?: boolean;
  onError: (message: string) => void;
  onBeforeSignIn?: () => void;
};
