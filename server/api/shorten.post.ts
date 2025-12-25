import { defineEventHandler, readBody, getRequestURL } from "h3";
import { nanoid } from "nanoid";
import { useSupabaseServer } from "@/utils/supabase.server";

export default defineEventHandler(async (event) => {
    const body = await readBody<Partial<{ url: string; description: string }>>(event);

    // URLがなければ 400 を JSON で返す
    if (!body?.url) {
        return { error: true, statusCode: 400, message: "URL is required" };
    }

    const id = nanoid(Math.floor(Math.random() * 100) + 100);
    const supabase = useSupabaseServer();

    const { error } = await supabase
        .from('"13ninad_click_urls"')
        .insert({ id, url: body.url, description: body.description ?? null });

    if (error) {
        // Supabase エラーをそのまま返す
        return { error: true, statusCode: 500, message: error.message, details: error };
    }

    return {
        shortUrl: `${getRequestURL(event).origin}/ck/${id}`,
        outputDesc: body.description,
    };
});
