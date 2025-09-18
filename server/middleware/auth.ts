import { defineNuxtRouteMiddleware } from "#imports"; // Nuxt の自動インポート
import { useSupabase } from "@/utils/supabase";
import { ALLOWED_USER_IDS } from "@/config/allowedUser";
import { createError } from "h3"; // ← #app ではなく h3 から

export default defineNuxtRouteMiddleware(async () => {
    const supabase = useSupabase();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }

    if (!ALLOWED_USER_IDS.includes(user.id)) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
});
