<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">已提議案查詢</h1>
      <p class="text-gray-600 dark:text-gray-300">系統提供「本屆」、「歷屆」議案查詢</p>
    </div>

    <div class="w-full max-w-[1000px] h-[450px] mx-auto bg-primary-100">
        <iframe src="https://www.appsheet.com/start/44df5ea0-8f78-4d04-b897-79d7ca662248"  width="100%" height="450" />
    </div>

    <div class="mt-12 text-center text-gray-500 dark:text-gray-400">
      <p>如果在網頁中看不到提案查詢系統畫面，請您<a href="https://www.appsheet.com/start/44df5ea0-8f78-4d04-b897-79d7ca662248" target="_blank">直接點選連結</a>瀏覽。</p>
      <p>資料範圍：第 23 屆起。</p>
    </div>

    <!-- 新版查詢系統連結 -->
    <div class="mt-8 text-center">
      <NuxtLink 
        to="/bill/new-list"
        rel="noopener noreferrer"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-400"
      >
        新版查詢介面 (測試中)
        <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue' // 確保引入 computed

// SEO 設定
definePageMeta({
  title: '議案查詢 - 三峽校區議事服務',
  description: '查看國立臺北大學學生自治會三峽校區學生議會歷屆議案資料'
})

</script>

<style scoped>
.container {
  max-width: 1200px;
}

</style>