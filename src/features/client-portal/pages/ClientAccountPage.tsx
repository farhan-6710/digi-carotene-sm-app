import { ClientSocialLinks } from "@/features/client-portal/components/ClientSocialLinks";
import { useClientPortal } from "@/features/client-portal/hooks/useClientPortal";
import { buildClientStatCards } from "@/features/client-portal/utils/clientStats";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AccountHeader } from "@/shared/components/account/AccountHeader";
import { AccountDetailsCard } from "@/shared/components/account/AccountDetailsCard";
import type { AccountDetailRow } from "@/shared/components/account/types";
import { AccountPanelCard } from "@/shared/components/account/AccountPanelCard";
import { AccountPasswordCard } from "@/shared/components/account/AccountPasswordCard";
import { AccountStatsGrid } from "@/shared/components/account/AccountStatsGrid";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { PageShell } from "@/shared/components/PageShell";
import {
  getUserAuthProvider,
  getUserEmail,
  getUserJoinedDate,
} from "@/shared/utils/authUserDisplay";

export function ClientAccountPage() {
  const { user } = useAuth();
  const { client, projects, posts, loading, error } = useClientPortal();

  const stats = buildClientStatCards(posts).map((stat) => ({
    label: stat.label,
    value: loading ? "—" : stat.value,
  }));

  const brandDetails: AccountDetailRow[] = client
    ? [
        { label: "Brand", value: client.client_name },
        { label: "Email", value: getUserEmail(user) },
        ...(client.mobile_number
          ? [{ label: "Mobile", value: client.mobile_number }]
          : []),
        ...(client.website_name
          ? [{ label: "Website", value: client.website_name }]
          : []),
        { label: "Joined", value: getUserJoinedDate(user) },
        { label: "Sign-in method", value: getUserAuthProvider(user) },
      ]
    : [
        { label: "Email", value: getUserEmail(user) },
        { label: "Sign-in method", value: getUserAuthProvider(user) },
      ];

  const bio = client
    ? `Client portal account for ${client.client_name}. View your content schedule, brand details, and sign out here.`
    : "Your Digi Carotene client portal account.";

  return (
    <PageShell
      heading="Account"
      description="Your sign-in, brand on file with Digi Carotene, and content performance snapshot."
      error={error && !loading ? error : null}
    >
      <AccountHeader user={user} roleLabel="Client account" bio={bio} />

      <AccountStatsGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-16 shadow-sm lg:col-span-2">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <AccountDetailsCard title="Brand & login details" details={brandDetails} />
            <AccountPanelCard title="Social profiles">
              {projects.length > 0 ? (
                <ClientSocialLinks projects={projects} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Brand details unavailable.
                </p>
              )}
            </AccountPanelCard>
            <AccountPasswordCard user={user} />
          </>
        )}
      </div>
    </PageShell>
  );
}
