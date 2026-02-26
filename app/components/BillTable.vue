<template>
  <div class="bill-table-container">
    <!-- 桌面版表格 -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              案由
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              編號
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              提案類型
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              提案機關/議員
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              提案時間
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="bill in bills"
            :key="bill.編號"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            @click="navigateToBill(bill)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ bill.案由 }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-xs text-gray-600 dark:text-gray-400">
                {{ bill.編號 }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ bill.提案類型 }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-gray-100">
                {{ bill['提案機關/議員'] }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ bill['提案機關主管/提案議員姓名'] }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(bill.時間戳記) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click.stop="navigateToBill(bill)"
                class="text-primary hover:text-primary-dark dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                查看詳情
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 手機版卡片列表 -->
    <div class="md:hidden space-y-4">
      <div
        v-for="bill in bills"
        :key="bill.編號"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
        @click="navigateToBill(bill)"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1 pr-2">
            {{ bill.案由 }}
          </h3>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap">
            {{ bill.提案類型 }}
          </span>
        </div>
        
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {{ bill.編號 }}
        </div>
        
        <div class="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <div>{{ bill['提案機關/議員'] }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ bill['提案機關主管/提案議員姓名'] }}
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(bill.時間戳記) }}
          </span>
          <button
            @click.stop="navigateToBill(bill)"
            class="text-primary hover:text-primary-dark dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          >
            查看詳情
          </button>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-if="bills.length === 0" class="text-center py-12">
      <div class="text-gray-500 dark:text-gray-400">
        <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">暫無議案</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          目前沒有符合條件的議案，請調整篩選條件或稍後再試。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bills: {
    type: Array,
    required: true
  }
})

const router = useRouter()

const navigateToBill = (bill) => {
  const billTerm = computed(() => {
    const match = bill.編號.match(/(\d+)屆/)
    return match ? match[1] : '26'
  })

  const billNumber = computed(() => {
    const match = bill.編號.match(/第(\d+)號/)
    return match ? match[1] : '1'
  })

  router.push(`/bill/${billTerm.value}/${billNumber.value}`)
}

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}
</script>

<style scoped>
.text-primary {
  color: #0F2D4B;
}

.text-primary-dark {
  color: #0a1f35;
}

.hover\:text-primary-dark:hover {
  color: #0a1f35;
}

/* 表格響應式設計 */
@media (max-width: 768px) {
  .bill-table-container {
    @apply px-4;
  }
}

/* 確保表格在小螢幕上的可用性 */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>