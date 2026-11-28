import { ShootBookingStatusFilter } from "@/features/shoot-bookings/components/ShootBookingStatusFilter";
import { ShootBookingsTable } from "@/features/shoot-bookings/components/ShootBookingsTable";
import { ShootStatusConfirmModal } from "@/features/shoot-bookings/components/ShootStatusConfirmModal";
import { useShootBookingFilters } from "@/features/shoot-bookings/hooks/useShootBookingFilters";
import { useShootBookingsQuery } from "@/features/shoot-bookings/hooks/useShootBookingsQuery";
import { useShootStatusChange } from "@/features/shoot-bookings/hooks/useShootStatusChange";
import { ListingFiltersChrome } from "@/shared/components/ListingFiltersChrome";
import { ListingSearchInput } from "@/shared/components/ListingSearchInput";
import { PageShell } from "@/shared/components/PageShell";
import { usePermissions } from "@/shared/hooks/usePermissions";

export function ShootBookingsPage() {
  const { can } = usePermissions();
  const canManage = can("productionPlans.update");
  const { bookings, isLoading, error, reload } = useShootBookingsQuery();
  const filters = useShootBookingFilters(bookings);
  const statusChange = useShootStatusChange(reload);

  return (
    <PageShell
      heading="Shoot Bookings"
      description="Shoot slots booked by clients from their portal. Mark shoots completed or cancel them."
      error={error && !isLoading ? error : null}
      dialog={
        <ShootStatusConfirmModal
          pending={statusChange.pending}
          onOpenChange={(open) => !open && statusChange.setPending(null)}
          isSaving={statusChange.isSaving}
          onConfirm={statusChange.confirm}
        />
      }
    >
      <ShootBookingsTable
        title="All shoots"
        description="Upcoming shoots first, soonest at the top."
        bookings={filters.filtered}
        isLoading={isLoading}
        emptyMessage={bookings.length ? "No shoots match these filters." : "No shoots booked yet."}
        showClient
        canComplete={canManage}
        canCancel={canManage}
        onStatusChange={statusChange.setPending}
        filters={
          <ListingFiltersChrome
            title="Shoot filters"
            activeCount={filters.status === "all" ? 0 : 1}
            search={
              <ListingSearchInput
                value={filters.searchQuery}
                onChange={filters.setSearchQuery}
                placeholder="Search client, plan or notes"
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
