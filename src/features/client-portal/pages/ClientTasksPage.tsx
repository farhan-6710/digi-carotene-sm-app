import { useMemo, useState } from "react";

import { ClientTasksTable } from "@/features/client-portal/components/ClientTasksTable";
import { useClientTasksQuery } from "@/features/client-portal/hooks/useClientTasksQuery";
import { useTaskEtaFilter } from "@/features/tasks-management/hooks/useTaskTabFilter";
import { formatAssigneeLabels } from "@/features/tasks-management/utils/taskAssigneeListUtils";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ClientTasksPage() {
  const { tasks, isLoading, error } = useClientTasksQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const { etaDate, setEtaDate } = useTaskEtaFilter();

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (etaDate && task.eta_date !== etaDate) {
          return false;
        }

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
      }),
    [etaDate, searchQuery, tasks],
  );

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
        etaDate={etaDate}
        onEtaDateChange={setEtaDate}
      />
    </PageShell>
  );
}
