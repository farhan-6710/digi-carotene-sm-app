export type SidebarContentProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export type SidebarProps = {
  collapsed: boolean;
};

export type AdminMobileNavSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
