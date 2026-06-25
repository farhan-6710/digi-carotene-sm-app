export const CLIENTS_MANAGEMENT_PATH = "/team-portal/clients-management";

export function buildClientDetailPath(clientId: string): string {
  return `${CLIENTS_MANAGEMENT_PATH}/${clientId}`;
}
