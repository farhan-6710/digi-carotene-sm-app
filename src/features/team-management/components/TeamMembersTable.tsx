import { TeamMembersTableRow } from "@/features/team-management/components/TeamMembersTableRow";
import { teamDirectoryConfig } from "@/features/team-management/constants/teamDirectory";
import type { TeamMembersTableProps } from "@/features/team-management/types/components";
import { DirectoryTable } from "@/shared/components/DirectoryTable";

export function TeamMembersTable({
  members,
  isLoading,
  onEditMember,
}: TeamMembersTableProps) {
  return (
    <DirectoryTable
      title={teamDirectoryConfig.title}
      description={teamDirectoryConfig.description}
      gridClass={teamDirectoryConfig.gridClass}
      columns={teamDirectoryConfig.columns}
      emptyMessage={teamDirectoryConfig.emptyMessage}
      isLoading={isLoading}
      isEmpty={members.length === 0}
    >
      {members.map((member) => (
        <TeamMembersTableRow
          key={member.id}
          member={member}
          onEditMember={onEditMember}
        />
      ))}
    </DirectoryTable>
  );
}
