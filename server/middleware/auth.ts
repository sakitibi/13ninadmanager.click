import { defineNuxtRouteMiddleware, navigateTo, createError } from "#app";
import { useSupabase } from "@/utils/supabase";
import { ALLOWED_USER_IDS } from "@/config/allowedUser";

export default defineNuxtRouteMiddleware(async () => {
    const supabase = useSupabase();

    // 現在のログインユーザーを取得
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    // デバッグ用
    console.log("Supabase user:", user);

    // 未ログインの場合はログインページへリダイレクト
    if (!user) {
        return navigateTo("/login"); 
    }

    // 管理者に含まれていなければ 403
    const isAllowed = ALLOWED_USER_IDS.includes(user.id);
    if (!isAllowed) {
        throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
});
