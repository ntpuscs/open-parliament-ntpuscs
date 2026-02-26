<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// 設定全域 meta 標籤
useHead({
  htmlAttrs: {
    lang: 'zh-Hant-TW'
  },
  title: '三峽校區議事服務 - 國立臺北大學學生自治會',
  meta: [
    { name: 'description', content: '國立臺北大學學生自治會三峽校區學生議會議事服務系統' },
    { name: 'keywords', content: '國立臺北大學,學生自治會,三峽校區,議事服務,學生議會' },
    { property: 'og:title', content: '三峽校區議事服務 - 國立臺北大學學生自治會' },
    { property: 'og:description', content: '國立臺北大學學生自治會三峽校區學生議會議事服務系統' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>

<style>
/* 全域樣式 */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow-y: scroll;
}

/* 響應式表格樣式 */
.responsive-table {
  @apply overflow-x-auto;
}

.responsive-table table {
  @apply min-w-full divide-y divide-gray-200 dark:divide-gray-700;
}

.responsive-table th {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider;
}

.responsive-table td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100;
}

/* 分頁樣式 */
.pagination {
  @apply flex justify-center items-center space-x-2 mt-6;
}

.pagination button {
  @apply px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300;
}

.pagination button.active {
  @apply bg-primary text-white border-primary;
}

.pagination button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* 篩選表單樣式 */
.filter-form {
  @apply space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg;
}

.filter-form label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.filter-form input,
.filter-form select {
  @apply mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100;
}

/* 議案卡片樣式 */
.bill-card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 dark:border-gray-700;
}

.bill-card h3 {
  @apply text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2;
}

.bill-card .bill-number {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

/* 麵包屑導覽樣式 */
.breadcrumb {
  @apply flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4;
}

.breadcrumb a {
  @apply text-primary hover:text-primary-600 dark:hover:text-primary-400;
}

.breadcrumb span {
  @apply text-gray-400 dark:text-gray-500;
}

/* 載入動畫 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading {
  @apply inline-block w-4 h-4 border-2 border-gray-200 border-t-primary rounded-full;
  animation: spin 1s linear infinite;
}

/* 錯誤提示樣式 */
.error-message {
  @apply bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md;
}

.error-message.dark {
  @apply bg-red-900/50 border-red-800 text-red-300;
}

/* 成功提示樣式 */
.success-message {
  @apply bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md;
}

.success-message.dark {
  @apply bg-green-900/50 border-green-800 text-green-300;
}

/* 空狀態樣式 */
.empty-state {
  @apply text-center py-12;
}

.empty-state h3 {
  @apply text-lg font-medium text-gray-900 dark:text-gray-100 mb-2;
}

.empty-state p {
  @apply text-gray-600 dark:text-gray-400;
}

/* 按鈕樣式 */
.btn {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
}

.btn-primary {
  @apply text-white bg-primary hover:bg-primary-600 focus:ring-primary;
}

.btn-secondary {
  @apply text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700;
}

.btn-sm {
  @apply px-3 py-1.5 text-xs;
}

.btn-lg {
  @apply px-6 py-3 text-base;
}

/* 卡片佈局 */
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200 dark:border-gray-700;
}

.card-body {
  @apply px-6 py-4;
}

.card-footer {
  @apply px-6 py-4 border-t border-gray-200 dark:border-gray-700;
}

/* 響應式設計 */
@media (max-width: 640px) {
  .responsive-table {
    @apply text-sm;
  }
  
  .responsive-table th,
  .responsive-table td {
    @apply px-3 py-2;
  }
  
  .bill-card {
    @apply p-4;
  }
  
  .filter-form {
    @apply p-4;
  }
}
</style>