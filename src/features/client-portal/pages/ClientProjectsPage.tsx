import { useMemo, useState } from "react";

import { ClientProjectsTable } from "@/features/client-portal/components/ClientProjectsTable";
import { useClientPortal } from "@/features/client-portal/hooks/useClientPortal";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ClientProjectsPage() {
  const { projects, loading, error } = useClientPortal();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        matchesListingSearch(searchQuery, [
          project.project_name,
          project.team_members?.member_name,
        ]),
      ),
    [projects, searchQuery],
  );

  return (
    <PageShell
      heading="Projects"
      description="View-only list of your brand’s projects and social profiles."
      error={error && !loading ? error : null}
    >
      <ClientProjectsTable
        projects={filteredProjects}
        isLoading={loading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />
    </PageShell>
  );
}
