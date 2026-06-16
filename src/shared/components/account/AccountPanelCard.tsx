import type { AccountPanelCardProps } from "@/shared/components/account/types";

export function AccountPanelCard({ title, children }: AccountPanelCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
