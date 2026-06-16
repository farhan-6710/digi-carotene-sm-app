import { RouterProvider } from "react-router";

import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ThemePreferenceProvider } from "@/features/admin-shell/providers/ThemePreferenceProvider";
import { Toaster } from "@/shared/ui/sonner";
import { router } from "./router";

function App() {
  return (
    <AuthProvider>
      <ThemePreferenceProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </ThemePreferenceProvider>
    </AuthProvider>
  );
}

export default App;
