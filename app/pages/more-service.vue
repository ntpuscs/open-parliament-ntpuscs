<template>
  <div>
    
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <!-- 頁面標題 -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            議事專區
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            提案相關表單範本與系統服務
          </p>
        </div>

        <!-- 服務區塊 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 提案系統 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-indigo-600">
            <div class="flex items-center mb-4">
              <svg class="w-8 h-8 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                提案系統
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              本會議員與機關提案用
            </p>
            <button 
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              @click="handleServiceClick('提案系統')"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              前往系統
            </button>
          </div>

          <!-- 提案附件範本 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-blue-600">
            <div class="flex items-center mb-4">
              <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                提案附件範本
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              提案相關表單與文件範本下載
            </p>
            <div class="space-y-2">
              <a 
                :href="TEMPLATE_LINKS.regulationAmendment" 
                class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                📋 法規案 修正條文對照表
              </a>
              <a 
                :href="TEMPLATE_LINKS.budgetForm" 
                class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 預算案 總預算書範例
              </a>
              <a 
                :href="TEMPLATE_LINKS.budgetZhuijia" 
                class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 預算案 追加預算書範例
              </a>
              <a 
                :href="TEMPLATE_LINKS.priceComparison" 
                class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                📊 預算案 比價資料單
              </a>
              <a 
                :href="TEMPLATE_LINKS.juesuan" 
                class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 決算案 總決算書範例
              </a>
              
              <a 
                :href="TEMPLATE_LINKS.personalResume" 
                class="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                📝 人事案 人事簡歷表
              </a>
            </div>
          </div>

          <!-- 邀請備詢系統 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-green-600">
            <div class="flex items-center mb-4">
              <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                邀請備詢系統
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              邀請相關人員列席會議，以備質（諮）詢
            </p>
            <button 
              class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              @click="handleServiceClick('邀請備詢系統')"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              前往系統
            </button>
          </div>

          <!-- 議事規則查詢 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-orange-600">
            <div class="flex items-center mb-4">
              <svg class="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                議事規則查詢
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              查詢議事規則、組織規程等相關法規
            </p>
            <button 
              class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              @click="handleServiceClick('議事規則查詢')"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              查詢規則
            </button>
          </div>

          <!-- 預算變更系統 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-purple-600">
            <div class="flex items-center mb-4">
              <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                預算變更系統
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              審議預算時，提議刪減/凍結
            </p>
            <button 
              class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              @click="handleServiceClick('預算變更系統')"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              前往系統
            </button>
          </div>

          <!-- 動議系統 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-cyan-600">
            <div class="flex items-center mb-4">
              <svg class="w-8 h-8 text-cyan-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h4m0 0V7m0 4l-4-4-4 4" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                動議系統
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              會議中以文字提出較複雜之動議
            </p>
            <button 
              class="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              @click="handleServiceClick('動議系統')"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              前往系統
            </button>
          </div>
        </div>

        <!-- 返回首頁與秘書處排案系統按鈕 -->
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <!-- 返回首頁 -->
          <NuxtLink 
            to="/" 
            class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首頁
          </NuxtLink>

          <!-- 秘書處排案系統 -->
          <NuxtLink 
            to="/secretariat" 
            class="inline-flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8M8 12h8m-8-4h8M4 6h16M4 18h16" />
            </svg>
            秘書處排案系統
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { EXTERNAL_LINKS } from '~/utils/constants.js'
    
useHead({
  title: `其他服務 - 三峽校區議事服務`,
  meta: [
    {
      name: 'description',
      content: `本會其他資訊服務，包括提案附件範本、邀請備詢系統、預算變更系統、議事規則查詢、會議直播等。`
    }
  ]
})


// 處理服務點擊事件
const handleServiceClick = (serviceName) => {

switch (serviceName) {
  
  case '提案系統':
    window.open(EXTERNAL_LINKS.proposalSystem, '_blank');
     break;
  case '邀請備詢系統':
    window.open(EXTERNAL_LINKS.inviteSystem, '_blank');
     break;
   case '預算變更系統':
     window.open(EXTERNAL_LINKS.budgetSystem, '_blank');
     break;
   case '動議系統':
     window.open(EXTERNAL_LINKS.motionSystem, '_blank');
     break;
   case '議事規則查詢':
     window.open(EXTERNAL_LINKS.yiShiGuiZe, '_blank');
     break;
   case '會議直播':
     window.open(EXTERNAL_LINKS.liveStream, '_blank');
     break;
 }
};
</script>

<style scoped>
/* 自定義樣式 */
.container {
  min-height: calc(100vh - 200px);
}

/* 卡片懸停效果 */
.bg-white:hover,
.dark .bg-gray-800:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* 按鈕動畫 */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>