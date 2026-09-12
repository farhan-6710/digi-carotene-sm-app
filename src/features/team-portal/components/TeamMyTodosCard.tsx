import { TEAM_DASHBOARD_POST_LIST_MAX_HEIGHT } from "@/features/team-portal/constants/teamDashboardPosts";
import { TeamTodosPanel } from "@/features/team-portal/components/TeamTodosPanel";

export function TeamMyTodosCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <TeamTodosPanel listClassName={TEAM_DASHBOARD_POST_LIST_MAX_HEIGHT} />
    </div>
  );
}
