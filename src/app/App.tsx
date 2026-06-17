import { RouterProvider } from "react-router";

import { AuthProvider } from "@/features/auth/providers/AuthProvider";
import { ThemeProvider } from "@/features/admin-shell/providers/ThemeProvider";
import { Toaster } from "@/shared/ui/sonner";
import { router } from "./router";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
