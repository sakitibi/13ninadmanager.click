import { defineEventHandler, sendRedirect } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const reqUrl = event.req.url;
    if (!reqUrl) return;

    // query を除いた pathname
    const pathname = reqUrl.split("?")[0];

    // "/" と "/ck/*" は触らない
    if (pathname === "/" || pathname?.startsWith("/ck/")) {
        return;
    }

    // "/abc123" → "abc123"
    const id = pathname?.slice(1);
    if (!id) return;

    const supabase = useSupabase();

    const { data, error } = await supabase
        .from("13ninad.click_urls")
        .select("id")
        .eq("id", id)
        .single();

    if (error || !data) {
        return; // Nuxt に 404 を任せる
    }

    // 🔴 ここが重要
    sendRedirect(event, `/ck/${id}`, 301);

    // Nuxt 4 正式ルートで強制終了
    const res = event.runtime?.node?.res;
    if (res && !res.writableEnded) {
        res.end();
    }
});
