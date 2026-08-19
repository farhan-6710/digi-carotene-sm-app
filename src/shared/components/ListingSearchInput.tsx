import { Search } from "lucide-react";

import { Input } from "@/shared/ui/input";

type ListingSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
};

export function ListingSearchInput({
  value,
  onChange,
  placeholder,
  disabled = false,
}: ListingSearchInputProps) {
  return (
    <div className="relative w-full sm:w-[220px]">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-9 pl-8"
        aria-label={placeholder}
      />
    </div>
  );
}
