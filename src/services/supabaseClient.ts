import { createClient } from "@supabase/supabase-js";

// Base connection for every service. All API calls go through this single client.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/** Public URL + key for Edge Function fetch (session token proves the user). */
export const supabaseConfig = {
  url: supabaseUrl,
  publishableKey: supabaseKey,
};
