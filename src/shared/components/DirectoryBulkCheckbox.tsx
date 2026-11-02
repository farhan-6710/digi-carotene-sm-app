import type { DirectoryBulkCheckboxProps } from "@/shared/types/components";
import { stopDirectoryRowNav } from "@/shared/utils/directoryTableRow";
import { Checkbox } from "@/shared/ui/checkbox";

export function DirectoryBulkCheckbox({
  checked,
  onCheckedChange,
  ariaLabel,
  disabled = false,
}: DirectoryBulkCheckboxProps) {
  return (
    <div
      className="flex items-center justify-center"
      onClick={stopDirectoryRowNav}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onCheckedChange={() => onCheckedChange()}
      />
    </div>
  );
}
