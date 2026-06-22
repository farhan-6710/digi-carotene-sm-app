import { Link } from "react-router";
import { Pencil } from "lucide-react";

import { buildClientDetailPath } from "@/features/clients-management/constants/routes";
import { CLIENTS_DIRECTORY_ROW_GRID_CLASS } from "@/features/clients-management/constants/clientsDirectory";
import type { ClientsTableRowProps } from "@/features/clients-management/types/components";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export function ClientsTableRow({
  client,
  canEdit,
  onEditClient,
}: ClientsTableRowProps) {
  const website = client.website_name?.trim();

  return (
    <div
      className={cn(
        "grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:gap-4",
        CLIENTS_DIRECTORY_ROW_GRID_CLASS,
      )}
    >
      <div className="text-sm font-medium text-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          CLIENT NAME
        </span>
        <Link
          to={buildClientDetailPath(client.id)}
          className="text-primary hover:underline"
        >
          {client.client_name}
        </Link>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          MOBILE NUMBER
        </span>
        {client.mobile_number || <span className="text-muted-foreground/50">—</span>}
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
          WEBSITE
        </span>
        {website ? (
          <a
            href={website.startsWith("http") ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {website}
          </a>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </div>

      <div className="flex justify-end gap-2 text-right">
        {canEdit ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => onEditClient(client)}
          >
            <Pencil className="size-3.5" />
            <span className="sr-only">Edit Client</span>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
