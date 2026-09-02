import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

import { cn } from "@/shared/lib/utils";
import type { TagInputProps } from "@/shared/types/components";
import {
  isDuplicateTag,
  normalizeTagInput,
} from "@/shared/utils/tagInputUtils";

const containerClassName = cn(
  "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border border-ring/60 bg-background px-2 py-1.5 text-sm shadow-xs transition-colors",
  "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/25",
  "dark:border-input dark:bg-muted/40",
);

export function TagInput({
  id,
  value,
  onChange,
  disabled = false,
  label,
  placeholder = "Type a tag and press Enter",
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const nextTag = normalizeTagInput(raw);
    if (!nextTag || isDuplicateTag(value, nextTag)) {
      setDraft("");
      return;
    }

    onChange([...value, nextTag]);
    setDraft("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((entry) => entry !== tag));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
      return;
    }

    if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  const field = (
    <div className={cn(containerClassName, disabled && "opacity-50")}>
      {value.map((tag) => (
        <span
          key={tag}
          className="inline-flex max-w-full items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
        >
          <span className="truncate">{tag}</span>
          {!disabled ? (
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-sm text-muted-foreground transition hover:text-foreground"
              aria-label={`Remove ${tag}`}
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          ) : null}
        </span>
      ))}

      {!disabled ? (
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      ) : null}
    </div>
  );

  if (!label) {
    return field;
  }

  return (
    <label className="block text-xs font-semibold text-muted-foreground">
      {label}
      <div className="mt-2">{field}</div>
    </label>
  );
}
