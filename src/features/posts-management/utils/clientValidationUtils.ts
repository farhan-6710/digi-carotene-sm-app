import type { Client } from "@/features/clients-management/types/types";

export function findRegisteredClient(
  clientName: string,
  clients: Client[],
): Client | null {
  const trimmed = clientName.trim();
  if (!trimmed) {
    return null;
  }

  return (
    clients.find(
      (client) =>
        client.client_name.toLowerCase() === trimmed.toLowerCase(),
    ) ?? null
  );
}

export function isRegisteredClientName(
  clientName: string,
  clients: Client[],
): boolean {
  return findRegisteredClient(clientName, clients) !== null;
}
