<?php

/**
 * Shared PHP config template (email digests + custom report email only).
 * Copy to config.php and fill REQUIRED values before upload.
 * PHP 8.2+ (tested with 8.2.30 on Hostinger/GoDaddy).
 *
 * Growth Meta/Google sync runs in the browser (TypeScript) — not PHP.
 * Do not commit config.php after adding secrets.
 */
return [
    'timezone' => 'Asia/Kolkata',

    'supabase_url' => 'https://YOUR_PROJECT.supabase.co',

    // REQUIRED — Supabase → Project Settings → API → service_role (secret).
    'supabase_service_key' => '',

    // REQUIRED for URL-triggered PHP (digests, report email).
    'cron_secret' => '',

    // REQUIRED for digests / report email — Resend → API Keys (starts with re_).
    'resend_api_key' => '',

    // REQUIRED — must match a verified Resend domain.
    'resend_from' => 'Digi Carotene <noreply@updates.digicarotene.in>',

    // Optional — link in digest email footer.
    'portal_posts_url' => 'https://digicarotene.in/team-portal/posts-management',

    // Optional — link in task digest email footer.
    'portal_tasks_url' => 'https://digicarotene.in/team-portal/tasks-management',
];
