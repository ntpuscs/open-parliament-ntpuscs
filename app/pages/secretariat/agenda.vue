<!-- app/pages/secretariat/agenda.vue -->
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { definePageMeta } from '#imports'
import { useSecretariat } from '~/composables/useSecretariat'

definePageMeta({
  middleware: ['auth']
})

const { bills, currentTerm, isLoading, error, generateAgenda, fetchBills } = useSecretariat();

const billOrderInput = ref('');
const generatedAgenda = ref('');

watch([billOrderInput, bills], () => {
  generatedAgenda.value = generateAgenda(billOrderInput.value);
}, { immediate: true });

onMounted(() => {
  if (!bills.value.length && !isLoading.value && !error.value) {
    fetchBills();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">生成議程</h1>
      <p class="text-gray-600 mb-4 text-center">
        當前屆期：<span class="font-semibold text-blue-600">{{ currentTerm }}</span>
      </p>

      <!--
        用 ClientOnly 包住所有依賴動態狀態（isLoading / error / bills）的區塊。
        SSR 只渲染 #fallback 的靜態內容，客戶端接管後才渲染動態內容，
        如此 SSR 與 CSR 的 HTML 結構完全一致，消除 hydration mismatch。
      -->
      <ClientOnly>
        <div v-if="isLoading" class="text-center text-blue-500 mb-4">
          載入議案資料中...
        </div>
        <div v-else-if="error" class="text-center text-red-500 mb-4">
          錯誤：{{ error }}
        </div>
        <div v-else-if="!bills.length" class="text-center text-yellow-600 mb-4">
          未找到當前屆期的議案資料。
        </div>

        <!-- SSR 期間顯示的靜態佔位，不含任何動態狀態 -->
        <template #fallback>
          <div class="text-center text-blue-500 mb-4">載入議案資料中...</div>
        </template>
      </ClientOnly>

      <div class="mb-6">
        <label for="billOrder" class="block text-gray-700 text-sm font-bold mb-2">
          輸入議案編號順序 (例如: 1, 2, 4, 3):
        </label>
        <input
          type="text"
          id="billOrder"
          v-model="billOrderInput"
          class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="請輸入議案編號，以逗號分隔"
        />
      </div>

      <div class="mb-6">
        <label for="agendaOutput" class="block text-gray-700 text-sm font-bold mb-2">
          生成的議程：
        </label>
        <textarea
          id="agendaOutput"
          rows="15"
          readonly
          :value="generatedAgenda"
          class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
      </div>

      <div class="flex justify-between items-center">
        <NuxtLink
          to="/secretariat"
          class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md"
        >
          返回秘書處首頁
        </NuxtLink>
        <button
          @click="billOrderInput = ''"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md"
        >
          清除
        </button>
      </div>
    </div>
  </div>
</template>