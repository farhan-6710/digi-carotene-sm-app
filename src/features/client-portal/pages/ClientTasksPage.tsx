import { useMemo, useState } from "react";

import { ClientTasksTable } from "@/features/client-portal/components/ClientTasksTable";
import { useClientTasksQuery } from "@/features/client-portal/hooks/useClientTasksQuery";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ClientTasksPage() {
  const { tasks, isLoading, error } = useClientTasksQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) =>
        matchesListingSearch(searchQuery, [
          task.title,
          task.description,
          task.projects?.project_name,
          task.assigned_to?.member_name,
          task.priority,
          task.status,
          task.eta_date,
          task.eta_time,
        ]),
      ),
    [searchQuery, tasks],
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
      />
    </PageShell>
  );
}
