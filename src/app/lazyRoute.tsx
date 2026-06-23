import { lazy, Suspense, type ComponentType } from "react";

import { CenteredLoading } from "@/shared/components/LoadingSpinner";

export function lazyRoutePage(
  loader: () => Promise<Record<string, ComponentType>>,
  exportName: string,
) {
  const LazyPage = lazy(() =>
    loader().then((module) => {
      const component = module[exportName];
      if (!component) {
        throw new Error(`Missing export "${exportName}" in lazy route module.`);
      }
      return { default: component };
    }),
  );

  return function LazyRoutePage() {
    return (
      <Suspense fallback={<CenteredLoading />}>
        <LazyPage />
      </Suspense>
    );
  };
}
