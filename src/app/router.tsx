import { createBrowserRouter, Navigate } from "react-router";

import { StaffRoute } from "@/features/auth/components/StaffRoute";
import { ClientRoute } from "@/features/auth/components/ClientRoute";
import { UserRoute } from "@/features/auth/components/UserRoute";
import { AuthPage } from "@/features/auth/pages/AuthPage";
import { AnalyticsPage } from "@/features/analytics/pages/AnalyticsPage";
import { StaffDashboardPage } from "@/features/staff-portal/pages/StaffDashboardPage";
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
import { ClientDashboardPage } from "@/features/client-portal/pages/ClientDashboardPage";
import { ClientPostsPage } from "@/features/client-portal/pages/ClientPostsPage";
import { ClientAccountPage } from "@/features/client-portal/pages/ClientAccountPage";
import { UserPortalPage } from "@/features/user-portal/pages/UserPortalPage";
import { AboutPage } from "@/features/public/pages/AboutPage";
import { HomePage } from "@/features/public/pages/HomePage";
import { StaffLayout } from "@/shared/layouts/StaffLayout";
import { ClientLayout } from "@/shared/layouts/ClientLayout";
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
    path: "/user-portal",
    element: <UserRoute />,
    children: [{ index: true, element: <UserPortalPage /> }],
  },
  {
    path: "/staff-portal",
    element: <StaffRoute />,
    children: [
      {
        element: <StaffLayout />,
        children: [
          { path: "dashboard", element: <StaffDashboardPage /> },
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
            element: <Navigate to="/staff-portal/account" replace />,
          },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: "/client-portal",
    element: <ClientRoute />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        element: <ClientLayout />,
        children: [
          { path: "dashboard", element: <ClientDashboardPage /> },
          { path: "posts", element: <ClientPostsPage /> },
          { path: "account", element: <ClientAccountPage /> },
        ],
      },
    ],
  },
]);
