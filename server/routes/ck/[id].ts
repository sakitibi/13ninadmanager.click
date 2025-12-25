import { defineEventHandler } from "h3";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id;
    if (!id) {
        return new Response(null, { status: 404 });
    }

    const supabase = useSupabase();

    const { data, error } = await supabase
        .schema("13ninad")
        .from("click_urls")
        .select("url")
        .eq("id", id)
        .single();

    if (error || !data?.url) {
        return new Response(null, { status: 404 });
    }

    // ★ これが最重要
    return new Response(null, {
        status: 301,
        headers: {
            Location: data.url,
        },
    });
});
