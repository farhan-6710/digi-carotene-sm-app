import { UserRound } from "lucide-react";
import { useMemo } from "react";

import type {
  TaskAssigneesSelectProps,
  TaskDependenciesSelectProps,
} from "@/features/tasks-management/types/components";
import {
  encodeTaskAssignee,
  parseTaskAssignee,
} from "@/features/tasks-management/utils/taskAssigneeUtils";
import { fetchClients } from "@/services/clientsService";
import { fetchTeamMembers } from "@/services/teamMembersService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { ComboBox } from "@/shared/ui/ComboBox";
import { MultiSelect } from "@/shared/ui/MultiSelect";

type TaskAssigneeSelectProps = {
  value: string;
  onChange: (memberId: string) => void;
  disabled?: boolean;
  preload?: boolean;
};

export function TaskAssigneeSelect({
  value,
  onChange,
  disabled = false,
  preload = false,
}: TaskAssigneeSelectProps) {
  const { items: members, isLoading, handleOpenChange } = useLazyEntityList(
    fetchTeamMembers,
    { preload },
  );

  const options = useMemo(
    () =>
      members.map((member) => ({
        value: member.id,
        label: member.member_name,
        icon: <UserRound className="size-3.5 opacity-70" />,
      })),
    [members],
  );

  return (
    <ComboBox
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder="Assign to"
      listTitle="Assign to teammate"
      emptyMessage="No team members found."
      noMatchMessage="No matching team members."
      mode="value"
      onOpenChange={handleOpenChange}
    />
  );
}

function usePeopleOptions(input: {
  allowedMemberIds: string[] | null;
  allowedClientId?: string | null;
  allowedClientIds?: string[];
  value: string[];
  preload: boolean;
}) {
  const {
    items: members,
    isLoading: membersLoading,
    handleOpenChange: onMembersOpen,
  } = useLazyEntityList(fetchTeamMembers, { preload: input.preload });
  const {
    items: clients,
    isLoading: clientsLoading,
    handleOpenChange: onClientsOpen,
  } = useLazyEntityList(fetchClients, { preload: input.preload });

  const hasScope = input.allowedMemberIds !== null;
  const isLoading = membersLoading || clientsLoading;

  const options = useMemo(() => {
    if (!hasScope) return [];

    const memberIdSet = new Set(input.allowedMemberIds);
    const clientIdSet = new Set<string>();
    if (input.allowedClientId) clientIdSet.add(input.allowedClientId);
    for (const id of input.allowedClientIds ?? []) {
      if (id) clientIdSet.add(id);
    }

    for (const key of input.value) {
      const parsed = parseTaskAssignee(key);
      if (!parsed) continue;
      if (parsed.kind === "team") memberIdSet.add(parsed.id);
      else clientIdSet.add(parsed.id);
    }

    const teamOptions = members
      .filter((member) => memberIdSet.has(member.id))
      .map((member) => ({
        value: encodeTaskAssignee("team", member.id),
        label: member.member_name,
      }));

    const clientOptions = clients
      .filter((client) => client.is_active && clientIdSet.has(client.id))
      .map((client) => ({
        value: encodeTaskAssignee("client", client.id),
        label: `${client.client_name} (client)`,
      }));

    return [...teamOptions, ...clientOptions];
  }, [
    clients,
    hasScope,
    input.allowedClientId,
    input.allowedClientIds,
    input.allowedMemberIds,
    input.value,
    members,
  ]);

  const handleOpenChange = (nextOpen: boolean) => {
    onMembersOpen(nextOpen);
    onClientsOpen(nextOpen);
  };

  return { options, isLoading, hasScope, handleOpenChange };
}

export function TaskAssigneesSelect({
  value,
  onChange,
  allowedMemberIds,
  allowedClientId = null,
  allowedClientIds = [],
  excludeKeys = [],
  disabled = false,
  preload = false,
}: TaskAssigneesSelectProps) {
  const { options, isLoading, hasScope, handleOpenChange } = usePeopleOptions({
    allowedMemberIds,
    allowedClientId,
    allowedClientIds,
    value,
    preload,
  });

  return (
    <MultiSelect
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled || !hasScope}
      label="Assign to"
      placeholder={
        hasScope
          ? "Add project teammates or client"
          : "Select a project first"
      }
      emptyMessage={
        hasScope
          ? "No project teammates or client available."
          : "Select a project first."
      }
      excludeValues={excludeKeys}
      onOpenChange={handleOpenChange}
    />
  );
}

export function TaskDependenciesSelect({
  value,
  onChange,
  allowedMemberIds,
  allowedClientId,
  excludeKeys = [],
  disabled = false,
  preload = false,
}: TaskDependenciesSelectProps) {
  const { options, isLoading, hasScope, handleOpenChange } = usePeopleOptions({
    allowedMemberIds,
    allowedClientId,
    value,
    preload,
  });

  const handleChange = (keys: string[]) => {
    // V1: at most one client dependency (single DB column).
    let clientKey: string | null = null;
    const teamKeys: string[] = [];
    for (const key of keys) {
      const parsed = parseTaskAssignee(key);
      if (!parsed) continue;
      if (parsed.kind === "team") {
        teamKeys.push(key);
      } else {
        clientKey = key;
      }
    }
    onChange(clientKey ? [...teamKeys, clientKey] : teamKeys);
  };

  return (
    <MultiSelect
      value={value}
      onChange={handleChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled || !hasScope}
      label="Dependencies"
      placeholder={
        hasScope
          ? "Add project teammates or client"
          : "Select a project first"
      }
      emptyMessage={
        hasScope
          ? "No project teammates or client available."
          : "Select a project first."
      }
      excludeValues={excludeKeys}
      onOpenChange={handleOpenChange}
    />
  );
}
