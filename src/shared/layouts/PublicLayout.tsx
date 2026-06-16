import { Outlet } from "react-router";
import { PublicFooter } from "@/features/public/components/PublicFooter";
import { PublicHeader } from "@/features/public/components/PublicHeader";

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
