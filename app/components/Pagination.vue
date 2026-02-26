<template>
  <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 sm:px-6 rounded-b-lg">
    <!-- 手機版分頁 -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="goToPrevious"
        :disabled="currentPage === 1"
        :class="[
          'relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        上一頁
      </button>
      <button
        @click="goToNext"
        :disabled="currentPage === totalPages"
        :class="[
          'relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        下一頁
      </button>
    </div>

    <!-- 桌面版分頁 -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700 dark:text-gray-300">
          顯示第
          <span class="font-medium">{{ startItem }}</span>
          到
          <span class="font-medium">{{ endItem }}</span>
          筆，共
          <span class="font-medium">{{ totalItems }}</span>
          筆資料
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- 上一頁按鈕 -->
          <button
            @click="goToPrevious"
            :disabled="currentPage === 1"
            :class="[
              'relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 transition-colors',
              currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-800'
            ]"
          >
            <span class="sr-only">上一頁</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- 頁碼按鈕 -->
          <template v-for="page in displayPages" :key="page">
            <button
              v-if="page !== '...'"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 transition-colors',
                page === currentPage 
                  ? 'z-10 bg-primary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary' 
                  : 'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-offset-0 bg-white dark:bg-gray-800"
            >
              ...
            </span>
          </template>

          <!-- 下一頁按鈕 -->
          <button
            @click="goToNext"
            :disabled="currentPage === totalPages"
            :class="[
              'relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 transition-colors',
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-800'
            ]"
          >
            <span class="sr-only">下一頁</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:currentPage'])

const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.itemsPerPage
  return Math.min(end, props.totalItems)
})

const displayPages = computed(() => {
  const pages = []
  const current = props.currentPage
  const total = props.totalPages

  if (total <= 7) {
    // 如果總頁數不超過7頁，顯示所有頁碼
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 總頁數超過7頁時的邏輯
    if (current <= 4) {
      // 當前頁在前4頁
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 當前頁在後4頁
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 當前頁在中間
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const goToPage = (page) => {
  if (page !== '...' && page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}

const goToPrevious = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1)
  }
}

const goToNext = () => {
  if (props.currentPage < props.totalPages) {
    emit('update:currentPage', props.currentPage + 1)
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #0F2D4B;
}

.focus-visible\:outline-primary:focus-visible {
  outline-color: #0F2D4B;
}

.focus\:z-20:focus {
  z-index: 20;
}

.focus-visible\:outline:focus-visible {
  outline-style: solid;
}

.focus-visible\:outline-2:focus-visible {
  outline-width: 2px;
}

.focus-visible\:outline-offset-2:focus-visible {
  outline-offset: 2px;
}
</style>