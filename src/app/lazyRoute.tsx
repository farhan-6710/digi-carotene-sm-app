import { lazy, Suspense, type ComponentType } from "react";

import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function lazyRoutePage(
  loader: () => Promise<Record<string, ComponentType>>,
  exportName: string,
) {
  const LazyPage = lazy(() =>
    loader().then((module) => ({ default: module[exportName] })),
  );

  return function LazyRoutePage() {
    return (
      <Suspense fallback={<CenteredLoading />}>
        <LazyPage />
      </Suspense>
    );
  };
}
