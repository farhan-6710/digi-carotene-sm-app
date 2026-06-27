import { User } from "lucide-react";
import { useMemo } from "react";

import type { ClientComboboxProps } from "@/features/clients-management/types/components";
import { fetchClients } from "@/services/clientsService";
import { useLazyEntityList } from "@/shared/hooks/useLazyEntityList";
import { mergeOptionsByValue } from "@/shared/utils/mergeOptionsByValue";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ClientCombobox({
  value,
  onChange,
  disabled = false,
  activeClientIds = [],
  placeholder = "Search clients...",
  preload = false,
  seedClient = null,
}: ClientComboboxProps) {
  const { items: clients, isLoading, handleOpenChange } = useLazyEntityList(
    fetchClients,
    { preload },
  );

  const options = useMemo(() => {
    const seedOptions =
      seedClient && seedClient.id === value
        ? [
            {
              value: seedClient.id,
              label: seedClient.client_name,
              icon: <User className="size-3.5 opacity-70" />,
            },
          ]
        : [];

    const fetchedOptions = clients
      .filter((client) => !activeClientIds.includes(client.id))
      .map((client) => ({
        value: client.id,
        label: client.client_name,
        icon: <User className="size-3.5 opacity-70" />,
      }));

    return mergeOptionsByValue(seedOptions, fetchedOptions);
  }, [activeClientIds, clients, seedClient, value]);

  return (
    <ComboBox
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      disabled={disabled}
      placeholder={placeholder}
      listTitle="Select client"
      emptyMessage="No clients left to assign."
      noMatchMessage="No matching clients found."
      mode="value"
      onOpenChange={handleOpenChange}
    />
  );
}
