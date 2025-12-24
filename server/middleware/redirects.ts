import { defineEventHandler, redirect } from 'h3'
import { useSupabase } from '@/utils/supabase'

export default defineEventHandler(async (event) => {
    const path = event.req.url?.slice(1) // "/" を除去
    const supabase = useSupabase();
    if (!path) return // ルートなら何もしない

    // APIで作った短縮IDか確認
    const { data } = await supabase
        .from('13ninad.click_urls')
        .select('url')
        .eq('id', path)
        .single()

    if (data?.url) {
        // 短縮URLならリダイレクト
        return redirect(data.url, 301)
    }
})
