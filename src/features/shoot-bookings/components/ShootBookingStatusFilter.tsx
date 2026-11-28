import { shootBookingStatusFilterOptions } from "@/features/shoot-bookings/constants/shootBookings";
import type { ShootBookingStatusFilterProps } from "@/features/shoot-bookings/types/components";
import type { ShootBookingStatusFilter as StatusFilter } from "@/features/shoot-bookings/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export function ShootBookingStatusFilter({
  value,
  onChange,
  disabled = false,
}: ShootBookingStatusFilterProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next as StatusFilter)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full sm:w-[160px]" aria-label="Filter by status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {shootBookingStatusFilterOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
