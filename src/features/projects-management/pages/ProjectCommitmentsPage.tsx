import { useMemo, useState } from "react";

import { ProjectCommitmentsTable } from "@/features/projects-management/components/ProjectCommitmentsTable";
import { buildProjectDetailPath } from "@/features/projects-management/constants/routes";
import { useProjectsQuery } from "@/features/projects-management/hooks/useProjectsQuery";
import { buildProjectCommitmentRows } from "@/features/projects-management/utils/projectCommitmentsUtils";
import { ActiveStatusFilter } from "@/shared/components/ActiveStatusFilter";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PageShell } from "@/shared/components/PageShell";
import type { ActiveStatusFilterId } from "@/shared/constants/activeStatusFilter";
import { PROJECT_STATUS_FILTER_OPTIONS } from "@/shared/constants/activeStatusFilter";
import { filterByActiveStatus } from "@/shared/utils/activeStatusFilterUtils";
import { matchesListingSearch } from "@/shared/utils/listingSearch";

export function ProjectCommitmentsPage() {
  const { projects, isLoading, error } = useProjectsQuery();
  const [statusFilter, setStatusFilter] =
    useState<ActiveStatusFilterId>("active");
  const [searchQuery, setSearchQuery] = useState("");

  const rows = useMemo(() => {
    const filtered = filterByActiveStatus(projects, statusFilter).filter(
      (project) =>
        matchesListingSearch(searchQuery, [
          project.project_name,
          project.clients?.client_name,
        ]),
    );
    return buildProjectCommitmentRows(filtered, buildProjectDetailPath);
  }, [projects, searchQuery, statusFilter]);

  return (
    <PageShell
      heading="Project commitments"
      description="Committed content counts across social media projects."
      error={error}
    >
      <ProjectCommitmentsTable
        rows={rows}
        isLoading={isLoading}
        showRank={false}
        emptyMessage={
          searchQuery.trim() || statusFilter !== "active"
            ? "No projects match those filters."
            : "No active projects yet."
        }
        filters={
          <>
            <ListingSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search projects"
              disabled={isLoading}
            />
            <ActiveStatusFilter
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as ActiveStatusFilterId)
              }
              options={PROJECT_STATUS_FILTER_OPTIONS}
              disabled={isLoading}
              placeholder="Filter projects"
            />
          </>
        }
      />
    </PageShell>
  );
}
