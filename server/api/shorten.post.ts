import { defineEventHandler, readBody, createError, getRequestURL } from "h3";
import { nanoid } from "nanoid";
import { supabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ url: string }>(event);
    if (!body?.url) {
        throw createError({ statusCode: 400, statusMessage: "URL is required" });
    }

    const id = nanoid(6);

    const { error } = await supabase
        .from("short_urls")
        .insert({ id, original_url: body.url });

    if (error) {
        console.error(error);
        throw createError({ statusCode: 500, statusMessage: "DB insert failed" });
    }

    return { shortUrl: `${getRequestURL(event).origin}/${id}` };
});
