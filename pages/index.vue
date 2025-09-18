<script setup lang="ts">
import { ref } from "vue";
import { $fetch } from "ofetch";

const inputURL = ref<string>("");
const inputDesc = ref<string>("");
const shortUrl = ref<string>("");
const outputDesc = ref<string>("");

async function shorten(e: SubmitEvent) {
    e.preventDefault();
    const res = await $fetch<{ shortUrl: string; outputDesc: string }>("/api/shorten", {
        method: "POST",
        body: { url: inputURL.value, description: inputDesc.value ?? null },
    });
    shortUrl.value = res.shortUrl;
    outputDesc.value = res.outputDesc;
}
</script>
<template>
    <div class="p-8 max-w-xl mx-auto">
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
            <p>説明: {{ outputDesc }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: ["auth"], // 作成した middleware を呼ぶ
});
</script>
