import { createBrowserRouter, Navigate } from "react-router";

import { lazyRoutePage } from "@/app/lazyRoute";
import { StaffRoute } from "@/features/auth/components/StaffRoute";
import { ClientRoute } from "@/features/auth/components/ClientRoute";
import { UserRoute } from "@/features/auth/components/UserRoute";

const PublicLayout = lazyRoutePage(
  () => import("@/shared/layouts/PublicLayout"),
  "PublicLayout",
);
const StaffLayout = lazyRoutePage(
  () => import("@/shared/layouts/StaffLayout"),
  "StaffLayout",
);
const ClientLayout = lazyRoutePage(
  () => import("@/shared/layouts/ClientLayout"),
  "ClientLayout",
);

const HomePage = lazyRoutePage(
  () => import("@/features/public/pages/HomePage"),
  "HomePage",
);
const AboutPage = lazyRoutePage(
  () => import("@/features/public/pages/AboutPage"),
  "AboutPage",
);
const AuthPage = lazyRoutePage(
  () => import("@/features/auth/pages/AuthPage"),
  "AuthPage",
);
const UserPortalPage = lazyRoutePage(
  () => import("@/features/user-portal/pages/UserPortalPage"),
  "UserPortalPage",
);
const StaffDashboardPage = lazyRoutePage(
  () => import("@/features/staff-portal/pages/StaffDashboardPage"),
  "StaffDashboardPage",
);
const PostsManagementPage = lazyRoutePage(
  () => import("@/features/posts-management/pages/PostsManagementPage"),
  "PostsManagementPage",
);
const ProjectsManagementPage = lazyRoutePage(
  () => import("@/features/projects-management/pages/ProjectsManagementPage"),
  "ProjectsManagementPage",
);
const ClientsManagementPage = lazyRoutePage(
  () => import("@/features/clients-management/pages/ClientsManagementPage"),
  "ClientsManagementPage",
);
const ClientDetailPage = lazyRoutePage(
  () => import("@/features/clients-management/pages/ClientDetailPage"),
  "ClientDetailPage",
);
const TeamManagementPage = lazyRoutePage(
  () => import("@/features/team-management/pages/TeamManagementPage"),
  "TeamManagementPage",
);
const TeamMemberDetailPage = lazyRoutePage(
  () => import("@/features/team-management/pages/TeamMemberDetailPage"),
  "TeamMemberDetailPage",
);
const AnalyticsPage = lazyRoutePage(
  () => import("@/features/analytics/pages/AnalyticsPage"),
  "AnalyticsPage",
);
const ReportsPage = lazyRoutePage(
  () => import("@/features/reports/pages/ReportsPage"),
  "ReportsPage",
);
const ClientReportPage = lazyRoutePage(
  () => import("@/features/reports/pages/ClientReportPage"),
  "ClientReportPage",
);
const AccountPage = lazyRoutePage(
  () => import("@/features/account/pages/AccountPage"),
  "AccountPage",
);
const SettingsPage = lazyRoutePage(
  () => import("@/features/settings/pages/SettingsPage"),
  "SettingsPage",
);
const ClientDashboardPage = lazyRoutePage(
  () => import("@/features/client-portal/pages/ClientDashboardPage"),
  "ClientDashboardPage",
);
const ClientPostsPage = lazyRoutePage(
  () => import("@/features/client-portal/pages/ClientPostsPage"),
  "ClientPostsPage",
);
const ClientAccountPage = lazyRoutePage(
  () => import("@/features/client-portal/pages/ClientAccountPage"),
  "ClientAccountPage",
);

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
