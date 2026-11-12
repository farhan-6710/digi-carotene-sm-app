import { showToast } from "@/shared/utils/showToast";

import type { CreateGrowthReportInput } from "../types/types";

export async function saveGrowthReport(input: CreateGrowthReportInput) {
  void input;
  showToast("success", "Report generated (preview — demo data only).");
}
