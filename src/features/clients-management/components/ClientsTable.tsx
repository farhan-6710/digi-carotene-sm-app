import { Loader2 } from "lucide-react";

import { ClientsTableRow } from "@/features/clients-management/components/ClientsTableRow";
import type { ClientsTableProps } from "@/features/clients-management/types/components";

export function ClientsTable({
  clients,
  isLoading,
  onEditClient,
}: ClientsTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
        <div>
          <div className="text-sm font-semibold">Clients Directory</div>
          <p className="mt-1 text-xs text-muted-foreground">
            List of active clients who have posts configured in the calendar.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="grid grid-cols-[1.4fr_1fr_1.8fr_0.6fr_0.6fr] gap-4 bg-muted px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground max-sm:hidden">
          <div>CLIENT NAME</div>
          <div>MOBILE NUMBER</div>
          <div>WEBSITE</div>
          <div>SOCIALS</div>
          <div className="text-right">ACTIONS</div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center px-6 py-10">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : clients.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            No clients found. Click &quot;Add Client&quot; to register your first client.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {clients.map((client) => (
              <ClientsTableRow
                key={client.id}
                client={client}
                onEditClient={onEditClient}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
