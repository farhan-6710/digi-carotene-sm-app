import { createBrowserRouter, Navigate } from "react-router";

import { lazyRoutePage } from "@/app/lazyRoute";
import { TeamRoute } from "@/features/auth/components/TeamRoute";
import { ClientRoute } from "@/features/auth/components/ClientRoute";
import { UserRoute } from "@/features/auth/components/UserRoute";
import { RouteErrorPage } from "@/shared/pages/RouteErrorPage";

const PublicLayout = lazyRoutePage(
  () => import("@/shared/layouts/PublicLayout"),
  "PublicLayout",
);
const TeamLayout = lazyRoutePage(
  () => import("@/shared/layouts/TeamLayout"),
  "TeamLayout",
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
const GrowthDashboardPage = lazyRoutePage(
  () => import("@/features/growth-and-analytics/pages/GrowthDashboardPage"),
  "GrowthDashboardPage",
);
const GrowthContentPerformancePage = lazyRoutePage(
  () =>
    import(
      "@/features/growth-and-analytics/pages/GrowthContentPerformancePage"
    ),
  "GrowthContentPerformancePage",
);
const GrowthPostDetailPage = lazyRoutePage(
  () => import("@/features/growth-and-analytics/pages/GrowthPostDetailPage"),
  "GrowthPostDetailPage",
);
const GrowthCampaignAnalyticsPage = lazyRoutePage(
  () =>
    import("@/features/growth-and-analytics/pages/GrowthCampaignAnalyticsPage"),
  "GrowthCampaignAnalyticsPage",
);
const GrowthCampaignDetailPage = lazyRoutePage(
  () =>
    import("@/features/growth-and-analytics/pages/GrowthCampaignDetailPage"),
  "GrowthCampaignDetailPage",
);
const GrowthAdsetDetailPage = lazyRoutePage(
  () => import("@/features/growth-and-analytics/pages/GrowthAdsetDetailPage"),
  "GrowthAdsetDetailPage",
);
const GrowthAdDetailPage = lazyRoutePage(
  () => import("@/features/growth-and-analytics/pages/GrowthAdDetailPage"),
  "GrowthAdDetailPage",
);
const GrowthCustomReportBuilderPage = lazyRoutePage(
  () =>
    import(
      "@/features/growth-and-analytics/pages/GrowthCustomReportBuilderPage"
    ),
  "GrowthCustomReportBuilderPage",
);
const GrowthReportsPage = lazyRoutePage(
  () => import("@/features/growth-and-analytics/pages/GrowthReportsPage"),
  "GrowthReportsPage",
);
const GrowthManageAccountsPage = lazyRoutePage(
  () =>
    import("@/features/growth-and-analytics/pages/GrowthManageAccountsPage"),
  "GrowthManageAccountsPage",
);
const AuthPage = lazyRoutePage(
  () => import("@/features/auth/pages/AuthPage"),
  "AuthPage",
);
const UserPortalPage = lazyRoutePage(
  () => import("@/features/user-portal/pages/UserPortalPage"),
  "UserPortalPage",
);
const TeamDashboardPage = lazyRoutePage(
  () => import("@/features/team-portal/pages/TeamDashboardPage"),
  "TeamDashboardPage",
);
const PostsManagementPage = lazyRoutePage(
  () => import("@/features/posts-management/pages/PostsManagementPage"),
  "PostsManagementPage",
);
const AddPostsPage = lazyRoutePage(
  () => import("@/features/posts-management/pages/AddPostsPage"),
  "AddPostsPage",
);
const ProjectsManagementPage = lazyRoutePage(
  () => import("@/features/projects-management/pages/ProjectsManagementPage"),
  "ProjectsManagementPage",
);
const ProjectDetailPage = lazyRoutePage(
  () => import("@/features/projects-management/pages/ProjectDetailPage"),
  "ProjectDetailPage",
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
const PostApprovalsPage = lazyRoutePage(
  () => import("@/features/post-approvals/pages/PostApprovalsPage"),
  "PostApprovalsPage",
);
const ClientDashboardPage = lazyRoutePage(
  () => import("@/features/client-portal/pages/ClientDashboardPage"),
  "ClientDashboardPage",
);
const ClientPostsPage = lazyRoutePage(
  () => import("@/features/client-portal/pages/ClientPostsPage"),
  "ClientPostsPage",
);
const ClientGrowthOutlet = lazyRoutePage(
  () => import("@/features/client-portal/pages/ClientGrowthOutlet"),
  "ClientGrowthOutlet",
);
const ClientAccountPage = lazyRoutePage(
  () => import("@/features/client-portal/pages/ClientAccountPage"),
  "ClientAccountPage",
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <RouteErrorPage />,
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
    path: "/team-portal",
    element: <TeamRoute />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <TeamLayout />,
        children: [
          { path: "dashboard", element: <TeamDashboardPage /> },
          {
            path: "growth-and-analytics",
            children: [
              { index: true, element: <GrowthDashboardPage /> },
              {
                path: "content-performance",
                element: <GrowthContentPerformancePage />,
              },
              {
                path: "content-performance/posts/:postId",
                element: <GrowthPostDetailPage />,
              },
              { path: "campaigns", element: <GrowthCampaignAnalyticsPage /> },
              {
                path: "campaigns/:campaignId",
                element: <GrowthCampaignDetailPage />,
              },
              {
                path: "campaigns/:campaignId/adsets/:adsetId",
                element: <GrowthAdsetDetailPage />,
              },
              {
                path: "campaigns/:campaignId/adsets/:adsetId/ads/:adId",
                element: <GrowthAdDetailPage />,
              },
              {
                path: "custom-report",
                element: <GrowthCustomReportBuilderPage />,
              },
              { path: "reports", element: <GrowthReportsPage /> },
              {
                path: "manage-accounts",
                element: <GrowthManageAccountsPage />,
              },
            ],
          },
          { path: "posts-management", element: <PostsManagementPage /> },
          {
            path: "posts-management/add-post",
            element: <AddPostsPage />,
          },
          { path: "post-approvals", element: <PostApprovalsPage /> },
          { path: "projects-management", element: <ProjectsManagementPage /> },
          {
            path: "projects-management/:projectId",
            element: <ProjectDetailPage />,
          },
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
            element: <Navigate to="/team-portal/account" replace />,
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
          {
            path: "growth-and-analytics",
            element: <ClientGrowthOutlet />,
            children: [
              { index: true, element: <GrowthDashboardPage /> },
              {
                path: "content-performance",
                element: <GrowthContentPerformancePage />,
              },
              {
                path: "content-performance/posts/:postId",
                element: <GrowthPostDetailPage />,
              },
              { path: "campaigns", element: <GrowthCampaignAnalyticsPage /> },
              {
                path: "campaigns/:campaignId",
                element: <GrowthCampaignDetailPage />,
              },
              {
                path: "campaigns/:campaignId/adsets/:adsetId",
                element: <GrowthAdsetDetailPage />,
              },
              {
                path: "campaigns/:campaignId/adsets/:adsetId/ads/:adId",
                element: <GrowthAdDetailPage />,
              },
              {
                path: "custom-report",
                element: <GrowthCustomReportBuilderPage />,
              },
              { path: "reports", element: <GrowthReportsPage /> },
            ],
          },
          { path: "account", element: <ClientAccountPage /> },
        ],
      },
    ],
  },
]);
