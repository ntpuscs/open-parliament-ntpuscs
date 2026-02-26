<template>
  <div class="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
    <AppHeader />

    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import AppHeader from '~/components/AppHeader.vue' // 引入頂部導覽列組件
import AppFooter from '~/components/AppFooter.vue' // 引入底部頁腳組件

// 錯誤處理：捕獲子組件中的錯誤
// 這是一個全局的錯誤捕獲機制，可以在這裡處理應用中發生的任何未捕獲的錯誤。
onErrorCaptured((err, vm, info) => {
  console.error('An error occurred in a component:', err)
  console.error('Component instance:', vm)
  console.error('Error info:', info)
  // 您可以在這裡進一步處理錯誤，例如顯示錯誤訊息給用戶，或將錯誤發送到錯誤追蹤服務
  // 例如：alert('Oops! Something went wrong. Please try again later.')
  // 如果返回 false，則錯誤不會繼續向上傳播
  return true
})
</script>