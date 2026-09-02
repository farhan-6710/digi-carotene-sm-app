import { TeamNeedsAttentionList } from "@/features/team-portal/components/TeamNeedsAttentionList";
import type { TeamNeedsAttentionProps } from "@/features/team-portal/types/components";

export function TeamNeedsAttention({
  items,
  isLoading,
  error,
}: TeamNeedsAttentionProps) {
  return (
    <TeamNeedsAttentionList items={items} isLoading={isLoading} error={error} />
  );
}
