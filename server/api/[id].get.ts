import { defineEventHandler, createError, sendRedirect } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) return;

    const supabase = useSupabase();

    const { data, error } = await supabase
        .from("13ninad.click_urls")
        .select("url, legacy")
        .eq("id", id)
        .single();

    // legacy=true のみ許可
    if (error || !data || data.legacy !== true) {
        throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return sendRedirect(event, data.url, 301);
});