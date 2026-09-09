import { useRouteError } from "react-router";

import { Button } from "@/shared/ui/button";

export function RouteErrorPage() {
  const error = useRouteError();
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong loading this page.";

  const isChunkError =
    typeof message === "string" &&
    (message.includes("Failed to fetch dynamically imported module") ||
      message.includes("Importing a module script failed"));

  return (
    <section className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          {isChunkError ? "Page failed to load" : "Unexpected error"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isChunkError
            ? "The dev server may be out of date after recent changes. Refresh the page or restart `bun run dev`."
            : message}
        </p>
      </div>
      <Button type="button" onClick={() => window.location.reload()}>
        Refresh page
      </Button>
    </section>
  );
}
