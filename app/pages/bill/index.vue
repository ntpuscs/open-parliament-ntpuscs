<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">議案查詢</h1>
      <p class="text-gray-600 dark:text-gray-300">點選屆次，查看該屆學生議會議案資料</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NuxtLink 
        v-for="term in getValidTerms()" 
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
          v-if="term === getCurrentTerm()" 
          class="bg-primary-500 dark:bg-primary-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg absolute top-0 right-0"
        >
          當前屆次
        </div>
      </NuxtLink>
    </div>

    <div class="mt-12 text-center text-gray-500 dark:text-gray-400">
      <p>資料範圍：第 {{ getEarliestTerm() }} 屆起</p>
    </div>

    <!-- 舊版查詢系統連結 -->
    <div class="mt-8 text-center">
      <NuxtLink 
        to="/bill/classical"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-400"
      >
        傳統查詢介面
        <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
      </NuxtLink>
    </div>
      
    <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-500 mr-2" />
          <p class="text-red-700 dark:text-red-300">{{ error.message || '載入資料失敗' }}</p>
        </div>
      </div>

      <div v-if="pending" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span class="ml-2 text-gray-600 dark:text-gray-300">載入中...</span>
      </div>

      <div v-if="!pending && !error" class="mb-8">
      </div>

      <div v-if="!pending && !error" class="space-y-6">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          最新 10 筆議案
        </div>

        <div class="grid gap-4">
          <BillCardSimple
            v-for="bill in newestBills"
            :key="bill.rowIndex"
            :bill="bill"
          />
        </div>
      </div>

  </div>
</template>

<script setup>
import { computed } from 'vue' // 確保引入 computed
import { getCurrentTerm, getValidTerms, getEarliestTerm } from '../../../shared/utils/term'

const { data: newestBills, pending, error,  } = await useFetch(`/api/bills?limit=10`);

// SEO 設定
definePageMeta({
  title: '議案查詢',
  description: '查看國立臺北大學三峽校區學生議會歷屆議案資料。'
})

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