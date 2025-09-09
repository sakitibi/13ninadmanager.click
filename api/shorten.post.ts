import { nanoid } from "nanoid"; // ランダムID生成用
// 保存先：とりあえず簡単にメモリ or KV
const store: Record<string, string> = {};

export default defineEventHandler(async (event) => {
    const body = await readBody<{ url: string }>(event);

    if (!body?.url) {
        throw createError({ statusCode: 400, statusMessage: "URL is required" });
    }

    const id = nanoid(6);
    store[id] = body.url;

    return { shortUrl: `${getRequestURL(event).origin}/${id}` };
});
