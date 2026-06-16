import { AccountDetailsCard } from "@/shared/components/account/AccountDetailsCard";
import {
  getUserAuthProvider,
  getUserEmail,
  getUserJoinedDate,
} from "@/shared/utils/authUserDisplay";
import type { StaffAccountDetailsCardProps } from "@/features/account/types/components";

export function StaffAccountDetailsCard({
  user,
  staffAccount,
}: StaffAccountDetailsCardProps) {
  const details = [
    { label: "Department", value: staffAccount.department },
    { label: "Email", value: getUserEmail(user) },
    { label: "Phone", value: staffAccount.phone },
    { label: "Certification", value: staffAccount.licenseNumber },
    { label: "Joined", value: getUserJoinedDate(user) },
    { label: "Sign-in method", value: getUserAuthProvider(user) },
    { label: "Location", value: staffAccount.location },
  ];

  return (
    <AccountDetailsCard title="Professional details" details={details} />
  );
}
