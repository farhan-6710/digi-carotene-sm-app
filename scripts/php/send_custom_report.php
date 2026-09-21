<?php

declare(strict_types=1);

/**
 * Email a custom Growth PDF report via Resend (attachment).
 *
 * POST JSON:
 * {
 *   "secret": "...",
 *   "to": ["a@x.com", "b@y.com"],
 *   "period_label": "1 Mar 2026 – 31 Mar 2026",
 *   "account_count": 2,
 *   "filename": "growth-report.pdf",
 *   "pdf_base64": "...."
 * }
 */

require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/lib/resend.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Cron-Secret');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $config = loadConfig();
    assertCronAccess($config);

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo 'Method not allowed';
        exit(1);
    }

    $raw = file_get_contents('php://input');
    $body = json_decode($raw !== false ? $raw : '', true);
    if (!is_array($body)) {
        throw new RuntimeException('Invalid JSON body.');
    }

    $toRaw = $body['to'] ?? [];
    if (!is_array($toRaw) || $toRaw === []) {
        throw new RuntimeException('Provide at least one recipient email.');
    }

    $emails = [];
    foreach ($toRaw as $item) {
        if (!is_string($item)) {
            continue;
        }
        $email = strtolower(trim($item));
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('Invalid email: ' . $item);
        }
        $emails[] = $email;
    }
    $emails = array_values(array_unique($emails));
    if ($emails === []) {
        throw new RuntimeException('Provide at least one valid recipient email.');
    }
    if (count($emails) > 10) {
        throw new RuntimeException('At most 10 recipients per send.');
    }

    $pdfBase64 = is_string($body['pdf_base64'] ?? null)
        ? trim((string) $body['pdf_base64'])
        : '';
    if ($pdfBase64 === '') {
        throw new RuntimeException('Missing pdf_base64.');
    }

    $filename = is_string($body['filename'] ?? null)
        ? trim((string) $body['filename'])
        : 'growth-report.pdf';
    if ($filename === '' || !str_ends_with(strtolower($filename), '.pdf')) {
        $filename = 'growth-report.pdf';
    }

    $periodLabel = is_string($body['period_label'] ?? null)
        ? trim((string) $body['period_label'])
        : 'Selected period';
    $periodSafe = htmlspecialchars($periodLabel, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $accountCount = (int) ($body['account_count'] ?? 0);

    $subject = 'Digi Carotene Growth Report — ' . $periodLabel;
    $html = <<<HTML
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f8f9;font-family:Helvetica,Arial,sans-serif;color:#1a2a2e;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:28px;border:1px solid #dce4e6;">
          <tr>
            <td style="font-size:20px;font-weight:700;color:#028595;padding-bottom:8px;">
              Digi Carotene Growth Report
            </td>
          </tr>
          <tr>
            <td style="font-size:14px;line-height:1.5;color:#6b7c80;padding-bottom:16px;">
              Your custom Growth report is attached as a PDF.
            </td>
          </tr>
          <tr>
            <td style="font-size:14px;line-height:1.6;padding-bottom:8px;">
              <strong>Period:</strong> {$periodSafe}<br/>
              <strong>Accounts:</strong> {$accountCount}
            </td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#6b7c80;padding-top:16px;border-top:1px solid #dce4e6;">
              Sent by Digi Carotene Team Portal. Please keep this report confidential.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
HTML;

    sendResendEmail(
        $config,
        $emails,
        $subject,
        $html,
        [
            [
                'filename' => $filename,
                'content' => $pdfBase64,
            ],
        ],
    );

    header('Content-Type: text/plain; charset=utf-8');
    echo 'OK sent=' . count($emails);
} catch (Throwable $error) {
    cronFail('FATAL: ' . $error->getMessage());
}
