import { defineEventHandler, sendRedirect } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    // pathname のみ取得（query 排除）
    const url = new URL(event.req.url!, "http://localhost");
    const pathname = url.pathname;

    // "/" や "/ck/xxx" は middleware では触らない
    if (pathname === "/" || pathname.startsWith("/ck/")) {
        return;
    }

    // "/abc123" → "abc123"
    const id = pathname.slice(1);
    if (!id) return;

    const supabase = useSupabase();

    const { data, error } = await supabase
        .from("13ninad.click_urls")
        .select("url, legacy")
        .eq("id", id)
        .single();

    if (error || !data) {
        return; // 404 は Nuxt に任せる
    }

    // legacy=true のみ middleware で直接リダイレクト
    if (data.legacy === true) {
        return sendRedirect(event, data.url, 301);
    }

    // legacy=false は /ck 側へ
    return sendRedirect(event, `/ck/${id}`, 302);
});
