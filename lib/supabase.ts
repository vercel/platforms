import { createClient } from '@supabase/supabase-js';

// Service role key bypasses RLS — safe here because this module is server-side only.
// When auth is implemented, replace with a per-request authenticated client so
// RLS policies enforce account isolation automatically.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
