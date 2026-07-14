<?php

declare(strict_types=1);

/**
 * Cron connectivity smoke test — config + auth only (no emails sent).
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

    $missing = [];
    foreach (
        [
            'supabase_url',
            'supabase_service_key',
            'cron_secret',
            'resend_api_key',
            'resend_from',
        ] as $key
    ) {
        if (!is_string($config[$key] ?? null) || $config[$key] === '') {
            $missing[] = $key;
        }
    }

    if ($missing !== []) {
        cronFail('config.php missing: ' . implode(', ', $missing));
    }

    echo 'test passed' . PHP_EOL;
    echo 'timezone=' . ($config['timezone'] ?? '') . PHP_EOL;
    echo 'resend_from=' . ($config['resend_from'] ?? '') . PHP_EOL;
} catch (Throwable $error) {
    cronFail('Fatal: ' . $error->getMessage());
}
