import { ProjectPostsTableRow } from "@/features/projects-management/components/ProjectPostsTableRow";
import { projectPostsDirectoryConfig } from "@/features/projects-management/constants/projectPostsDirectory";
import { useProjectPostsFilters } from "@/features/projects-management/hooks/useProjectPostsFilters";
import type { ProjectPostsTableProps } from "@/features/projects-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";
import { MonthSelector } from "@/shared/ui/MonthSelector";
import { PostStatusFilter } from "@/shared/ui/PostStatusFilter";

export function ProjectPostsTable({ posts, isLoading }: ProjectPostsTableProps) {
  const {
    filteredPosts,
    year,
    month,
    selectMonth,
    showAll,
    activeStatuses,
    toggleStatus,
    statusOptions,
  } = useProjectPostsFilters(posts);

  return (
    <DirectoryTable
      title={projectPostsDirectoryConfig.title}
      description={projectPostsDirectoryConfig.description}
      gridClass={projectPostsDirectoryConfig.gridClass}
      columns={projectPostsDirectoryConfig.columns}
      emptyMessage={projectPostsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={filteredPosts.length === 0}
      headerAside={
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-2">
          <PostStatusFilter
            options={statusOptions}
            showAll={showAll}
            activeStatuses={activeStatuses}
            onToggle={toggleStatus}
          />
          <MonthSelector
            year={year}
            month={month}
            onSelect={selectMonth}
            className="w-full shrink-0 sm:w-auto"
          />
        </div>
      }
    >
      {filteredPosts.map((post) => (
        <ProjectPostsTableRow key={post.id} post={post} />
      ))}
    </DirectoryTable>
  );
}
