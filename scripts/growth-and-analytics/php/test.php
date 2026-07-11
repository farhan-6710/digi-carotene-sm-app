<?php

declare(strict_types=1);

/**
 * Cron connectivity smoke test — verifies config + auth without calling Meta/Supabase sync.
 *
 * CLI:  php test.php
 * HTTP: https://your-domain.com/.../test.php?secret=YOUR_CRON_SECRET
 */

require_once __DIR__ . '/lib/bootstrap.php';

try {
    $config = loadConfig();
    assertCronAccess($config);

    if (!isCronCli()) {
        header('Content-Type: text/plain; charset=utf-8');
    }

    echo 'test passed' . PHP_EOL;
} catch (Throwable $error) {
    cronFail('Fatal: ' . $error->getMessage());
}
