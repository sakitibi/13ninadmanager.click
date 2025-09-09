import { defineEventHandler, sendRedirect } from "h3";
import { supabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const path = event.node.req.url?.slice(1); // 先頭の "/" を除去
    if (!path) return;

    // APIで作った短縮IDか確認
    const { data } = await supabase
        .from("short_urls")
        .select("original_url")
        .eq("id", path)
        .single();

    if (data?.original_url) {
        return sendRedirect(event, data.original_url, 302);
    }
});
