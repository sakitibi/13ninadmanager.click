import { defineEventHandler, readBody, createError, getRequestURL } from "h3";
import { nanoid } from "nanoid";
import { useSupabaseServer } from "@/utils/supabase.server";

export default defineEventHandler(async (event) => {
    try{
        const body = await readBody<Partial<{ url: string; description: string }>>(event);

        if (!body?.url) {
            throw createError({ statusCode: 400, statusMessage: "URL is required" });
        }

        const id = nanoid(Math.floor(Math.random() * 100) + 100);
        const supabase = useSupabaseServer();

        const { error } = await supabase
            .from('"13ninad_click_urls"')
            .insert({ id, url: body.url, description: body.description });

        if (error) {
            // Supabase のエラー情報をそのままクライアントに返す
            return { error: true, statusCode: 500, message: error.message, details: error };
        }

        return {
            shortUrl: `${getRequestURL(event).origin}/ck/${id}`,
            outputDesc: body.description,
        };
    } catch(e){
        return { error: true, statusCode: 500, message: e };
    }
});
