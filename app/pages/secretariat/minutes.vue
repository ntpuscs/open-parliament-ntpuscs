<!-- pages/secretariat/minutes.vue -->
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useSecretariat } from '~/composables/useSecretariat'

// 應用密碼驗證中介軟體
import { definePageMeta } from '#imports'
definePageMeta({
  middleware: ['auth' as any]
})

const { bills, currentTerm, isLoading, error, generateMinutes, fetchBills } = useSecretariat();

const billOrderInput = ref(''); // 用於輸入議案順序的字串
const generatedMinutes = ref(''); // 顯示生成的會議紀錄 Markdown 文字

// 當議案資料或輸入順序改變時，重新生成會議紀錄
watch([billOrderInput, bills], () => {
  generatedMinutes.value = generateMinutes(billOrderInput.value);
}, { immediate: true }); // immediate: true 確保初始化時也執行一次

// 可以在組件掛載後再次嘗試獲取議案，以防萬一
onMounted(() => {
  if (!bills.value.length && !isLoading.value && !error.value) {
    fetchBills();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
    <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">草擬會議紀錄</h1>
      <p class="text-gray-600 mb-4 text-center">
        當前屆期：<span class="font-semibold text-blue-600">{{ currentTerm }}</span>
      </p>

      <div v-if="isLoading" class="text-center text-blue-500 mb-4">
        載入議案資料中...
      </div>
      <div v-else-if="error" class="text-center text-red-500 mb-4">
        錯誤：{{ error }}
      </div>
      <div v-else-if="!bills.length" class="text-center text-yellow-600 mb-4">
        未找到當前屆期的議案資料。
      </div>

      <div class="mb-6">
        <label for="billOrder" class="block text-gray-700 text-sm font-bold mb-2">
          輸入議案編號順序 (例如: 1, 2, 4, 3):
        </label>
        <input type="text" id="billOrder" v-model="billOrderInput"
          class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="請輸入議案編號，以逗號分隔" />
      </div>

      <div class="mb-6">
        <label for="minutesOutput" class="block text-gray-700 text-sm font-bold mb-2">
          生成的會議紀錄 (Markdown 格式)：
        </label>
        <textarea id="minutesOutput" rows="20" readonly :value="generatedMinutes"
          class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight bg-gray-50 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
      </div>

      <div class="flex justify-between items-center">
        <NuxtLink to="/secretariat"
          class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md">
          返回秘書處首頁
        </NuxtLink>
        <button @click="billOrderInput = ''"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out shadow-md">
          清除
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以根據需要添加額外的樣式 */
</style>
