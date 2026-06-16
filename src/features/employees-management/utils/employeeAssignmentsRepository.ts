import type {
  ClientMemberAssignment,
  MemberAssignment,
} from "@/features/employees-management/types/types";
import {
  mapDbMemberEmbed,
  readMemberId,
  resolveTeamMemberDbSchema,
} from "@/features/employees-management/utils/teamMemberDb";
import { supabase } from "@/shared/lib/supabase";

function buildAssignmentSelect(
  memberIdColumn: "employee_id" | "member_id",
) {
  return `
    id,
    ${memberIdColumn},
    client_id,
    started_at,
    ended_at,
    created_at,
    updated_at,
    clients (
      id,
      client_name,
      mobile_number,
      website_name
    )
  `;
}

function buildClientAssignmentSelect(
  memberIdColumn: "employee_id" | "member_id",
  memberEmbedKey: "employees" | "team_members",
  memberNameColumn: "employee_name" | "member_name",
) {
  return `
    id,
    ${memberIdColumn},
    client_id,
    started_at,
    ended_at,
    created_at,
    updated_at,
    ${memberEmbedKey} (
      id,
      ${memberNameColumn},
      email,
      role
    )
  `;
}

type AssignmentRow = Record<string, unknown> & {
  id: string;
  client_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
  clients: MemberAssignment["clients"] | MemberAssignment["clients"][];
};

function normalizeAssignment(
  row: AssignmentRow,
  memberIdColumn: "employee_id" | "member_id",
): MemberAssignment {
  const client = Array.isArray(row.clients) ? row.clients[0] ?? null : row.clients;

  return {
    id: row.id,
    member_id: readMemberId(row, memberIdColumn),
    client_id: row.client_id,
    started_at: row.started_at,
    ended_at: row.ended_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    clients: client,
  };
}

function formatAssignmentError(error: { code?: string; message?: string }): Error {
  if (error.code === "23505") {
    return new Error("This client is already actively assigned to this team member.");
  }

  return new Error(error.message ?? "Failed to save assignment.");
}

export async function fetchMemberAssignments(
  memberId: string,
): Promise<MemberAssignment[]> {
  const schema = await resolveTeamMemberDbSchema();

  const { data, error } = await supabase
    .from(schema.assignmentsTable)
    .select(buildAssignmentSelect(schema.memberIdColumn))
    .eq(schema.memberIdColumn, memberId)
    .order("started_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    normalizeAssignment(row as unknown as AssignmentRow, schema.memberIdColumn),
  );
}

export async function assignClientToMember(
  memberId: string,
  clientId: string,
): Promise<MemberAssignment> {
  const schema = await resolveTeamMemberDbSchema();

  const { data, error } = await supabase
    .from(schema.assignmentsTable)
    .insert({
      [schema.memberIdColumn]: memberId,
      client_id: clientId,
    })
    .select(buildAssignmentSelect(schema.memberIdColumn))
    .single();

  if (error) {
    throw formatAssignmentError(error);
  }

  return normalizeAssignment(data as unknown as AssignmentRow, schema.memberIdColumn);
}

export async function endMemberAssignment(assignmentId: string): Promise<void> {
  const schema = await resolveTeamMemberDbSchema();

  const { error } = await supabase
    .from(schema.assignmentsTable)
    .update({ ended_at: new Date().toISOString() })
    .eq("id", assignmentId)
    .is("ended_at", null);

  if (error) {
    throw new Error(error.message ?? "Failed to end assignment.");
  }
}

type ClientAssignmentRow = Record<string, unknown> & {
  id: string;
  client_id: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
};

function normalizeClientAssignment(
  row: ClientAssignmentRow,
  memberIdColumn: "employee_id" | "member_id",
  memberEmbedKey: "employees" | "team_members",
  memberNameColumn: "employee_name" | "member_name",
): ClientMemberAssignment {
  return {
    id: row.id,
    member_id: readMemberId(row, memberIdColumn),
    client_id: row.client_id,
    started_at: row.started_at,
    ended_at: row.ended_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    team_members: mapDbMemberEmbed(row[memberEmbedKey], memberNameColumn),
  };
}

export async function fetchClientAssignments(
  clientId: string,
): Promise<ClientMemberAssignment[]> {
  const schema = await resolveTeamMemberDbSchema();

  const { data, error } = await supabase
    .from(schema.assignmentsTable)
    .select(
      buildClientAssignmentSelect(
        schema.memberIdColumn,
        schema.memberEmbedKey,
        schema.memberNameColumn,
      ),
    )
    .eq("client_id", clientId)
    .order("started_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) =>
    normalizeClientAssignment(
      row as unknown as ClientAssignmentRow,
      schema.memberIdColumn,
      schema.memberEmbedKey,
      schema.memberNameColumn,
    ),
  );
}
