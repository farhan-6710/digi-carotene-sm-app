/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  /** Hostinger PHP folder URL, e.g. https://digicarotene.in/php */
  /** Hostinger PHP base URL for Resend emails (digests / custom report). */
  readonly VITE_GROWTH_PHP_BASE_URL?: string;
  /** Same value as scripts/php/config.php cron_secret — custom report email only. */
  readonly VITE_GROWTH_PHP_CRON_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
