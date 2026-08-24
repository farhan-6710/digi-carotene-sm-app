import type { ShellNavSubItem } from "@/shared/types/components";

import {
  CONVERSIONS_MANAGEMENT_PATH,
  LEADS_MANAGEMENT_PATH,
} from "@/features/crm/constants/routes";

export const crmNav: ShellNavSubItem[] = [
  { label: "Leads Management", to: LEADS_MANAGEMENT_PATH },
  { label: "Conversions", to: CONVERSIONS_MANAGEMENT_PATH },
];
