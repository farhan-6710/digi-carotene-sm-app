import { useMemo, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";

import { TeamMyTodoItem } from "@/features/team-portal/components/TeamMyTodoItem";
import { TeamTodoDialog } from "@/features/team-portal/components/TeamTodoDialog";
import { TEAM_DASHBOARD_POST_LIST_MAX_HEIGHT } from "@/features/team-portal/constants/teamDashboardPosts";
import { teamTodosCardConfig } from "@/features/team-portal/constants/teamTodosDirectory";
import { useTeamTodoDialog } from "@/features/team-portal/hooks/useTeamTodoDialog";
import { useTeamTodosQuery } from "@/features/team-portal/hooks/useTeamTodosQuery";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { cn } from "@/shared/lib/utils";

export function TeamMyTodosCard() {
  const { todos, isLoading, setError, reload, teamMemberId } =
    useTeamTodosQuery();
  const dialog = useTeamTodoDialog({
    teamMemberId,
    reload,
    setError,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) =>
        matchesListingSearch(searchQuery, [todo.title, todo.description]),
      ),
    [searchQuery, todos],
  );

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">
              {teamTodosCardConfig.title}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {teamTodosCardConfig.description}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="shrink-0 rounded-full"
            disabled={!teamMemberId || dialog.isSaving}
            onClick={dialog.openAddDialog}
          >
            <Plus className="mr-1.5 size-3.5" />
            Add
          </Button>
        </div>

        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search to-dos"
            disabled={isLoading}
            className="h-9 pl-8"
            aria-label="Search to-dos"
          />
        </div>

        {isLoading ? (
          <div className="mt-8 flex justify-center py-6">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredTodos.length === 0 ? (
          <p className="mt-4 py-6 text-center text-sm text-muted-foreground">
            {searchQuery.trim()
              ? teamTodosCardConfig.searchEmptyMessage
              : teamTodosCardConfig.emptyMessage}
          </p>
        ) : (
          <div
            className={cn(
              "mt-3 divide-y divide-border overflow-y-auto pr-1",
              TEAM_DASHBOARD_POST_LIST_MAX_HEIGHT,
            )}
          >
            {filteredTodos.map((todo) => (
              <TeamMyTodoItem
                key={todo.id}
                todo={todo}
                isSaving={dialog.isSaving}
                onEdit={dialog.openEditDialog}
                onDelete={dialog.removeTodo}
              />
            ))}
          </div>
        )}
      </div>

      <TeamTodoDialog
        open={dialog.open}
        onOpenChange={dialog.onOpenChange}
        isEditing={dialog.isEditing}
        isSaving={dialog.isSaving}
        values={dialog.values}
        onFieldChange={dialog.onFieldChange}
        onSave={() => void dialog.onSave()}
        onDelete={dialog.onDelete}
      />
    </>
  );
}
