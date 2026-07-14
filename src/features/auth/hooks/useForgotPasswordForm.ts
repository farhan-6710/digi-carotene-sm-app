import { useCallback, useState, type FormEvent } from "react";

import { requestPasswordReset } from "@/services/authService";

export function useForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccess(null);
      setIsSubmitting(true);

      const authError = await requestPasswordReset(email);
      setIsSubmitting(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(
        "If an account exists for that email, we sent a reset link. Check your inbox.",
      );
    },
    [email],
  );

  return {
    email,
    setEmail,
    error,
    success,
    isSubmitting,
    handleSubmit,
  };
}
