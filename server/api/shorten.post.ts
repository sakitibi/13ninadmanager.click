import { defineEventHandler, readBody, createError, getRequestURL } from "h3";
import { nanoid } from "nanoid";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ url: string; description: string | null }>(event);

    if (!body?.url) {
        throw createError({
            statusCode: 400,
            statusMessage: "URL is required",
        });
    }

    const idLength = Math.floor(Math.random() * 100) + 100;
    const id = nanoid(idLength);

    const supabase = useSupabase();
    const { error } = await supabase
        .from("13ninad.click_urls")
        .insert({
            id,
            url: body.url,
            description: body.description,
        });

    if (error) {
        console.error(error);
        throw createError({
            statusCode: 500,
            statusMessage: "DB insert failed",
        });
    }

    return {
        shortUrl: `${getRequestURL(event).origin}/ck/${id}`,
        outputDesc: body.description,
    };
});
