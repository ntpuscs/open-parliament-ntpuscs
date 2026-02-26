<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 print:hidden">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo 和網站名稱 -->
        <div class="flex items-center space-x-3">
          <NuxtLink to="/" class="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div class="w-8 h-8 bg-primary rounded-md flex items-center justify-center dark:bg-primary-400">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">三峽校區議事服務</h1>
          </NuxtLink>
        </div>

        <!-- 桌面版導覽選單 -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink 
            to="/bill" 
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            議案查詢
          </NuxtLink>
          <a 
            :href="EXTERNAL_LINKS.meetingRecords" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            會議紀錄
          </a>
          <NuxtLink 
            to="/more-service" 
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            議事專區
          </NuxtLink>
          <a 
            :href="EXTERNAL_LINKS.mainWebsite" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            回到會網
          </a>
          <ThemeToggle />
        </nav>

        <!-- 行動版選單按鈕 -->
        <div class="md:hidden flex items-center space-x-3">
          <ThemeToggle />
          <button 
            @click="toggleMobileMenu"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 行動版選單 -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
        <nav class="flex flex-col space-y-3">
          <NuxtLink 
            to="/bill" 
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors py-2"
            @click="closeMobileMenu"
          >
            議案查詢
          </NuxtLink>
          <a 
            :href="EXTERNAL_LINKS.meetingRecords" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors py-2"
          >
            會議紀錄
          </a>
          <NuxtLink 
            to="/more-service" 
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors py-2"
            @click="closeMobileMenu"
          >
            議事專區
          </NuxtLink>
          <a 
            :href="EXTERNAL_LINKS.mainWebsite" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition-colors py-2"
          >
            回到會網
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import ThemeToggle from '~/components/ThemeToggle.vue'

const config = useRuntimeConfig()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// 點擊外部關閉選單
onMounted(() => {
  const handleClickOutside = (event) => {
    if (mobileMenuOpen.value && !event.target.closest('header')) {
      mobileMenuOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>