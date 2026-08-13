<?php

declare(strict_types=1);

/**
 * Midnight post digest emails (executives / managers / admins).
 * See src/shared/constants/postDigestEmail.ts for the section matrix.
 *
 * CLI:  php send_midnight_post_digest.php
 * HTTP: https://your-domain.com/.../send_midnight_post_digest.php?secret=YOUR_CRON_SECRET
 */

require_once __DIR__ . '/lib/digest.php';
require_once __DIR__ . '/lib/resend.php';

try {
    $config = loadConfig();
    assertCronAccess($config);

    if (!isCronCli()) {
        header('Content-Type: text/plain; charset=utf-8');
    }

    $tz = new DateTimeZone($config['timezone'] ?? 'Asia/Kolkata');
    $today = (new DateTimeImmutable('today', $tz))->format('Y-m-d');
    $yesterday = (new DateTimeImmutable('today', $tz))
        ->modify('-1 day')
        ->format('Y-m-d');
    $portalUrl = (string) ($config['portal_posts_url'] ?? '');

    logLine('Starting post digest for today=' . $today . ' yesterday=' . $yesterday);

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
        $role = (string) ($member['role'] ?? '');

        if ($email === '' || !isset(postDigestSectionsByRole()[$role])) {
            $skipped++;
            continue;
        }

        $sections = buildDigestSectionsForMember($config, $member, $today, $yesterday);
        if ($sections === []) {
            logLine('Skip (no posts): ' . $email . ' (' . $role . ')');
            $skipped++;
            continue;
        }

        $subject = 'Digi Carotene — post digest ' . $today;
        $html = buildDigestHtml($name, $today, $sections, $portalUrl);

        try {
            $result = sendResendEmail($config, $email, $subject, $html);
            $mailId = is_string($result['id'] ?? null) ? $result['id'] : '';
            logLine('Sent to ' . $email . ' (' . $role . ')' . ($mailId !== '' ? ' id=' . $mailId : ''));
            $sent++;
        } catch (Throwable $error) {
            logLine('Failed ' . $email . ': ' . $error->getMessage());
        }
    }

    logLine('Digest complete. sent=' . $sent . ' skipped=' . $skipped);
} catch (Throwable $error) {
    cronFail('Fatal: ' . $error->getMessage());
}
