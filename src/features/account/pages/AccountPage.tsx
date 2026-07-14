import { AccountCredentialsList } from "@/features/account/components/AccountCredentialsList";
import { TeamAccountDetailsCard } from "@/features/account/components/TeamAccountDetailsCard";
import { teamAccount } from "@/features/account/constants/teamAccount";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AccountHeader } from "@/shared/components/account/AccountHeader";
import { AccountPasswordCard } from "@/shared/components/account/AccountPasswordCard";
import { AccountStatsGrid } from "@/shared/components/account/AccountStatsGrid";
import { PageContent } from "@/shared/components/PageContent";
import { PageHeader } from "@/shared/components/PageHeader";

export function AccountPage() {
  const { user, teamRole } = useAuth();

  return (
    <PageContent>
      <PageHeader
        heading="Account"
        description="Your Digi Carotene team account, sign-in details, and agency performance snapshot."
      />

      <AccountHeader
        user={user}
        roleLabel={teamAccount.department}
        bio={teamAccount.bio}
        teamRole={teamRole}
      />

      <AccountStatsGrid stats={teamAccount.stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TeamAccountDetailsCard
          user={user}
          teamAccount={teamAccount}
          teamRole={teamRole}
        />
        <AccountCredentialsList
          credentials={teamAccount.credentials}
          specializations={teamAccount.specializations}
        />
        <AccountPasswordCard user={user} />
      </div>
    </PageContent>
  );
}
