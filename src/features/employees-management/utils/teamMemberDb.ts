import type { EmployeeRole } from "@/features/employees-management/constants/employeeRoles";
import type {
  ClientMemberAssignmentMember,
  TeamMember,
} from "@/features/employees-management/types/types";
import { supabase } from "@/shared/lib/supabase";

type DbSchema = {
  membersTable: "employees" | "team_members";
  memberNameColumn: "employee_name" | "member_name";
  assignmentsTable: "employee_assignments" | "member_assignments";
  memberIdColumn: "employee_id" | "member_id";
  memberEmbedKey: "employees" | "team_members";
};

let cachedSchema: DbSchema | null = null;

function isMissingRelation(
  error: { code?: string; message?: string } | null,
  relation: string,
) {
  if (!error) {
    return false;
  }

  const message = error.message?.toLowerCase() ?? "";

  return (
    message.includes(relation.toLowerCase()) &&
    (message.includes("does not exist") ||
      message.includes("could not find") ||
      error.code === "42P01" ||
      error.code === "PGRST205")
  );
}

export async function resolveTeamMemberDbSchema(): Promise<DbSchema> {
  if (cachedSchema) {
    return cachedSchema;
  }

  const probe = await supabase.from("team_members").select("id").limit(1);

  if (!isMissingRelation(probe.error, "team_members")) {
    cachedSchema = {
      membersTable: "team_members",
      memberNameColumn: "member_name",
      assignmentsTable: "member_assignments",
      memberIdColumn: "member_id",
      memberEmbedKey: "team_members",
    };
    return cachedSchema;
  }

  cachedSchema = {
    membersTable: "employees",
    memberNameColumn: "employee_name",
    assignmentsTable: "employee_assignments",
    memberIdColumn: "employee_id",
    memberEmbedKey: "employees",
  };

  return cachedSchema;
}

type DbMemberRow = {
  id: string;
  email: string;
  mobile_number: string | null;
  role: EmployeeRole;
  created_at: string;
  updated_at: string;
  employee_name?: string;
  member_name?: string;
};

export function mapDbRowToTeamMember(
  row: DbMemberRow,
  nameColumn: DbSchema["memberNameColumn"],
): TeamMember {
  const memberName =
    nameColumn === "member_name"
      ? (row.member_name ?? row.employee_name ?? "")
      : (row.employee_name ?? row.member_name ?? "");

  return {
    id: row.id,
    member_name: memberName,
    email: row.email,
    mobile_number: row.mobile_number,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function mapDbMemberEmbed(
  embed: unknown,
  nameColumn: DbSchema["memberNameColumn"],
): ClientMemberAssignmentMember | null {
  const member = Array.isArray(embed) ? embed[0] : embed;

  if (!member || typeof member !== "object") {
    return null;
  }

  const row = member as DbMemberRow;

  return {
    id: row.id,
    member_name: mapDbRowToTeamMember(row, nameColumn).member_name,
    email: row.email,
    role: row.role,
  };
}

export function readMemberId(
  row: Record<string, unknown>,
  memberIdColumn: DbSchema["memberIdColumn"],
): string {
  const value = row[memberIdColumn];

  if (typeof value === "string") {
    return value;
  }

  const fallback = row.member_id ?? row.employee_id;
  return typeof fallback === "string" ? fallback : "";
}
