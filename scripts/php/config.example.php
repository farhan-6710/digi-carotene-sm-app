<?php

/**
 * Shared cron config template (Growth sync + midnight post digest).
 * Copy to config.php and fill REQUIRED values before upload.
 * PHP 8.2+ (tested with 8.2.30 on Hostinger/GoDaddy).
 *
 * Do not commit config.php after adding secrets.
 */
return [
    'timezone' => 'Asia/Kolkata',

    'supabase_url' => 'https://YOUR_PROJECT.supabase.co',

    // REQUIRED — Supabase → Project Settings → API → service_role (secret).
    'supabase_service_key' => '',

    // REQUIRED for URL cron — long random string (e.g. openssl rand -hex 32).
    'cron_secret' => '',

    'meta_api_version' => 'v24.0',
    'meta_graph_base_url' => 'https://graph.facebook.com',

    // REQUIRED for post digest — Resend → API Keys (starts with re_).
    'resend_api_key' => '',

    // REQUIRED for post digest — must match a verified Resend domain.
    // Example when updates.digicarotene.in is verified:
    // 'Digi Carotene <noreply@updates.digicarotene.in>'
    'resend_from' => 'Digi Carotene <noreply@updates.digicarotene.in>',

    // Optional — link in digest email footer.
    'portal_posts_url' => 'https://digicarotene.in/team-portal/posts-management',
];
