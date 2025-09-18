import { defineEventHandler, readBody, createError, getRequestURL } from "h3";
import { nanoid } from "nanoid";
import { useSupabase } from "@/utils/supabase";

export default defineEventHandler(async (event) => {
    const body = await readBody<{ url: string, description: string | null}>(event);
    if (!body?.url) {
        throw createError({ statusCode: 400, statusMessage: "URL is required" });
    }
    const idlength:number = Math.floor(Math.random() * 100) + 100
    const id = nanoid(idlength);
    const supabase = useSupabase();
    const { error } = await supabase
        .from("short_urls")
        .insert({
            id,
            original_url: body.url,
            description: body.description
        });

    if (error) {
        console.error(error);
        throw createError({ statusCode: 500, statusMessage: "DB insert failed" });
    }

    return { shortUrl: `${getRequestURL(event).origin}/${id}`, outputDesc: body.description };
});
