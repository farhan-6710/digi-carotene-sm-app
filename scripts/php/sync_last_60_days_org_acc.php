<?php

declare(strict_types=1);

/**
 * Midnight organic account sync — last 60 days of post metrics (lifetime insights)
 * + last 30 days of follower gains (Meta API cap).
 *
 * CLI:  php sync_last_60_days_org_acc.php
 * HTTP: .../sync_last_60_days_org_acc.php?secret=YOUR_CRON_SECRET
 */

require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/sync/organic/run_organic_rolling_sync.php';

try {
    $config = loadConfig();
    assertCronAccess($config);
    runOrganicRollingSync($config);
} catch (Throwable $error) {
    cronFail('Fatal: ' . $error->getMessage());
}
