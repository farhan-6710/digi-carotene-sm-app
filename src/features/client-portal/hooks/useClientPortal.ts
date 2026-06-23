import { useContext } from "react";

import { ClientPortalContext } from "@/features/client-portal/providers/clientPortalContext";

export function useClientPortal() {
  const context = useContext(ClientPortalContext);
  if (!context) {
    throw new Error("useClientPortal must be used within ClientPortalProvider");
  }
  return context;
}
