import { AccountCredentialsList } from "@/features/account/components/AccountCredentialsList";
import { TeamAccountDetailsCard } from "@/features/account/components/TeamAccountDetailsCard";
import { teamAccount } from "@/features/account/constants/teamAccount";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AccountHeader } from "@/shared/components/account/AccountHeader";
import { AccountStatsGrid } from "@/shared/components/account/AccountStatsGrid";
import { PageHeader } from "@/shared/components/PageHeader";

export function AccountPage() {
  const { user, teamRole } = useAuth();

  return (
    <section className="space-y-8">
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
      </div>
    </section>
  );
}
