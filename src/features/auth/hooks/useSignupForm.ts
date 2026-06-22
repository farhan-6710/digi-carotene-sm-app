import { useCallback, useState, type FormEvent } from "react";

import { useAuth } from "@/features/auth/providers/AuthProvider";

type UseSignupFormOptions = {
  signupAsStaff?: boolean;
};

export function useSignupForm({ signupAsStaff = false }: UseSignupFormOptions = {}) {
  const { signUpWithEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      setIsSubmitting(true);

      const authError = await signUpWithEmail(email.trim(), password, name.trim(), {
        signupAsStaff,
      });
      if (authError) {
        setError(authError.message);
      } else {
        setSuccessMessage(
          "Account created. Check your email to confirm your address, then sign in.",
        );
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }

      setIsSubmitting(false);
    },
    [confirmPassword, email, name, password, signUpWithEmail, signupAsStaff],
  );

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    successMessage,
    isSubmitting,
    isBusy: isSubmitting,
    handleSubmit,
    clearMessages,
  };
}
