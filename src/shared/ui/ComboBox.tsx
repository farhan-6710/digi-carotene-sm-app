import { ChevronDown, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/shared/ui/popover";

export type ComboBoxOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export type ComboBoxProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboBoxOption[];
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  listTitle?: string;
  emptyMessage?: string;
  noMatchMessage?: string;
  /**
   * `text` — input value is free text; picking an option sets the label.
   * `value` — value is the selected option id; input shows the label when closed.
   */
  mode?: "text" | "value";
  onOpenChange?: (open: boolean) => void;
};

const inputClassName = cn(
  "w-full cursor-text rounded-lg border border-ring/60 bg-background py-2 pl-3 pr-10 text-sm text-foreground shadow-xs outline-none transition-colors",
  "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
  "dark:border-input dark:bg-muted/40",
);

const optionClassName = (isSelected: boolean) =>
  cn(
    "flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
    "hover:bg-secondary hover:text-secondary-foreground",
    "focus-visible:bg-secondary focus-visible:text-secondary-foreground focus-visible:outline-none",
    isSelected && "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary",
  );

export function ComboBox({
  id,
  value,
  onChange,
  options,
  isLoading = false,
  disabled = false,
  placeholder = "Search...",
  listTitle = "Select option",
  emptyMessage = "No options available.",
  noMatchMessage = "No matching options found.",
  mode = "value",
  onOpenChange,
}: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const filterText = mode === "text" ? value : query;

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(filterText.toLowerCase()),
      ),
    [filterText, options],
  );

  const inputValue =
    mode === "text"
      ? value
      : open
        ? query
        : (selectedOption?.label ?? query);

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <input
            id={id}
            value={inputValue}
            onChange={(event) => {
              const nextValue = event.target.value;

              if (mode === "text") {
                onChange(nextValue);
              } else {
                setQuery(nextValue);
                onChange("");
              }

              handleOpenChange(true);
            }}
            onFocus={() => {
              if (mode === "value") {
                setQuery(selectedOption?.label ?? query);
              }
              handleOpenChange(true);
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClassName}
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={() => handleOpenChange(!open)}
            className="absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed"
          >
            <ChevronDown
              className={cn(
                "size-4 opacity-50 transition-transform",
                open && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        side="bottom"
        className="z-100 flex max-h-80 w-(--radix-popover-trigger-width) flex-col gap-0 overflow-hidden p-0 shadow-2xl"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onWheel={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-border px-4 py-2.5">
          <p className="text-xs font-semibold text-muted-foreground">
            {listTitle}
          </p>
        </div>
        <div
          role="listbox"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
          onWheel={(event) => event.stopPropagation()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Loading...
            </div>
          ) : options.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              {emptyMessage}
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              {noMatchMessage}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filteredOptions.map((option) => {
                const isSelected =
                  mode === "text"
                    ? option.label.toLowerCase() === value.trim().toLowerCase()
                    : option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      if (mode === "text") {
                        onChange(option.label);
                      } else {
                        onChange(option.value);
                        setQuery(option.label);
                      }
                      handleOpenChange(false);
                    }}
                    className={optionClassName(isSelected)}
                  >
                    {option.icon}
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
