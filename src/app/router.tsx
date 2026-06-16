import { createBrowserRouter, Navigate } from "react-router";

import { AdminRoute } from "@/features/auth/components/AdminRoute";
import { ClientRoute } from "@/features/auth/components/ClientRoute";
import { AuthPage } from "@/features/auth/pages/AuthPage";
import { AnalyticsPage } from "@/features/analytics/pages/AnalyticsPage";
import { AdminDashboardPage } from "@/features/dashboard/pages/AdminDashboardPage";
import { PostsManagementPage } from "@/features/posts-management/pages/PostsManagementPage";
import { ClientsManagementPage } from "@/features/clients-management/pages/ClientsManagementPage";
import { ProjectsManagementPage } from "@/features/projects-management/pages/ProjectsManagementPage";
import { ClientDetailPage } from "@/features/clients-management/pages/ClientDetailPage";
import { TeamManagementPage } from "@/features/team-management/pages/TeamManagementPage";
import { TeamMemberDetailPage } from "@/features/team-management/pages/TeamMemberDetailPage";
import { AccountPage } from "@/features/account/pages/AccountPage";
import { ReportsPage } from "@/features/reports/pages/ReportsPage";
import { ClientReportPage } from "@/features/reports/pages/ClientReportPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { PortalDashboardPage } from "@/features/portal/pages/PortalDashboardPage";
import { PortalPostsPage } from "@/features/portal/pages/PortalPostsPage";
import { PortalAccountPage } from "@/features/portal/pages/PortalAccountPage";
import { AboutPage } from "@/features/public/pages/AboutPage";
import { HomePage } from "@/features/public/pages/HomePage";
import { AdminLayout } from "@/shared/layouts/AdminLayout";
import { PortalLayout } from "@/shared/layouts/PortalLayout";
import { PublicLayout } from "@/shared/layouts/PublicLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
    ],
  },
  { path: "/auth", element: <AuthPage /> },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "posts-management", element: <PostsManagementPage /> },
          { path: "projects-management", element: <ProjectsManagementPage /> },
          { path: "clients-management", element: <ClientsManagementPage /> },
          {
            path: "clients-management/:clientId",
            element: <ClientDetailPage />,
          },
          { path: "team-management", element: <TeamManagementPage /> },
          {
            path: "team-management/:memberId",
            element: <TeamMemberDetailPage />,
          },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "reports/:clientName", element: <ClientReportPage /> },
          { path: "account", element: <AccountPage /> },
          {
            path: "profile",
            element: <Navigate to="/admin/account" replace />,
          },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: "/portal",
    element: <ClientRoute />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        element: <PortalLayout />,
        children: [
          { path: "dashboard", element: <PortalDashboardPage /> },
          { path: "posts", element: <PortalPostsPage /> },
          { path: "account", element: <PortalAccountPage /> },
        ],
      },
    ],
  },
]);
