import { defineEventHandler, getRequestURL } from "h3";
import { nanoid } from "nanoid";
import { useSupabaseServer } from "@/utils/supabase.server";

export default defineEventHandler(async (event) => {
    try {
        // body を安全に取得する helper
        const getJSONBody = async (): Promise<Partial<{ url: string; description: string }>> => {
            // Node.js の場合
            if (event.node?.req) {
                const req = event.node.req as any; // Node IncomingMessage として扱う
                let text = '';
                for await (const chunk of req) text += chunk;
                if (text) return JSON.parse(text);
                return {};
            }
            // Edge ランタイムの場合
            try {
                return await event.req.json();
            } catch {
                return {};
            }
        };

        const body = await getJSONBody();

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