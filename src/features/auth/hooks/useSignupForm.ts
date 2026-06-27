import { useCallback, useState, type FormEvent } from "react";

import { MIN_AUTH_PASSWORD_LENGTH } from "@/features/auth/constants/auth";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useSignupForm() {
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);

      if (!name.trim()) {
        setError("Name is required.");
        return;
      }

      if (password.length < MIN_AUTH_PASSWORD_LENGTH) {
        setError(`Password must be at least ${MIN_AUTH_PASSWORD_LENGTH} characters.`);
        return;
      }

      setIsSubmitting(true);

      const authError = await signUpWithEmail(
        email.trim(),
        password,
        name.trim(),
      );
      if (authError) {
        setError(authError.message);
      }

      setIsSubmitting(false);
    },
    [email, name, password, signUpWithEmail],
  );

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    isSubmitting,
    handleSubmit,
    clearError,
  };
}
