import { ComboBox } from "@/shared/ui/ComboBox";

type ActiveStatusFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  placeholder?: string;
};

export function ActiveStatusFilter({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Filter by status",
}: ActiveStatusFilterProps) {
  return (
    <div className="w-full sm:w-[220px]">
      <ComboBox
        value={value}
        onChange={(next) => {
          if (next) {
            onChange(next);
          }
        }}
        options={options}
        disabled={disabled}
        placeholder={placeholder}
        listTitle={placeholder}
        mode="value"
      />
    </div>
  );
}
