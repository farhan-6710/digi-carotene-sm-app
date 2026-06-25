import { TEAM_MEMBER_ROLE_LABELS } from "@/features/team-management/constants/teamMemberRoles";
import { AccountDetailsCard } from "@/shared/components/account/AccountDetailsCard";
import {
  getUserAuthProvider,
  getUserEmail,
  getUserJoinedDate,
} from "@/shared/utils/authUserDisplay";
import type { TeamAccountDetailsCardProps } from "@/features/account/types/components";

export function TeamAccountDetailsCard({
  user,
  teamAccount,
  teamRole,
}: TeamAccountDetailsCardProps) {
  const details = [
    {
      label: "Team role",
      value: teamRole
        ? TEAM_MEMBER_ROLE_LABELS[teamRole]
        : "Not assigned",
    },
    { label: "Department", value: teamAccount.department },
    { label: "Email", value: getUserEmail(user) },
    { label: "Phone", value: teamAccount.phone },
    { label: "Certification", value: teamAccount.licenseNumber },
    { label: "Joined", value: getUserJoinedDate(user) },
    { label: "Sign-in method", value: getUserAuthProvider(user) },
    { label: "Location", value: teamAccount.location },
  ];

  return (
    <AccountDetailsCard title="Professional details" details={details} />
  );
}
