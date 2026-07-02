import type { KeyboardEvent, ReactNode } from "react";
import type { DateRange } from "react-day-picker";

import type { AnalyticsQuickPeriodId } from "@/features/analytics/constants/analyticsFilters";

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
  headerAside?: ReactNode;
  children: ReactNode;
};

export type PageShellProps = {
  heading: string;
  description: string;
  actions?: ReactNode;
  error?: string | null;
  children: ReactNode;
  dialog?: ReactNode;
};

export type PageContentProps = {
  className?: string;
  children: ReactNode;
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

export type MemberInitialsAvatarProps = {
  name: string;
  size?: "sm" | "md";
  className?: string;
};

export type ShellSidebarConfig = {
  homeLink: string;
  initials: string;
  brandName: string;
  brandSubtitle?: string;
  nav: ShellNavItem[];
  quickAction?: ShellQuickAction;
  searchPlaceholder?: string;
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

export type PortalUserHeaderMenuProps = {
  accountPath: string;
  settingsPath?: string;
};

export type AppShellLayoutProps = {
  sidebarConfig: ShellSidebarConfig;
  /** When set, shows the user avatar menu (account, settings, sign out). */
  accountPath?: string;
  settingsPath?: string;
  headerCenter?: ReactNode;
  headerActions?: ReactNode;
  mobileNavDescription: string;
};

export type DetailPageLoadingProps = {
  backButton?: ReactNode;
  minHeight?: number;
};

export type MultiSelectOption = {
  value: string;
  label: string;
};

export type MultiSelectProps = {
  id?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  emptyMessage?: string;
  excludeValues?: string[];
  /** Shown on selected chips when the option label is not in `options` yet. */
  fallbackSelectedLabel?: string;
  onOpenChange?: (open: boolean) => void;
};

export type DateRangePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  range: DateRange | undefined;
  rangeLabel: string;
  isActive: boolean;
  onRangeChange: (range: DateRange | undefined) => void;
  onApply: () => void;
  onClear: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  error: string | null;
};

export type DateFiltersProps = {
  quickPeriods: readonly { id: AnalyticsQuickPeriodId; label: string }[];
  activeQuickPeriod: AnalyticsQuickPeriodId | null;
  isDateRangeActive: boolean;
  periodLabel: string;
  rangeButtonLabel: string;
  pickerRange: DateRange | undefined;
  isPickerOpen: boolean;
  pickerError: string | null;
  onToggleQuickPeriod: (period: AnalyticsQuickPeriodId) => void;
  onClearFilters: () => void;
  onClearDateRange: () => void;
  onApplyDateRange: () => void;
  onPickerRangeChange: (range: DateRange | undefined) => void;
  onPickerOpenChange: (open: boolean) => void;
  onPickerKeyDown: (event: KeyboardEvent) => void;
};

export type DatePickerProps = {
  id?: string;
  label?: string;
  /** `yyyy-MM-dd` or empty string when unset. */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  clearable?: boolean;
  onClear?: () => void;
  className?: string;
};

export type ShellNavSearchProps = {
  nav: ShellNavItem[];
  placeholder?: string;
  className?: string;
};
