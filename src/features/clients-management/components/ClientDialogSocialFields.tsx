import { formFieldClassName } from "@/features/clients-management/constants/formStyles";
import type { ClientDialogSocialFieldsProps } from "@/features/clients-management/types/components";

const socialFields = [
  { field: "facebook" as const, label: "Facebook URL", placeholder: "e.g. facebook.com/bloom" },
  { field: "instagram" as const, label: "Instagram URL", placeholder: "e.g. instagram.com/bloom" },
  { field: "linkedin" as const, label: "LinkedIn URL", placeholder: "e.g. linkedin.com/company/bloom" },
  { field: "youtube" as const, label: "YouTube URL", placeholder: "e.g. youtube.com/@bloom" },
];

export function ClientDialogSocialFields({
  values,
  onFieldChange,
  disabled = false,
}: ClientDialogSocialFieldsProps) {
  return (
    <div className="border-t border-border/60 pt-4">
      <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Social Profiles
      </span>
      <div className="grid gap-4 sm:grid-cols-2">
        {socialFields.map(({ field, label, placeholder }) => (
          <label
            key={field}
            className="block text-xs font-semibold text-muted-foreground"
          >
            {label}
            <input
              value={values[field]}
              onChange={(event) => onFieldChange(field, event.target.value)}
              placeholder={placeholder}
              className={formFieldClassName}
              disabled={disabled}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
