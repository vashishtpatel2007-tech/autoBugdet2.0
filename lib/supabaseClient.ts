import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Export a function (Client Component)
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

// Export a shared client (Server Component safe)
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
