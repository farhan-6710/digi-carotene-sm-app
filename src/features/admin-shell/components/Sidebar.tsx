import type { ReactNode } from "react";

import { Link, NavLink } from "react-router";
import {
  BarChart3,
  CalendarClock,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  UserCog,
  UserRound,
  Users,
} from "lucide-react";
import {
  appMeta,
  primaryNav,
  type NavIconKey,
} from "@/features/admin-shell/constants/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/shared/ui/sheet";
import type {
  AdminMobileNavSheetProps,
  SidebarContentProps,
  SidebarProps,
} from "@/features/admin-shell/types/components";

const icons: Record<NavIconKey, (props: { className?: string }) => ReactNode> =
  {
    dashboard: (props) => <LayoutDashboard {...props} aria-hidden="true" />,
    posts: (props) => <CalendarClock {...props} aria-hidden="true" />,
    projects: (props) => <FolderKanban {...props} aria-hidden="true" />,
    clients: (props) => <Users {...props} aria-hidden="true" />,
    team: (props) => <UserCog {...props} aria-hidden="true" />,
    analytics: (props) => <BarChart3 {...props} aria-hidden="true" />,
    reports: (props) => <FileText {...props} aria-hidden="true" />,
    account: (props) => <UserRound {...props} aria-hidden="true" />,
    settings: (props) => <Settings {...props} aria-hidden="true" />,
  };

const Icon = ({ name }: { name: NavIconKey }) => {
  const Component = icons[name];
  return <Component className="size-4" />;
};

export function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center justify-center border-b border-sidebar-border/80 p-4.5"
      >
        <div
          className={
            "flex items-center justify-center " + (collapsed ? "" : "gap-3")
          }
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
            {appMeta.userInitials}
          </div>
          <div
            className={
              "text-2xl font-bold tracking-tight truncate " +
              (collapsed ? "sr-only" : "")
            }
          >
            <span className="text-primary">{appMeta.name.split(" ")[0]}</span>
            {appMeta.name.includes(" ") ? (
              <span className="text-accent truncate-ellipsis">
                {" "}
                {appMeta.name.split(" ").slice(1).join(" ")}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1.5 p-4">
        {primaryNav.map((item) => {
          const navLinkEl = (
            <NavLink
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
              <Icon name={item.icon} />
              {collapsed ? (
                <span className="sr-only">{item.label}</span>
              ) : (
                <span>{item.label}</span>
              )}
            </NavLink>
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

      {!collapsed && (
        <div className="p-4">
          <div className="rounded-2xl border border-border bg-muted/40 p-4 shadow-xs">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <p className="truncate">Quick Actions</p>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
              Review today&apos;s client posts and content schedule.
            </p>
            <Link
              to="/admin/posts-management"
              onClick={onNavigate}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:opacity-95 truncate"
            >
              View Posts
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  return (
    <TooltipProvider>
      <aside
        className={[
          "hidden h-full shrink-0 border-r border-sidebar-border/80 bg-sidebar text-sidebar-foreground md:block",
          "transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          collapsed ? "w-20" : "w-64",
        ].join(" ")}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>
    </TooltipProvider>
  );
};

export function AdminMobileNavSheet({
  open,
  onOpenChange,
}: AdminMobileNavSheetProps) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-64 max-w-[85vw] gap-0 border-sidebar-border/80 bg-sidebar p-0 text-sidebar-foreground sm:max-w-xs"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <SheetDescription className="sr-only">
          Admin navigation links and quick actions
        </SheetDescription>
        <TooltipProvider>
          <SidebarContent collapsed={false} onNavigate={close} />
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
