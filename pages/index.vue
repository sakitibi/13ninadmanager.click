<script setup lang="ts">
import { ref } from "vue";
import { $fetch } from 'ofetch'  // ✅ これで型エラー解決

const input = ref("");
const shortUrl = ref("");

async function shorten() {
    const res = await $fetch<{ shortUrl: string }>("/api/shorten", {
        method: "POST",
        body: { url: input.value }
    });
    shortUrl.value = res.shortUrl;
}
</script>

<template>
    <div class="p-8 max-w-xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">URL短縮サービス</h1>
        <div class="flex gap-2">
            <input
                v-model="input"
                placeholder="https://example.com"
                class="border rounded p-2 flex-1"
            />
            <button @click="shorten" class="bg-blue-500 text-white px-4 py-2 rounded">
                短縮
            </button>
        </div>

        <div v-if="shortUrl" class="mt-4">
            <p>短縮URL: <a :href="shortUrl" class="text-blue-600 underline">{{ shortUrl }}</a></p>
        </div>
    </div>
</template>
