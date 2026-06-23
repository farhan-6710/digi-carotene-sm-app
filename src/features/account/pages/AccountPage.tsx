import { AccountCredentialsList } from "@/features/account/components/AccountCredentialsList";
import { StaffAccountDetailsCard } from "@/features/account/components/StaffAccountDetailsCard";
import { staffAccount } from "@/features/account/constants/staffAccount";
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
        description="Your Digi Carotene staff account, sign-in details, and agency performance snapshot."
      />


      <AccountHeader
        user={user}
        roleLabel={staffAccount.department}
        bio={staffAccount.bio}
        teamRole={teamRole}
      />

      <AccountStatsGrid stats={staffAccount.stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <StaffAccountDetailsCard
          user={user}
          staffAccount={staffAccount}
          teamRole={teamRole}
        />
        <AccountCredentialsList
          credentials={staffAccount.credentials}
          specializations={staffAccount.specializations}
        />
      </div>
    </section>
  );
}
