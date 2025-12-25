import { defineEventHandler, sendRedirect, createError } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: "ID is required" });
    }

    const supabase = useSupabase();

    const { data, error } = await supabase
        .from("13ninad.click_urls")
        .select("url, legacy")
        .eq("id", id)
        .single();

    // legacy=false のみ許可
    if (error || !data || data.legacy === true) {
        throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return sendRedirect(event, data.url, 301);
});
