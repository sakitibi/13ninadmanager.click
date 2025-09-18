<script setup lang="ts">
import { ref, onMounted } from "vue";
import { $fetch } from "ofetch";
import { useSupabase } from "@/utils/supabase";
import { ALLOWED_USER_IDS } from "@/config/allowedUser";

// フォーム用 state
const inputURL = ref<string>("");
const inputDesc = ref<string>("");
const shortUrl = ref<string>("");
const outputDesc = ref<string>("");

// 403 管理用
const forbidden = ref(false);

// Supabase クライアント作成
const supabase = useSupabase();

// ページマウント時にクライアントサイドで認証チェック
onMounted(async () => {
    try {
        const { data } = await supabase.auth.getUser();
        const user = data.user;

        console.log("Supabase user:", user);
        console.log("Supabase user.id:", user?.id);

        if (!user || !ALLOWED_USER_IDS.includes(user.id)) {
            forbidden.value = true;
        }
    } catch (err) {
        console.error("Failed to get user:", err);
        forbidden.value = true;
    }
});

// 短縮URL作成関数
async function shorten(e: SubmitEvent) {
    e.preventDefault();
    if (forbidden.value) return;

    try {
        const res = await $fetch<{ shortUrl: string; outputDesc: string }>("/api/shorten", {
            method: "POST",
            body: { url: inputURL.value, description: inputDesc.value ?? null },
        });
        shortUrl.value = res.shortUrl;
        outputDesc.value = res.outputDesc;
    } catch (err) {
        console.error("Failed to shorten URL:", err);
    }
}
</script>
<template>
    <div class="p-8 max-w-xl mx-auto">
        <!-- 403 表示 -->
        <div v-if="forbidden" class="text-red-600 font-bold text-lg">
        403 Forbidden
        </div>
        <!-- URL短縮フォーム -->
        <div v-else>
            <h1 class="text-2xl font-bold mb-4">URL短縮サービス</h1>
            <form @submit="shorten" class="flex gap-2">
                <input
                    v-model="inputURL"
                    placeholder="https://example.com"
                    class="border rounded p-2 flex-1"
                    required
                />
                <input
                    v-model="inputDesc"
                    placeholder="description"
                    class="border rounded p-2 flex-1"
                />
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
                短縮
                </button>
            </form>
            <div v-if="shortUrl" class="mt-4">
                <p>
                短縮URL:
                <a :href="shortUrl" class="text-blue-600 underline">{{ shortUrl }}</a>
                </p>
                <p v-if="outputDesc">説明: {{ outputDesc }}</p>
            </div>
        </div>
    </div>
</template>
