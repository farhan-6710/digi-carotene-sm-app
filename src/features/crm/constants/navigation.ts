import type { ShellNavSubItem } from "@/shared/types/components";

import {
  CONTACT_MANAGEMENT_PATH,
  LEADS_MANAGEMENT_PATH,
} from "@/features/crm/constants/routes";

export const crmNav: ShellNavSubItem[] = [
  { label: "Leads Management", to: LEADS_MANAGEMENT_PATH },
  { label: "Contact", to: CONTACT_MANAGEMENT_PATH },
];
