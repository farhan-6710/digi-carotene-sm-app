import { User } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { fetchClients } from "@/services/clientsService";
import type { ClientSelectProps } from "@/features/posts-management/types/components";
import { ComboBox } from "@/shared/ui/ComboBox";

export function ClientSelect({
    id,
    value,
    onChange,
    disabled = false,
}: ClientSelectProps) {
    const [clients, setClients] = useState<
        Awaited<ReturnType<typeof fetchClients>>
    >([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadClients = useCallback(() => {
        setIsLoading(true);
        fetchClients()
            .then(setClients)
            .catch((err) => {
                console.error("Failed to load clients in select:", err);
                setClients([]);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const options = useMemo(
        () =>
            clients.map((client) => ({
                value: client.id,
                label: client.client_name,
                icon: <User className="size-3.5 opacity-70" />,
            })),
        [clients],
    );

    return (
        <ComboBox
            id={id}
            value={value}
            onChange={onChange}
            options={options}
            isLoading={isLoading}
            disabled={disabled}
            placeholder="e.g. Bloom Skincare"
            listTitle="Select client"
            emptyMessage="No registered clients found."
            noMatchMessage="No matching clients found."
            mode="text"
            onOpenChange={(open) => {
                if (open) {
                    loadClients();
                }
            }}
        />
    );
}
