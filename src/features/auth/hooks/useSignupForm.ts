import { useCallback, useState, type FormEvent } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";

export function useSignupForm() {
  const { signUpWithOtp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccessMessage(null);

      if (!name.trim()) {
        setError("Name is required.");
        return;
      }

      setIsSubmitting(true);

      const authError = await signUpWithOtp(email.trim(), name.trim());
      if (authError) {
        setError(authError.message);
      } else {
        setSuccessMessage(
          "Check your email for a sign-in link to finish creating your account.",
        );
        setName("");
        setEmail("");
      }

      setIsSubmitting(false);
    },
    [email, name, signUpWithOtp],
  );

  return {
    name,
    setName,
    email,
    setEmail,
    error,
    setError,
    successMessage,
    isSubmitting,
    handleSubmit,
    clearMessages,
  };
}
