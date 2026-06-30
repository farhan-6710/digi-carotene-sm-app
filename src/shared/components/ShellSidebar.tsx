import { motion } from "framer-motion";

import { TransitionLink } from "@/shared/components/TransitionLink";
import { SHELL_SIDEBAR_MOTION } from "@/shared/constants/pageMotion";
import { shellNavIcons } from "@/shared/constants/shellNavIcons";
import { cn } from "@/shared/lib/utils";
import type {
  ShellMobileNavSheetProps,
  ShellSidebarContentProps,
  ShellSidebarProps,
} from "@/shared/types/components";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/shared/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

export function ShellSidebarContent({
  config,
  collapsed,
  onNavigate,
}: ShellSidebarContentProps) {
  const nameParts = config.brandName.split(" ");

  return (
    <div className="flex h-full flex-col">
      <TransitionLink
        to={config.homeLink}
        onClick={onNavigate}
        className="flex items-center justify-center border-b border-sidebar-border/80 p-4"
      >
        <div
          className={
            collapsed
              ? "flex items-center justify-center"
              : "flex items-center justify-center gap-3"
          }
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
            {config.initials}
          </div>
          <div className={collapsed ? "sr-only" : "min-w-0 text-left"}>
            <div className="text-2xl font-bold tracking-tight truncate">
              <span className="text-primary">{nameParts[0]}</span>
              {nameParts.length > 1 ? (
                <span className="text-accent">
                  {" "}
                  {nameParts.slice(1).join(" ")}
                </span>
              ) : null}
            </div>
            {config.brandSubtitle ? (
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {config.brandSubtitle}
              </p>
            ) : null}
          </div>
        </div>
      </TransitionLink>

      <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-4">
        {config.nav.map((item) => {
          const Icon = shellNavIcons[item.icon];
          const navLinkEl = (
            <TransitionLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "flex items-center rounded-2xl text-sm font-medium transition gap-3",
                  collapsed ? "justify-center px-4 py-4" : "px-6 py-3",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/75 hover:bg-secondary hover:text-secondary-foreground",
                ].join(" ")
              }
            >
              <Icon className="size-4" aria-hidden="true" />
              {collapsed ? (
                <span className="sr-only">{item.label}</span>
              ) : (
                <span>{item.label}</span>
              )}
            </TransitionLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>
                  <div className="w-full">{navLinkEl}</div>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  <p className="font-medium">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return navLinkEl;
        })}
      </nav>

      {!collapsed && config.quickAction ? (
        <div className="p-4">
          <div className="rounded-2xl border border-border bg-muted/40 p-4 shadow-xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {config.quickAction.title}
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {config.quickAction.description}
            </p>
            <TransitionLink
              to={config.quickAction.buttonTo}
              onClick={onNavigate}
              className="mt-4 inline-flex w-full items-center justify-center truncate rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:opacity-95"
            >
              {config.quickAction.buttonLabel}
            </TransitionLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const MotionAside = motion.aside;

export function ShellSidebar({ config, collapsed }: ShellSidebarProps) {
  return (
    <TooltipProvider>
      <MotionAside
        {...SHELL_SIDEBAR_MOTION}
        className={cn(
          "hidden min-h-0 shrink-0 border-r border-sidebar-border/80 bg-sidebar text-sidebar-foreground md:block",
          "transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <ShellSidebarContent config={config} collapsed={collapsed} />
      </MotionAside>
    </TooltipProvider>
  );
}

export function ShellMobileNavSheet({
  config,
  open,
  onOpenChange,
  sheetDescription,
}: ShellMobileNavSheetProps) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-64 max-w-[85vw] gap-0 border-sidebar-border/80 bg-sidebar p-0 text-sidebar-foreground sm:max-w-xs"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <SheetDescription className="sr-only">
          {sheetDescription}
        </SheetDescription>
        <TooltipProvider>
          <ShellSidebarContent
            config={config}
            collapsed={false}
            onNavigate={close}
          />
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
