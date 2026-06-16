import { User } from "lucide-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { ClientComboboxProps } from "@/features/clients-management/types/components";
import { fetchClients } from "@/features/clients-management/utils/clientsRepository";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ClientCombobox({
  value,
  onChange,
  disabled = false,
  activeClientIds = [],
  placeholder = "Search clients...",
  preload = false,
}: ClientComboboxProps) {
  const [clients, setClients] = useState<
    Awaited<ReturnType<typeof fetchClients>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadClients = useCallback(() => {
    setIsLoading(true);
    fetchClients()
      .then((data) => {
        setClients(data);
        hasLoadedRef.current = true;
      })
      .catch(() => setClients([]))
      .finally(() => setIsLoading(false));
  }, []);

  useLayoutEffect(() => {
    if (!preload) {
      hasLoadedRef.current = false;
      return;
    }

    if (!hasLoadedRef.current) {
      loadClients();
    }
  }, [loadClients, preload]);

  const options = useMemo(
    () =>
      clients
        .filter((client) => !activeClientIds.includes(client.id))
        .map((client) => ({
          value: client.id,
          label: client.client_name,
          icon: <User className="size-3.5 opacity-70" />,
        })),
    [activeClientIds, clients],
  );

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
      onOpenChange={(open) => {
        if (open && !hasLoadedRef.current) {
          loadClients();
        }
      }}
    />
  );
}
