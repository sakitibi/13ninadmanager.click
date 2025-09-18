import { defineEventHandler, sendRedirect } from 'h3'
import { useSupabase } from '@/utils/supabase'

export default defineEventHandler(async (event) => {
    const path = event.node.req.url?.slice(1) // "/" を除去
    const supabase = useSupabase();
    if (!path) return // ルートなら何もしない

    // APIで作った短縮IDか確認
    const { data } = await supabase
        .from('short_urls')
        .select('original_url')
        .eq('id', path)
        .single()

    if (data?.original_url) {
        // 短縮URLならリダイレクト
        return sendRedirect(event, data.original_url, 301)
    }
})
