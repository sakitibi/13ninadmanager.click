import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const supabase:SupabaseClient = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL!,
    process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY! // サーバー専用のキー
);