export type PortalSidebarContentProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export type PortalSidebarProps = {
  collapsed: boolean;
};

export type PortalMobileNavSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
