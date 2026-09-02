<?php

declare(strict_types=1);

/**
 * Midnight high-priority task digest (assigned + dependency teammates).
 * See src/shared/constants/taskDigestEmail.ts
 *
 * CLI:  php send_midnight_task_digest.php
 * HTTP: https://your-domain.com/.../send_midnight_task_digest.php?secret=YOUR_CRON_SECRET
 */

require_once __DIR__ . '/lib/taskDigest.php';
require_once __DIR__ . '/lib/resend.php';

try {
    $config = loadConfig();
    assertCronAccess($config);

    if (!isCronCli()) {
        header('Content-Type: text/plain; charset=utf-8');
    }

    $tz = new DateTimeZone($config['timezone'] ?? 'Asia/Kolkata');
    $today = (new DateTimeImmutable('today', $tz))->format('Y-m-d');
    $portalUrl = (string) ($config['portal_tasks_url'] ?? '');

    logLine('Starting task digest for today=' . $today);

    $members = fetchTeamMembers($config);
    if ($members === []) {
        logLine('No team_members rows found.');
        exit(0);
    }

    $sent = 0;
    $skipped = 0;

    foreach ($members as $member) {
        $email = strtolower(trim((string) ($member['email'] ?? '')));
        $name = (string) ($member['member_name'] ?? 'Team');
        $memberId = (string) ($member['id'] ?? '');

        if ($email === '' || $memberId === '') {
            $skipped++;
            continue;
        }

        $items = buildTaskDigestItemsForMember($config, $memberId);
        if ($items === []) {
            logLine('Skip (no high-priority work): ' . $email);
            $skipped++;
            continue;
        }

        $subject = 'Digi Carotene — high-priority task digest ' . $today;
        $html = buildTaskDigestHtml($name, $today, $items, $portalUrl);
        $itemCount = count($items);
        $inboxMessage = 'Your high-priority task digest is ready ('
            . $itemCount
            . ' item'
            . ($itemCount === 1 ? '' : 's')
            . '). Open Task Management or check your email.';

        try {
            $result = sendResendEmail($config, $email, $subject, $html);
            $mailId = is_string($result['id'] ?? null) ? $result['id'] : '';
            logLine('Sent to ' . $email . ($mailId !== '' ? ' id=' . $mailId : ''));

            try {
                createTaskDigestNotification($config, $memberId, $subject, $inboxMessage);
                logLine('Inbox notification created for ' . $email);
            } catch (Throwable $notifyError) {
                logLine('Inbox notify failed ' . $email . ': ' . $notifyError->getMessage());
            }

            $sent++;
        } catch (Throwable $error) {
            logLine('Failed ' . $email . ': ' . $error->getMessage());
        }
    }

    logLine('Task digest complete. sent=' . $sent . ' skipped=' . $skipped);
} catch (Throwable $error) {
    cronFail('Fatal: ' . $error->getMessage());
}
