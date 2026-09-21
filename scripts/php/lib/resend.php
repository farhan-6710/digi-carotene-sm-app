<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

/**
 * Send one email via Resend (https://resend.com/docs/api-reference/emails/send-email).
 *
 * @param list<string>|string $toEmails
 * @param list<array{filename: string, content: string}>|null $attachments base64 content
 * @return array{id?: string}
 */
function sendResendEmail(
    array $config,
    string|array $toEmails,
    string $subject,
    string $html,
    ?array $attachments = null,
): array {
    $apiKey = (string) ($config['resend_api_key'] ?? '');
    $from = (string) ($config['resend_from'] ?? '');

    if ($apiKey === '' || $from === '') {
        throw new RuntimeException('config.php missing resend_api_key or resend_from');
    }

    $to = is_array($toEmails) ? array_values($toEmails) : [$toEmails];
    $payload = [
        'from' => $from,
        'to' => $to,
        'subject' => $subject,
        'html' => $html,
    ];

    if ($attachments !== null && $attachments !== []) {
        $payload['attachments'] = $attachments;
    }

    return httpJson(
        'POST',
        'https://api.resend.com/emails',
        $payload,
        ['Authorization: Bearer ' . $apiKey],
    );
}
