export function getTeamMemberInitials(memberName: string): string {
  const parts = memberName.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
  }

  return memberName.slice(0, 2).toUpperCase() || "?";
}

export function orderTeamMembersByIds<T extends { id: string }>(
  members: T[],
  memberIds: string[],
): T[] {
  const byId = new Map(members.map((member) => [member.id, member]));

  return memberIds.flatMap((id) => {
    const member = byId.get(id);
    return member ? [member] : [];
  });
}
