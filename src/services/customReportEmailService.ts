/**
 * Email custom growth report PDF via Hostinger PHP + Resend.
 * Env: VITE_GROWTH_PHP_BASE_URL, VITE_GROWTH_PHP_CRON_SECRET
 */
export async function sendCustomReportEmail(input: {
  toEmails: string[];
  pdfBase64: string;
  filename: string;
  periodLabel: string;
  accountCount: number;
}): Promise<void> {
  const baseUrl = (import.meta.env.VITE_GROWTH_PHP_BASE_URL ?? "").replace(
    /\/$/,
    "",
  );
  const secret = import.meta.env.VITE_GROWTH_PHP_CRON_SECRET ?? "";

  if (!baseUrl || !secret) {
    throw new Error(
      "Report email is not configured. Set VITE_GROWTH_PHP_BASE_URL and VITE_GROWTH_PHP_CRON_SECRET.",
    );
  }

  const response = await fetch(`${baseUrl}/send_custom_report.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Cron-Secret": secret,
    },
    body: JSON.stringify({
      secret,
      to: input.toEmails,
      period_label: input.periodLabel,
      account_count: input.accountCount,
      filename: input.filename,
      pdf_base64: input.pdfBase64,
    }),
  });

  const body = (await response.text()).trim();
  if (!response.ok) {
    throw new Error(body || `Email failed (HTTP ${response.status}).`);
  }
  if (!/OK|sent/i.test(body)) {
    throw new Error(body.slice(0, 300) || "Unexpected email response.");
  }
}
