import { createClient } from "@supabase/supabase-js";

// Server-side Supabase admin client for sending OTPs
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
