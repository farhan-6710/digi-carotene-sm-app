export type UserRole = "admin" | "client" | "user";

export type Profile = {
  id: string;
  role: UserRole;
  client_id: string | null;
};

export function isAdminRole(role: UserRole): boolean {
  return role === "admin" || role === "user";
}

export function isClientRole(role: UserRole): boolean {
  return role === "client";
}
