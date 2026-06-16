import type { ReactNode } from "react";
import { Link } from "react-router";
import { Pencil } from "lucide-react";

import { buildClientDetailPath } from "@/features/clients-management/constants/routes";
import { ClientTableSocialIcons } from "@/features/clients-management/components/ClientTableSocialIcons";
import type { Client } from "@/features/clients-management/types/types";
import { Button } from "@/shared/ui/button";

type ClientsTableRowProps = {
  client: Client;
  onEditClient: (client: Client) => void;
};

function MobileLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground sm:hidden">
      {children}
    </span>
  );
}

export function ClientsTableRow({ client, onEditClient }: ClientsTableRowProps) {
  const website = client.website_name?.trim();

  return (
    <div className="grid items-center gap-2 px-6 py-4 transition-colors hover:bg-muted/10 sm:grid-cols-[1.4fr_1fr_1.8fr_0.6fr_0.6fr] sm:gap-4">
      <div className="text-sm font-medium text-foreground">
        <MobileLabel>CLIENT NAME</MobileLabel>
        <Link
          to={buildClientDetailPath(client.id)}
          className="text-primary hover:underline"
        >
          {client.client_name}
        </Link>
      </div>

      <div className="text-sm text-muted-foreground">
        <MobileLabel>MOBILE NUMBER</MobileLabel>
        {client.mobile_number || <span className="text-muted-foreground/50">—</span>}
      </div>

      <div className="text-sm text-muted-foreground">
        <MobileLabel>WEBSITE</MobileLabel>
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

      <div className="text-sm text-muted-foreground">
        <MobileLabel>SOCIALS</MobileLabel>
        <ClientTableSocialIcons socials={client.socials} />
      </div>

      <div className="flex justify-end gap-2 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => onEditClient(client)}
        >
          <Pencil className="size-3.5" />
          <span className="sr-only">Edit Client</span>
        </Button>
      </div>
    </div>
  );
}
