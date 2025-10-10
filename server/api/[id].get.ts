import { defineEventHandler, sendRedirect, createError } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    const supabase = useSupabase();
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: "ID is required" });
    }
    const { data, error } = await supabase
        .from("13ninad.click_urls")
        .select("url")
        .eq("id", id)
        .single();

    if (error || !data) {
        throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return sendRedirect(event, data.url, 301);
});
