import { Outlet } from "react-router";

export function ShareLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="border-b border-border px-4 py-3 sm:px-6">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Shared view
        </p>
        <p className="text-sm font-medium">Digi Carotene</p>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
