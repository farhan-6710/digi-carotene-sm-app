import { useState } from "react";
import { ListTodo } from "lucide-react";

import { TeamTodosPanel } from "@/features/team-portal/components/TeamTodosPanel";
import { teamTodosCardConfig } from "@/features/team-portal/constants/teamTodosDirectory";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

/** Header icon — opens My To-dos in a right Sheet (any team portal page). */
export function TeamTodosHeaderButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="relative size-9 rounded-xl border border-border p-0"
        aria-label={open ? "Close to-do list" : "Open to-do list"}
        aria-pressed={open}
        onClick={() => setOpen(true)}
      >
        <ListTodo className="size-4" aria-hidden="true" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        >
          <SheetHeader className="border-b border-border pr-12">
            <SheetTitle>{teamTodosCardConfig.title}</SheetTitle>
            <SheetDescription>
              {teamTodosCardConfig.description}
            </SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4">
            <TeamTodosPanel
              hideHeading
              listClassName="max-h-[min(70vh,calc(100vh-12rem))]"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
