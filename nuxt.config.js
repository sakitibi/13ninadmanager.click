export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            supabaseUrl: process.env.NUXT_SUPABASE_URL,
            supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
    },
});
