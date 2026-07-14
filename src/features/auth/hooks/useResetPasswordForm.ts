import { useCallback, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { ACCOUNT_PASSWORD_MIN_LENGTH } from "@/shared/constants/accountPassword";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { updatePassword } from "@/services/authService";
import { showToast } from "@/shared/utils/showToast";

export function useResetPasswordForm() {
  const { homePath, clearPasswordRecovery } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);

      if (password.length < ACCOUNT_PASSWORD_MIN_LENGTH) {
        setError(
          `Password must be at least ${ACCOUNT_PASSWORD_MIN_LENGTH} characters.`,
        );
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }

      setIsSubmitting(true);
      const authError = await updatePassword(password);
      setIsSubmitting(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      clearPasswordRecovery();
      showToast("success", "Password updated. You can sign in with your new password.");
      navigate(homePath, { replace: true });
    },
    [password, confirm, clearPasswordRecovery, homePath, navigate],
  );

  return {
    password,
    setPassword,
    confirm,
    setConfirm,
    error,
    isSubmitting,
    handleSubmit,
  };
}
