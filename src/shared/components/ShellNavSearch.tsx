import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { TransitionLink } from "@/shared/components/TransitionLink";
import { shellNavIcons } from "@/shared/constants/shellNavIcons";
import { cn } from "@/shared/lib/utils";
import type { ShellNavSearchProps } from "@/shared/types/components";
import { Input } from "@/shared/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/shared/ui/popover";
import { ScrollArea } from "@/shared/ui/scroll-area";

export function ShellNavSearch({
  nav,
  placeholder = "Search navigation...",
  className,
}: ShellNavSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredNav = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return nav;
    }

    return nav.filter((item) =>
      item.label.toLowerCase().includes(normalized),
    );
  }, [nav, query]);

  const showResults = open && query.trim().length > 0;

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover open={showResults} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn("relative w-full max-w-md", className)}>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) {
                setOpen(true);
              }
            }}
            placeholder={placeholder}
            className="h-9 rounded-full border-ring/40 bg-muted/40 pl-9 shadow-none focus-visible:ring-primary/10 dark:focus-visible:ring-primary/50"
            aria-label={placeholder}
            aria-expanded={showResults}
            aria-controls="shell-nav-search-results"
            role="combobox"
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        id="shell-nav-search-results"
        align="start"
        className="w-(--radix-popover-trigger-width) gap-0 overflow-hidden p-0 shadow-lg"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <ScrollArea className="max-h-64">
          {filteredNav.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No matching pages found.
            </p>
          ) : (
            <ul className="p-1.5">
              {filteredNav.map((item) => {
                const Icon = shellNavIcons[item.icon];

                return (
                  <li key={item.to}>
                    <TransitionLink
                      to={item.to}
                      onClick={close}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
                    >
                      <Icon
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.label}</span>
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
