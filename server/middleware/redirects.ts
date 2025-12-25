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

    // 常に /ck に寄せる
    return sendRedirect(event, `/ck/${id}`, 301);
});
