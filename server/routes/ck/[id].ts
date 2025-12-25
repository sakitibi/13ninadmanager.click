import { defineEventHandler, sendRedirect } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        // 何も返さず Nuxt に任せる（= 404 ページ）
        return;
    }

    const supabase = useSupabase();

    const { data, error } = await supabase
        .from("13ninad.click_urls")
        .select("url")
        .eq("id", id)
        .single();

    if (error || !data?.url) {
        // throw しない
        return;
    }

    // 正常時のみリダイレクト
    return sendRedirect(event, data.url, 301);
});
