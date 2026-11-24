import { heroDashboardMeta } from "@/features/public/constants/hero";
import { isPrimaryVariant } from "@/features/public/utils/cardVariantUtils";
import { getDashboardStatIcon } from "@/features/public/utils/publicIcons";

export function HomeHeroDashboardStats() {
  return (
    <>
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            {heroDashboardMeta.eyebrow}
          </div>
          <div className="mt-1 text-xl font-extrabold tracking-tight text-foreground">
            {heroDashboardMeta.title}
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Active
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 min-[360px]:gap-4">
        {heroDashboardMeta.stats.map((stat) => {
          const Icon = getDashboardStatIcon(stat.icon);
          const isPrimary = isPrimaryVariant(stat.color);

          return (
            <div
              key={stat.label}
              className={`rounded-xl border p-4 ${
                isPrimary
                  ? "border-primary/30 bg-primary/5"
                  : "border-accent/30 bg-accent/5"
              }`}
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  {stat.label}
                </span>
                <Icon
                  className={`size-4 ${isPrimary ? "text-primary" : "text-accent"}`}
                />
              </div>
              <div className="mt-2 text-3xl font-extrabold tracking-tight">{stat.value}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{stat.sublabel}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
