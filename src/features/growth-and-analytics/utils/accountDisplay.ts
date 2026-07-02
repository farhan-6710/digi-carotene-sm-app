export function getOrganicAccountInitials(accountName: string): string {
  const parts = accountName.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
  }

  return accountName.slice(0, 2).toUpperCase() || "?";
}
