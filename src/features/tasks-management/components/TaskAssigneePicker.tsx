import { Building2, ChevronDown, Loader2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";

import type { TaskAssigneePickerProps } from "@/features/tasks-management/types/components";
import {
  encodeTaskAssignee,
  parseTaskAssignee,
} from "@/features/tasks-management/utils/taskAssigneeUtils";
import { fetchClients } from "@/services/clientsService";
import { fetchTeamMembers } from "@/services/teamMembersService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/shared/ui/popover";

type AssigneeOption = {
  value: string;
  label: string;
  kind: "team" | "client";
};

const inputClassName = cn(
  "w-full cursor-text rounded-lg border border-ring/60 bg-background py-2 pl-3 pr-10 text-sm text-foreground shadow-xs outline-none transition-colors",
  "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
  "dark:border-input dark:bg-muted/40",
);

export function TaskAssigneePicker({
  value,
  onChange,
  allowedMemberIds,
  allowedClientId,
  disabled = false,
  preload = false,
}: TaskAssigneePickerProps) {
  const {
    items: members,
    isLoading: membersLoading,
    handleOpenChange: onMembersOpen,
  } = useLazyEntityList(fetchTeamMembers, { preload });
  const {
    items: clients,
    isLoading: clientsLoading,
    handleOpenChange: onClientsOpen,
  } = useLazyEntityList(fetchClients, { preload });

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const isLoading = membersLoading || clientsLoading;
  const hasProject = allowedMemberIds !== null;

  const options = useMemo((): AssigneeOption[] => {
    if (!hasProject) {
      return [];
    }

    const memberIdSet = new Set(allowedMemberIds);
    const selected = parseTaskAssignee(value);
    if (selected?.kind === "team") {
      memberIdSet.add(selected.id);
    }

    const teamOptions = members
      .filter((member) => memberIdSet.has(member.id))
      .map((member) => ({
        value: encodeTaskAssignee("team", member.id),
        label: member.member_name,
        kind: "team" as const,
      }));

    const clientIds = new Set<string>();
    if (allowedClientId) {
      clientIds.add(allowedClientId);
    }
    if (selected?.kind === "client") {
      clientIds.add(selected.id);
    }

    const clientOptions = clients
      .filter((client) => client.is_active && clientIds.has(client.id))
      .map((client) => ({
        value: encodeTaskAssignee("client", client.id),
        label: client.client_name,
        kind: "client" as const,
      }));

    return [...teamOptions, ...clientOptions];
  }, [allowedClientId, allowedMemberIds, clients, hasProject, members, value]);

  const selected = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(search),
    );
  }, [options, query]);

  const teamFiltered = filtered.filter((option) => option.kind === "team");
  const clientFiltered = filtered.filter((option) => option.kind === "client");

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !open) setQuery("");
    setOpen(nextOpen);
    onMembersOpen(nextOpen);
    onClientsOpen(nextOpen);
  };

  const selectOption = (option: AssigneeOption) => {
    onChange(option.value);
    setQuery(option.label);
    handleOpenChange(false);
  };

  const inputValue = open ? query : (selected?.label ?? query);
  const parsed = parseTaskAssignee(value);
  const emptyMessage = !hasProject
    ? "Select a project first."
    : "No matching project teammates or client.";

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <input
            value={inputValue}
            onChange={(event) => {
              setQuery(event.target.value);
              onChange("");
              handleOpenChange(true);
            }}
            onFocus={() => handleOpenChange(true)}
            placeholder={
              hasProject
                ? "Assign to project teammate or client"
                : "Select a project first"
            }
            disabled={disabled || !hasProject}
            className={inputClassName}
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled || !hasProject}
            onClick={() => handleOpenChange(!open)}
            className="absolute top-0 right-0 flex h-full w-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none"
          >
            <ChevronDown
              className={cn(
                "size-4 opacity-50 transition-transform",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        side="bottom"
        className="z-100 flex max-h-80 w-(--radix-popover-trigger-width) flex-col gap-0 overflow-hidden p-0 shadow-2xl"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onWheel={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-border px-4 py-2.5">
          <p className="text-xs font-semibold text-muted-foreground">
            Assign to
            {parsed ? (
              <span className="ml-2 font-normal">
                · {parsed.kind === "team" ? "Teammate" : "Client"}
              </span>
            ) : null}
          </p>
        </div>
        <div
          role="listbox"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
          onWheel={(event) => event.stopPropagation()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {teamFiltered.length > 0 ? (
                <div>
                  <p className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Team members
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {teamFiltered.map((option) => (
                      <AssigneeRow
                        key={option.value}
                        option={option}
                        isSelected={option.value === value}
                        onSelect={selectOption}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              {clientFiltered.length > 0 ? (
                <div>
                  <p className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Client
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {clientFiltered.map((option) => (
                      <AssigneeRow
                        key={option.value}
                        option={option}
                        isSelected={option.value === value}
                        onSelect={selectOption}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AssigneeRow({
  option,
  isSelected,
  onSelect,
}: {
  option: AssigneeOption;
  isSelected: boolean;
  onSelect: (option: AssigneeOption) => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(option)}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
        "hover:bg-secondary hover:text-secondary-foreground",
        isSelected &&
          "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary",
      )}
    >
      {option.kind === "team" ? (
        <UserRound className="size-3.5 shrink-0 opacity-70" />
      ) : (
        <Building2 className="size-3.5 shrink-0 opacity-70" />
      )}
      <span className="min-w-0 flex-1 truncate">{option.label}</span>
      <span
        className={cn(
          "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
          isSelected
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        {option.kind === "team" ? "Team" : "Client"}
      </span>
    </button>
  );
}
