export default defineEventHandler((event) => {
    const id = event.context.params?.id;
    // デモ用: 同じstoreを参照
    const store: Record<string, string> = (global as any).store || {};
    const url = store[id!];

    if (!url) {
        throw createError({ statusCode: 404, statusMessage: "Not Found" });
    }

    return sendRedirect(event, url, 302);
});
