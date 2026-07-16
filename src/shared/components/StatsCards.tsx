import { ArrowUpRight, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { Sparkline } from "@/shared/components/Sparkline";
import { StatCardTrend } from "@/shared/components/StatCardTrend";
import type { StatsCardsProps } from "@/shared/types/components";
import type { StatCardItem } from "@/shared/types/statsCards";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

function StatCardShell({
  href,
  children,
  glowBg = "primary",
}: {
  href?: string;
  children: ReactNode;
  glowBg?: "primary" | "accent";
}) {
  const className = cn(
    "group relative block h-full rounded-2xl border border-border bg-card p-6 shadow-xs transition",
    glowBg === "primary"
      ? "border-primary/40 bg-glow-bg-primary"
      : "border-accent/40 bg-glow-bg-accent",
  );

  if (href) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}

function StatCardContent({
  card,
  idx,
  isLoading,
}: {
  card: StatCardItem;
  idx: number;
  isLoading: boolean;
}) {
  const Icon = card.icon;
  const body = (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {card.label}
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          {isLoading ? (
            <div className="py-1.5">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {card.value}
            </span>
          )}
        </div>
        {card.description ? (
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {card.description}
          </p>
        ) : null}
        {card.delta && card.deltaLabel && !isLoading ? (
          <StatCardTrend
            delta={card.delta}
            deltaLabel={card.deltaLabel}
            trend={card.trend}
          />
        ) : null}
      </div>
      <div className="flex h-16 shrink-0 flex-col items-end justify-between">
        <Icon
          className={cn(
            "size-5 text-muted-foreground transition-colors",
            idx % 2 === 0 ? "text-primary" : "text-accent",
          )}
        />
        {card.sparklineData ? (
          <Sparkline
            data={card.sparklineData}
            color={card.sparklineColor ?? "var(--primary)"}
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {card.descriptionTooltip && !isLoading ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full cursor-default text-left">{body}</div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="max-w-xs whitespace-pre-line"
          >
            {card.descriptionTooltip}
          </TooltipContent>
        </Tooltip>
      ) : (
        body
      )}
      {card.href ? (
        <div className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="size-4 text-primary" />
        </div>
      ) : null}
    </>
  );
}

export function StatsCards({ cards, isLoading = false }: StatsCardsProps) {
  if (isLoading && cards.length === 0) {
    return (
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-[140px] items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-xs"
          >
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <StatCardShell
            key={card.id}
            href={card.href}
            glowBg={idx % 2 === 0 ? "primary" : "accent"}
          >
            <StatCardContent card={card} idx={idx} isLoading={isLoading} />
          </StatCardShell>
        ))}
      </div>
    </TooltipProvider>
  );
}
