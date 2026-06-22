import { PortalPostsTableRow } from "@/features/portal/components/PortalPostsTableRow";
import { portalPostsDirectoryConfig } from "@/features/portal/constants/postsDirectory";
import type { PortalPostsTableProps } from "@/features/portal/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function PortalPostsTable({ posts, isLoading }: PortalPostsTableProps) {
  return (
    <DirectoryTable
      title={portalPostsDirectoryConfig.title}
      description={portalPostsDirectoryConfig.description}
      gridClass={portalPostsDirectoryConfig.gridClass}
      columns={portalPostsDirectoryConfig.columns}
      emptyMessage={portalPostsDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={posts.length === 0}
    >
      {posts.map((post) => (
        <PortalPostsTableRow key={post.id} post={post} />
      ))}
    </DirectoryTable>
  );
}
