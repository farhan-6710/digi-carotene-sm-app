import type { ReactNode } from "react";

export type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export type PageHeaderProps = {
  heading?: string;
  description?: string;
  backButton?: ReactNode;
  actions?: ReactNode;
};

export type StatsCardsProps = {
  cards: import("@/shared/types/statsCards").StatCardItem[];
  isLoading?: boolean;
};

export type SocialPlatformButtonsProps = {
  socials: import("@/shared/constants/socialPlatforms").SocialLinkMap | null;
  className?: string;
};

export type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export type CenteredLoadingProps = {
  className?: string;
};

export type TableLoadingStateProps = {
  minHeight?: number;
};

export type ErrorBannerProps = {
  message: string;
};

export type DirectoryTableColumn = {
  label: string;
  align?: "right";
};

export type DirectoryTableProps = {
  title: string;
  description: string;
  gridClass: string;
  columns: DirectoryTableColumn[];
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
};

export type ManagementPageShellProps = {
  heading: string;
  description: string;
  actions: ReactNode;
  error: string | null;
  children: ReactNode;
  dialog: ReactNode;
};

export type ShellNavItem = {
  label: string;
  to: string;
  icon: import("@/shared/constants/shellNavIcons").ShellNavIconKey;
};

export type ShellQuickAction = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonTo: string;
};

export type ShellSidebarConfig = {
  homeLink: string;
  initials: string;
  brandName: string;
  brandSubtitle?: string;
  nav: ShellNavItem[];
  quickAction?: ShellQuickAction;
};

export type ShellSidebarContentProps = {
  config: ShellSidebarConfig;
  collapsed: boolean;
  onNavigate?: () => void;
};

export type ShellSidebarProps = {
  config: ShellSidebarConfig;
  collapsed: boolean;
};

export type ShellMobileNavSheetProps = {
  config: ShellSidebarConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sheetDescription: string;
};

export type AppShellLayoutProps = {
  sidebarConfig: ShellSidebarConfig;
  accountPath: string;
  headerCenter?: ReactNode;
  mobileNavDescription: string;
  scrollContainerId?: string;
};

export type PortalPageShellProps = {
  heading: string;
  description: string;
  error?: string | null;
  actions?: ReactNode;
  children: ReactNode;
};
