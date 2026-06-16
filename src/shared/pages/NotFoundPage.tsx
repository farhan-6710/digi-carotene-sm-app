import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">404</h1>
        <p className="mt-1 text-muted-foreground">That route does not exist.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-muted"
        >
          Go to Home
        </Link>
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
        >
          Go to Admin Dashboard
        </Link>
      </div>
    </section>
  );
}
