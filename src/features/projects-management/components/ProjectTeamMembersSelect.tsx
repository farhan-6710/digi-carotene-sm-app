import { ChevronDown, Check } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import type { ProjectTeamMembersSelectProps } from "@/features/projects-management/types/components";
import { fetchTeamMembers } from "@/features/team-management/utils/teamMembersRepository";
import { Button } from "@/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { cn } from "@/shared/lib/utils";

export function ProjectTeamMembersSelect({
  value = [],
  onChange,
  excludeMemberIds = [],
  disabled = false,
}: ProjectTeamMembersSelectProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<
    Awaited<ReturnType<typeof fetchTeamMembers>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMembers = useCallback(() => {
    setIsLoading(true);
    fetchTeamMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setIsLoading(false));
  }, []);

  const availableMembers = useMemo(
    () => members.filter((member) => !excludeMemberIds.includes(member.id)),
    [excludeMemberIds, members],
  );

  const toggleMember = (memberId: string) => {
    if (value.includes(memberId)) {
      onChange(value.filter((id) => id !== memberId));
      return;
    }

    onChange([...value, memberId]);
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-muted-foreground">
        Team members
      </span>
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (nextOpen && members.length === 0) {
            loadMembers();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-auto w-full justify-between gap-2 rounded-lg border border-ring/60 bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs hover:bg-muted/50 dark:border-input dark:bg-muted/40"
          >
            <span className="flex flex-wrap items-center gap-1.5">
              {value.length === 0 ? (
                <span className="font-normal text-muted-foreground">
                  Select team members
                </span>
              ) : (
                value.map((memberId) => {
                  const member = members.find((entry) => entry.id === memberId);
                  return (
                    <span
                      key={memberId}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                    >
                      {member?.member_name ?? "Team member"}
                    </span>
                  );
                })
              )}
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 opacity-50 transition-transform",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) border-muted-foreground/10 p-2 shadow-xl"
          align="start"
        >
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">Loading...</p>
          ) : availableMembers.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No team members available.
            </p>
          ) : (
            <div className="flex max-h-56 flex-col gap-1 overflow-y-auto">
              {availableMembers.map((member) => {
                const isSelected = value.includes(member.id);

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-muted/60",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex size-4 items-center justify-center rounded border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40 bg-background",
                        )}
                      >
                        {isSelected ? (
                          <Check className="size-2.5 stroke-[3.5]" />
                        ) : null}
                      </span>
                      <span className="font-normal text-foreground">
                        {member.member_name}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
