import type { ShellNavSubItem } from "@/shared/types/components";

import {
  CONTACTS_MANAGEMENT_PATH,
  LEADS_MANAGEMENT_PATH,
} from "@/features/crm/constants/routes";

export const crmNav: ShellNavSubItem[] = [
  { label: "Leads Management", to: LEADS_MANAGEMENT_PATH },
  { label: "Contacts", to: CONTACTS_MANAGEMENT_PATH },
];
