<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

/**
 * Send one email via Resend (https://resend.com/docs/api-reference/emails/send-email).
 *
 * @return array{id?: string}
 */
function sendResendEmail(
    array $config,
    string $toEmail,
    string $subject,
    string $html,
): array {
    $apiKey = (string) ($config['resend_api_key'] ?? '');
    $from = (string) ($config['resend_from'] ?? '');

    if ($apiKey === '' || $from === '') {
        throw new RuntimeException('config.php missing resend_api_key or resend_from');
    }

    return httpJson(
        'POST',
        'https://api.resend.com/emails',
        [
            'from' => $from,
            'to' => [$toEmail],
            'subject' => $subject,
            'html' => $html,
        ],
        ['Authorization: Bearer ' . $apiKey],
    );
}
