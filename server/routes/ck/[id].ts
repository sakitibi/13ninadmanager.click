import { defineEventHandler, sendRedirect } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    console.log("[ck] request id:", id);

    if (!id) {
        console.log("[ck] id missing");
        return;
    }

    const supabase = useSupabase();

    const { data, error } = await supabase
        .from("13ninad.click_urls")
        .select("url")
        .eq("id", id)
        .single();

    if (error) {
        console.error("[ck] supabase error:", error);
        return;
    }

    if (!data?.url) {
        console.log("[ck] url not found for id:", id);
        return;
    }

    console.log("[ck] redirect to:", data.url);

    // routes では必ず return
    return sendRedirect(event, data.url, 301);
});
