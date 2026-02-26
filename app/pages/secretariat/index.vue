<!-- pages/secretariat/index.vue -->
<script setup lang="ts">
// 應用密碼驗證中介軟體
import { definePageMeta } from '#imports'
definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center p-4 font-inter">
    <div class="bg-white dark:bg-gray-100 p-8 rounded-lg shadow-xl w-full max-w-md text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">秘書處排案系統</h1>
      <p class="text-gray-600 mb-8">請選擇您要執行的功能：</p>

      <div class="grid grid-cols-1 gap-6">
        <NuxtLink to="/secretariat/agenda"
          class="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
          <div class="flex items-center justify-center">
            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
              </path>
            </svg>
            <span>安排議程</span>
          </div>
        </NuxtLink>

        <NuxtLink to="/secretariat/minutes"
          class="block bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
          <div class="flex items-center justify-center">
            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              </path>
            </svg>
            <span>草擬會議紀錄</span>
          </div>
        </NuxtLink>
      </div>

      <p class="mt-8 text-sm text-gray-500">
        <NuxtLink to="/" class="text-blue-500 hover:underline">網站首頁</NuxtLink>、<NuxtLink to="/more-service" class="text-blue-500 hover:underline">議事專區</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 可以根據需要添加額外的樣式 */
</style>
