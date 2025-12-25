import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
    const config = useRuntimeConfig();
    return createClient(
        config.public.supabaseUrl as string,
        config.public.supabaseServiceRoleKey as string
    );
};
