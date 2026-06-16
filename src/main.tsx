import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { getStoredThemePreference } from "@/features/admin-shell/utils/themePreferenceStorage";

import App from "./app/App";
import "./index.css";

const storedTheme = getStoredThemePreference();
if (storedTheme === "dark") {
  document.body.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
