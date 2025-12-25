import { defineEventHandler, readBody, createError, getRequestURL } from "h3";
import { nanoid } from "nanoid";
import { useSupabaseServer } from "@/utils/supabase.server";

export default defineEventHandler(async (event) => {
    // 型を Partial にして、最初は空オブジェクトでもOKにする
    const body = await readBody<Partial<{ url: string; description: string }>>(event);

    if (!body?.url) {
        throw createError({ statusCode: 400, statusMessage: "URL is required" });
    }

    const id = nanoid(Math.floor(Math.random() * 100) + 100); // 短すぎないように注意
    const supabase = useSupabaseServer();

    const { error } = await supabase
        .from("13ninad_click_urls")
        .insert({ id, url: body.url, description: body.description });

    if (error) {
        console.error("Supabase insert error:", error);
        throw createError({ statusCode: 500, statusMessage: "DB insert failed" });
    }

    return {
        shortUrl: `${getRequestURL(event).origin}/ck/${id}`,
        outputDesc: body.description,
    };
});
