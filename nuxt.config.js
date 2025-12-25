export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            supabaseUrl: process.env.NUXT_SUPABASE_URL,
            supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
        },
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
});
