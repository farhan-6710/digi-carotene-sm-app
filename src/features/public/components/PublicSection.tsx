import type { PublicSectionProps } from "@/features/public/types/components";
import { cn } from "@/shared/lib/utils";

export function PublicSection({
  id,
  className,
  containerClassName,
  children,
}: PublicSectionProps) {
  return (
    <section id={id} className={className}>
      <div
        className={cn("mx-auto max-w-6xl px-6 lg:px-8", containerClassName)}
      >
        {children}
      </div>
    </section>
  );
}
