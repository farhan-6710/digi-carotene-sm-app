import { useMemo } from "react";
import { CalendarPlus } from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useClientPortal } from "@/features/client-portal/hooks/useClientPortal";
import { ShootBookingStatusFilter } from "@/features/shoot-bookings/components/ShootBookingStatusFilter";
import { ShootBookingsTable } from "@/features/shoot-bookings/components/ShootBookingsTable";
import { ShootSlotDialog } from "@/features/shoot-bookings/components/ShootSlotDialog";
import { ShootStatusConfirmModal } from "@/features/shoot-bookings/components/ShootStatusConfirmModal";
import { useShootBookingFilters } from "@/features/shoot-bookings/hooks/useShootBookingFilters";
import { useShootBookingsQuery } from "@/features/shoot-bookings/hooks/useShootBookingsQuery";
import { useShootSlotDialog } from "@/features/shoot-bookings/hooks/useShootSlotDialog";
import { useShootStatusChange } from "@/features/shoot-bookings/hooks/useShootStatusChange";
import { ListingFiltersChrome } from "@/shared/components/ListingFiltersChrome";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PageShell } from "@/shared/components/PageShell";
import { Button } from "@/shared/ui/button";

export function ClientShootBookingsPage() {
  const { clientId } = useAuth();
  const { productionPlans } = useClientPortal();
  const { bookings, isLoading, error, reload } = useShootBookingsQuery(clientId);
  const filters = useShootBookingFilters(bookings);
  const dialog = useShootSlotDialog(clientId, reload);
  const statusChange = useShootStatusChange(reload);
  const planOptions = useMemo(
    () => productionPlans.map((plan) => ({ value: plan.id, label: plan.plan_name })),
    [productionPlans],
  );

  return (
    <PageShell
      heading="Shoot Bookings"
      description="Book a date and time for your next shoot. You choose when it starts and ends."
      error={error && !isLoading ? error : null}
      actions={
        <Button onClick={dialog.openDialog} disabled={!clientId}>
          <CalendarPlus className="size-4" aria-hidden="true" />
          Book a shoot
        </Button>
      }
      dialog={
        <>
          <ShootSlotDialog
            open={dialog.open}
            onOpenChange={dialog.setOpen}
            values={dialog.values}
            onFieldChange={dialog.onFieldChange}
            startOptions={dialog.startOptions}
            endOptions={dialog.endOptions}
            busy={dialog.busy}
            planOptions={planOptions}
            isLoadingSlots={dialog.isLoadingSlots}
            slotsError={dialog.slotsError}
            isSaving={dialog.isSaving}
            onConfirm={() => void dialog.confirm()}
          />
          <ShootStatusConfirmModal
            pending={statusChange.pending}
            onOpenChange={(open) => !open && statusChange.setPending(null)}
            isSaving={statusChange.isSaving}
            onConfirm={statusChange.confirm}
          />
        </>
      }
    >
      <ShootBookingsTable
        title="Your shoots"
        description="Upcoming shoots first. Cancel any upcoming shoot to free the slot."
        bookings={filters.filtered}
        isLoading={isLoading}
        emptyMessage={
          bookings.length ? "No shoots match these filters." : "No shoots booked yet. Use Book a shoot to pick a slot."
        }
        onStatusChange={statusChange.setPending}
        filters={
          <ListingFiltersChrome
            title="Shoot filters"
            activeCount={filters.status === "all" ? 0 : 1}
            search={
              <ListingSearchInput
                value={filters.searchQuery}
                onChange={filters.setSearchQuery}
                placeholder="Search plan or notes"
                disabled={isLoading}
              />
            }
          >
            <ShootBookingStatusFilter
              value={filters.status}
              onChange={filters.setStatus}
              disabled={isLoading}
            />
          </ListingFiltersChrome>
        }
      />
    </PageShell>
  );
}
