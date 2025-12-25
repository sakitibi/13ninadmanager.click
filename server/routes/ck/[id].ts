import { defineEventHandler, sendRedirect } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    console.log("[ck] request id:", id);

    if (!id) return;

    const supabase = useSupabase();

    const { data, error } = await supabase
        .from("13ninad.click_urls")
        .select("url")
        .eq("id", id)
        .single();

    if (error || !data?.url) {
        console.log("[ck] not found");
        return;
    }

    console.log("[ck] redirect to:", data.url);

    // h3 の正式な redirect
    sendRedirect(event, data.url, 301);

    // ✅ Nuxt 4 正式: runtime.node.res を使う
    const res = event.runtime?.node?.res;
    if (res && !res.writableEnded) {
        res.end();
    }
});
