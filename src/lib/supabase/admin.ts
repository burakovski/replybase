import { createClient } from "@supabase/supabase-js";
import { requireSupabaseEnv } from "./env";

export function createSupabaseAdmin() {
  const { url, serviceRoleKey } = requireSupabaseEnv();
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
