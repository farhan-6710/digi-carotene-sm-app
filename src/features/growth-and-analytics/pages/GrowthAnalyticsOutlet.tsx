import { Outlet } from "react-router";

import { AssistantLauncher } from "../assistant/components/AssistantLauncher";

/** Wraps all Growth & Analytics routes and mounts Pulse on every page in this section. */
export function GrowthAnalyticsOutlet() {
  return (
    <>
      <Outlet />
      <AssistantLauncher />
    </>
  );
}
