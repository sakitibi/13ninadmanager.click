export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            supabaseUrl: process.env.NUXT_SUPABASE_URL,
            supabaseAnonKey: process.env.NUXT_SUPABASE_ANON_KEY,
        },
    },
});
