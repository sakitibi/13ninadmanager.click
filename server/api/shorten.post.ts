import { defineEventHandler, readBody, getRequestURL } from "h3";
import { nanoid } from "nanoid";
import { useSupabaseServer } from "@/utils/supabase.server";

export default defineEventHandler(async (event) => {
    try {
        // H3 標準の readBody で安全に body を取得
        const body = await readBody<Partial<{ url: string; description: string }>>(event);

        if (!body?.url) {
            return { error: true, statusCode: 400, message: "URL is required" };
        }

        const id = nanoid(Math.floor(Math.random() * 100) + 100);
        const supabase = useSupabaseServer();

        const { error } = await supabase
            .from('"public"."13ninad_click_urls"')
            .insert({ id, url: body.url, description: body.description ?? null });

        if (error) {
            return { error: true, statusCode: 500, message: error.message, details: error };
        }

        return {
            error: false,
            statusCode: 200,
            shortUrl: `${getRequestURL(event).origin}/ck/${id}`,
            outputDesc: body.description ?? null,
        };
    } catch (err: any) {
        return { error: true, statusCode: 500, message: err.message ?? "Unknown server error" };
    }
});