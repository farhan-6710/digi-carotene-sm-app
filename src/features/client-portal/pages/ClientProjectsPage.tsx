import { useMemo, useState } from "react";

import { ClientProjectsTable } from "@/features/client-portal/components/ClientProjectsTable";
import { buildClientPortalProjectRows } from "@/features/client-portal/constants/projectsDirectory";
import {
  buildClientDevProjectDetailPath,
  buildClientProjectDetailPath,
} from "@/features/client-portal/constants/routes";
import { useClientPortal } from "@/features/client-portal/hooks/useClientPortal";
import { PageShell } from "@/shared/components/PageShell";
import { matchesListingSearch } from "@/shared/utils/listingSearch";
import { projectKindLabel } from "@/features/projects-management/utils/projectKindUtils";

export function ClientProjectsPage() {
  const { projects, devProjects, loading, error } = useClientPortal();
  const [searchQuery, setSearchQuery] = useState("");

  const rows = useMemo(
    () =>
      buildClientPortalProjectRows(
        projects,
        buildClientProjectDetailPath,
        devProjects,
        buildClientDevProjectDetailPath,
      ),
    [devProjects, projects],
  );

  const filteredProjects = useMemo(
    () =>
      rows.filter((project) =>
        matchesListingSearch(searchQuery, [
          project.project_name,
          project.manager_name,
          projectKindLabel(project.project_kind),
        ]),
      ),
    [rows, searchQuery],
  );

  return (
    <PageShell
      heading="Projects"
      description="View-only list of your brand’s social media and development projects."
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
