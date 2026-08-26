import { useMemo, useState } from "react";

import { ClientTasksTable } from "@/features/client-portal/components/ClientTasksTable";
import { useClientTasksQuery } from "@/features/client-portal/hooks/useClientTasksQuery";
import { useTaskSort } from "@/features/tasks-management/hooks/useTaskTabFilter";
import { formatAssigneeLabels } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import { sortTasks } from "@/features/tasks-management/utils/taskSortUtils";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ClientTasksPage() {
  const { tasks, isLoading, error } = useClientTasksQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const { sort, setSort } = useTaskSort();

  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const assigneeMembers = task.assignees
        .filter((row) => row.team_member)
        .map((row) => row.team_member!);
      const assigneeClients = task.assignees
        .filter((row) => row.client)
        .map((row) => row.client!);
      const assigneeLabel =
        assigneeMembers.length > 0 || assigneeClients.length > 0
          ? formatAssigneeLabels({
              members: assigneeMembers,
              clients: assigneeClients,
            })
          : (task.assigned_to?.member_name ?? task.client?.client_name ?? "");

      return matchesListingSearch(searchQuery, [
        task.title,
        task.description,
        task.projects?.project_name,
        assigneeLabel,
        task.priority,
        task.status,
        task.eta_date,
        task.eta_time,
      ]);
    });
    return sortTasks(filtered, sort);
  }, [searchQuery, sort, tasks]);

  return (
    <PageShell
      heading="Task Management"
      description="See requests from the Digi Carotene team and reply in chat."
      error={error && !isLoading ? error : null}
    >
      <ClientTasksTable
        tasks={filteredTasks}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        sort={sort}
        onSortChange={setSort}
      />
    </PageShell>
  );
}
