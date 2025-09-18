import { createClient } from "@supabase/supabase-js";

export const supabase = () => {
    const config = useRuntimeConfig();
    return createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string);
};
