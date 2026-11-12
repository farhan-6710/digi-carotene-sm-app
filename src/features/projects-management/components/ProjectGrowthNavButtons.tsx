import { Link } from "react-router";
import { BarChart3, Megaphone } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { ProjectGrowthNavButtonsProps } from "../types/components";

export function ProjectGrowthNavButtons({
  contentPerformanceHref,
  campaignAnalyticsHref,
}: ProjectGrowthNavButtonsProps) {
  if (!contentPerformanceHref && !campaignAnalyticsHref) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {contentPerformanceHref ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link to={contentPerformanceHref}>
            <BarChart3 className="mr-2 size-4" />
            Content Performance
          </Link>
        </Button>
      ) : null}
      {campaignAnalyticsHref ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link to={campaignAnalyticsHref}>
            <Megaphone className="mr-2 size-4" />
            Campaign Analytics
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
