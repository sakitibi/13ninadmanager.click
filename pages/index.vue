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
const forbidden = ref<boolean>(false);
const Islogin = ref<boolean>(false);
const email = ref("");
const password = ref("");
const errorMsg = ref("");

// Supabase クライアント作成
const supabase = useSupabase();

// ページマウント時にクライアントサイドで認証チェック

onMounted(async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
        await supabase.auth.setSession({ access_token: token, refresh_token: "" });
    }

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    console.log("Supabase user:", user);

    if (!user || !ALLOWED_USER_IDS.includes(user.id)) {
        forbidden.value = true;
    }
});

async function shorten(e: SubmitEvent) {
    e.preventDefault();
    if (forbidden.value) return;

    const res = await fetch("/api/shorten", {
        method: "POST",
        body: JSON.stringify({ url: inputURL.value, description: inputDesc.value }),
        headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    shortUrl.value = result.shortUrl;
    outputDesc.value = result.outputDesc;
}

async function login(e: SubmitEvent) {
    e.preventDefault();
    errorMsg.value = "";

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    if (error) {
        errorMsg.value = error.message;
        return;
    }

    // 成功したら access_token を取得して index.vue へリダイレクト
    const token = data.session?.access_token;
    if (token) {
        window.location.href = `/index?token=${token}`;
    }
}
</script>
<template>
    <div class="p-8 max-w-xl mx-auto">
        <div v-if="Islogin">
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
        <div v-else>
            <h1 class="text-2xl font-bold mb-4">ログイン</h1>
            <form @submit="login" class="flex flex-col gap-2">
                <input v-model="email" type="email" placeholder="Email" class="border p-2 rounded" required />
                <input v-model="password" type="password" placeholder="Password" class="border p-2 rounded" required />
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">ログイン</button>
            </form>
            <p v-if="errorMsg" class="text-red-600 mt-2">{{ errorMsg }}</p>
        </div>
    </div>
</template>
