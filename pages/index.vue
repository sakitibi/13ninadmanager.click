<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSupabase } from "@/utils/supabase";
import { ALLOWED_USER_IDS } from "@/config/allowedUser";

// フォーム用 state
const inputURL = ref<string>("");
const inputDesc = ref<string>("");
const shortUrl = ref<string>("");
const outputDesc = ref<string>("");

// 403 管理用
const forbidden = ref<boolean>(true);
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
    const loginFlag = params.get("login"); // ←追加

    // token がある場合は supabase セッションをセット
    if (token) {
        await supabase.auth.setSession({ access_token: token, refresh_token: "" });
    }

    // supabase からユーザー情報取得
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    console.log("Supabase user:", user);

    // login=true が URL にあれば強制的にログイン済みフラグ
    if (loginFlag === "true" && !!user) {
        Islogin.value = true;
        if(ALLOWED_USER_IDS.includes(user.id)){
            forbidden.value = false;
        } else {
            forbidden.value = true;
        }
    } else {
        Islogin.value = false;
    }
    if(!user){
        if (!Islogin.value) Islogin.value = false;
    } else if (!ALLOWED_USER_IDS.includes(user.id)) {
        Islogin.value = true;
        forbidden.value = true;
    } else {
        Islogin.value = true;
        forbidden.value = false;
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
        window.location.href = `/?token=${token}`;
    }
}

// ログアウト
async function logout() {
    await supabase.auth.signOut();
    window.location.reload();
}

// サインアップ（メール + パスワード）
function signup() {
    window.location.replace("https://asakura-wiki.vercel.app/login/signup");
}
</script>
<template>
    <div class="p-8 max-w-xl mx-auto">
        <div v-if="Islogin">
            <!-- 403 表示 -->
            <div v-if="forbidden" class="text-red-600 font-bold text-lg">
                <h1>403 forbidden</h1>
                <p>あなたはこのページにアクセスする権限がありません、</p>
            </div>
            <!-- URL短縮フォーム -->
            <div v-else>
                <h1 class="text-2xl font-bold mb-4">URL暗号化サービス</h1>
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
                    暗号化
                    </button>
                </form>
                <div v-if="shortUrl" class="mt-4">
                    <p>
                    暗号化URL:
                    <a :href="shortUrl" class="text-blue-600 underline">{{ shortUrl }}</a>
                    </p>
                    <p v-if="outputDesc">説明: {{ outputDesc }}</p>
                </div>
                <button @click="logout">ログアウト</button>
                <button @click="signup">まだ登録していませんか?</button>
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
