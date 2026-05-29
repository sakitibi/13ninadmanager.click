import { createClient } from "@supabase/supabase-js";

export const useSupabaseServer = () => {
    const config = useRuntimeConfig();
    return createClient(
        config.public.supabaseUrl as string,
        config.supabaseServiceRoleKey as string
    );
};
