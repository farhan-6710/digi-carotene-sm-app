import { useMemo, useState } from "react";
import { ChevronDown, Loader2, Plus, Search } from "lucide-react";

import { TeamMyTodoItem } from "@/features/team-portal/components/TeamMyTodoItem";
import { TeamTodoDialog } from "@/features/team-portal/components/TeamTodoDialog";
import { teamTodosCardConfig } from "@/features/team-portal/constants/teamTodosDirectory";
import { useTeamTodoDialog } from "@/features/team-portal/hooks/useTeamTodoDialog";
import { useTeamTodosQuery } from "@/features/team-portal/hooks/useTeamTodosQuery";
import type { TeamTodo } from "@/features/team-portal/types/types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { cn } from "@/shared/lib/utils";

type TeamTodosPanelProps = {
  /** Scroll area max-height class (e.g. dashboard card vs sheet). */
  listClassName?: string;
  /** Hide the title row when the parent already provides one (e.g. SheetHeader). */
  hideHeading?: boolean;
};

function TodoList({
  todos,
  isSaving,
  onEdit,
  onDelete,
}: {
  todos: TeamTodo[];
  isSaving: boolean;
  onEdit: (todo: TeamTodo) => void;
  onDelete: (todoId: string) => Promise<void>;
}) {
  return (
    <div className="divide-y divide-border">
      {todos.map((todo) => (
        <TeamMyTodoItem
          key={todo.id}
          todo={todo}
          isSaving={isSaving}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

/** Shared to-do list + add/edit/delete — used on dashboard and header Sheet. */
export function TeamTodosPanel({
  listClassName,
  hideHeading = false,
}: TeamTodosPanelProps) {
  const { todos, isLoading, setError, reload, teamMemberId } =
    useTeamTodosQuery();
  const dialog = useTeamTodoDialog({
    teamMemberId,
    reload,
    setError,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [completedOpen, setCompletedOpen] = useState(false);

  const filteredTodos = useMemo(
    () =>
      todos.filter((todo) =>
        matchesListingSearch(searchQuery, [todo.title, todo.description]),
      ),
    [searchQuery, todos],
  );

  const { openTodos, completedTodos } = useMemo(() => {
    const open: TeamTodo[] = [];
    const completed: TeamTodo[] = [];
    for (const todo of filteredTodos) {
      if (todo.status === "completed") {
        completed.push(todo);
      } else {
        open.push(todo);
      }
    }
    return { openTodos: open, completedTodos: completed };
  }, [filteredTodos]);

  // When search only hits completed items, expand that section so results are visible.
  const onlyCompletedMatch =
    openTodos.length === 0 &&
    completedTodos.length > 0 &&
    Boolean(searchQuery.trim());
  const showCompleted = completedOpen || onlyCompletedMatch;

  const hasAny = filteredTodos.length > 0;

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            "flex items-start justify-between gap-3",
            hideHeading && "pt-1",
          )}
        >
          {hideHeading ? (
            <div className="min-w-0 flex-1" />
          ) : (
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground">
                {teamTodosCardConfig.title}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {teamTodosCardConfig.description}
              </p>
            </div>
          )}
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
        ) : !hasAny ? (
          <p className="mt-4 py-6 text-center text-sm text-muted-foreground">
            {searchQuery.trim()
              ? teamTodosCardConfig.searchEmptyMessage
              : teamTodosCardConfig.emptyMessage}
          </p>
        ) : (
          <div
            className={cn(
              "mt-3 overflow-y-auto pr-1",
              listClassName,
            )}
          >
            {openTodos.length > 0 ? (
              <TodoList
                todos={openTodos}
                isSaving={dialog.isSaving}
                onEdit={dialog.openEditDialog}
                onDelete={dialog.removeTodo}
              />
            ) : (
              <p className="px-1 py-4 text-center text-sm text-muted-foreground">
                {teamTodosCardConfig.openEmptyWithCompletedMessage}
              </p>
            )}

            {completedTodos.length > 0 ? (
              <div
                className={cn(
                  openTodos.length > 0 && "mt-1 border-t border-border pt-1",
                )}
              >
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-1 py-2.5 text-left",
                    "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                    "transition-colors hover:bg-muted/40 hover:text-foreground",
                  )}
                  aria-expanded={showCompleted}
                  onClick={() => setCompletedOpen((open) => !open)}
                >
                  <ChevronDown
                    className={cn(
                      "size-3.5 shrink-0 transition-transform",
                      !showCompleted && "-rotate-90",
                    )}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {teamTodosCardConfig.completedSectionLabel}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground normal-case tracking-normal">
                    {completedTodos.length}
                  </span>
                </button>

                {showCompleted ? (
                  <TodoList
                    todos={completedTodos}
                    isSaving={dialog.isSaving}
                    onEdit={dialog.openEditDialog}
                    onDelete={dialog.removeTodo}
                  />
                ) : null}
              </div>
            ) : null}
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
