<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">歷屆議案總覽</h1>
      <p class="text-gray-600 dark:text-gray-300">點選屆次，查看該屆學生議會議案資料</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NuxtLink 
        v-for="term in availableTermsRange" 
        :key="term" 
        :to="`/bill/${term}`"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      >
        <div class="p-6">
          <div class="text-primary text-sm font-semibold mb-2 dark:text-primary-400">第 {{ term }} 屆</div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">學生議會</h2>
          <p class="text-gray-600 dark:text-gray-400 text-sm mt-2">點擊查看本屆議案</p>
        </div>
        <div 
          v-if="term === currentTerm" 
          class="bg-primary-500 dark:bg-primary-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg absolute top-0 right-0"
        >
          當前屆次
        </div>
      </NuxtLink>
    </div>

    <div class="mt-12 text-center text-gray-500 dark:text-gray-400">
      <p>資料範圍：第 {{ STARTING_TERM }} 屆起</p>
    </div>

    <!-- 舊版查詢系統連結 -->
    <div class="mt-8 text-center">
      <a 
        href="https://ntpusu.org/conference/legi-sanxia/bill-sanxia"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-400"
      >
        舊版已提案件查詢系統
        <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue' // 確保引入 computed
import { useCurrentTerm } from '~/composables/useCurrentTerm'

// SEO 設定
definePageMeta({
  title: '議案查詢 - 三峽校區議事服務',
  description: '查看國立臺北大學學生自治會三峽校區學生議會歷屆議案資料'
})

// 使用新的 Composables 獲取當前屆次和屆次範圍
const { currentTerm, availableTermsRange } = useCurrentTerm()

// 設定起始屆次
const STARTING_TERM = 23;

</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* 確保 NuxtLink 的樣式能正常應用 */
.grid-cols-1 > a {
  position: relative; /* 為了 "當前屆次" 標籤的定位 */
}
</style>