import { defineEventHandler, sendRedirect, createError } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw createError({ statusCode: 404 });
    }

    const supabase = useSupabase();

    const { data, error } = await supabase
        .from("13ninad.click_urls")
        .select("legacy")
        .eq("id", id)
        .single();

    if (error || !data) {
        throw createError({ statusCode: 404 });
    }

    // legacy=true → 直接リダイレクト
    if (data.legacy === true) {
        const { data: urlData } = await supabase
        .from("13ninad.click_urls")
        .select("url")
        .eq("id", id)
        .single();

        if (!urlData) {
        throw createError({ statusCode: 404 });
        }

        return sendRedirect(event, urlData.url, 301);
    }

    // legacy=false → /ck に転送
    return sendRedirect(event, `/ck/${id}`, 302);
});
