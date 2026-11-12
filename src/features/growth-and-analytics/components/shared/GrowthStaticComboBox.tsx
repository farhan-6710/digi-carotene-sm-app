import { ComboBox } from "@/shared/ui/ComboBox";

type GrowthStaticComboBoxProps = {
  id?: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function GrowthStaticComboBox({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "Select option",
  disabled = false,
}: GrowthStaticComboBoxProps) {
  return (
    <label className="block text-xs font-semibold text-muted-foreground">
      {label}
      <div className="mt-2">
        <ComboBox
          id={id}
          value={value}
          onChange={onChange}
          options={options}
          placeholder={placeholder}
          listTitle={label}
          disabled={disabled}
          mode="value"
        />
      </div>
    </label>
  );
}
