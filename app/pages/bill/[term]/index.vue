<template>
  <div class="container mx-auto px-4 py-8">
    <nav class="mb-6">
      <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink>
        </li>
        <li>/</li>
        <li>
          <NuxtLink to="/bill" class="hover:text-primary">議案查詢</NuxtLink>
        </li>
        <li>/</li>
        <li class="text-gray-900 dark:text-white">第{{ term }}屆</li>
      </ol>
    </nav>

    <div v-if="isOutOfRange" class="text-center text-red-500 font-bold my-12">
      僅有第 23 ~ {{ getCurrentTerm() }} 屆資料
      <div class="mt-8 flex justify-center gap-4">
        <NuxtLink
          to="/bill"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          各屆議案
        </NuxtLink>
        <NuxtLink
          to="/"
          class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
        >
          回到首頁
        </NuxtLink>
      </div>
    </div>
    <template v-else>
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">第{{ term }}屆議案</h1>
        <p class="text-gray-600 dark:text-gray-300">查詢第{{ term }}屆學生議會議案資料</p>
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
        <BillFilter
          :filters="filters"
          :available-terms="[parseInt(route.params.term)]" 
          @update:filters="updateFilters"
          @reset-filters="resetFilters"
        />
      </div>

      <div v-if="!pending && !error && filteredBills.length > 0" class="space-y-6">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          共找到 {{ filteredBills.length }} 筆議案
        </div>

        <!-- 上方分頁選單 -->
        <Pagination
          v-model:current-page="currentPage"
          :total-pages="frontendTotalPages"
          :total-items="filteredBills.length"
          :items-per-page="itemsPerPage"
        />

        <div class="grid gap-4">
          <BillCard
            v-for="bill in paginatedBills"
            :key="bill.billNumber"
            :bill="bill"
          />
        </div>

        <!-- 下方分頁選單 -->
        <Pagination
          v-model:current-page="currentPage"
          :total-pages="frontendTotalPages"
          :total-items="filteredBills.length"
          :items-per-page="itemsPerPage"
        />
      </div>

      <div v-if="!pending && !error && filteredBills.length === 0" class="text-center py-12">
        <DocumentTextIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">找不到相關議案</h3>
        <p class="text-gray-600 dark:text-gray-300">請調整篩選條件或稍後再試</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ExclamationTriangleIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const term = parseInt(route.params.term)

// 驗證屆次參數
if (!term || isNaN(term)) {
  throw createError({
    statusCode: 404,
    statusMessage: '屆次參數欠缺或非數值'
  })
}

// 判斷是否超出屆次範圍
const isOutOfRange = computed(() => {
  return typeof getValidTerms === 'function' && !getValidTerms().includes(term)
})

const { data: bills, pending, error, refresh } = await useFetch(`/api/bills?term=${term}`);

// 響應式數據
const currentPage = ref(1)
const itemsPerPage = 10

// 篩選器狀態 (為特定屆次頁面調整)
const filters = ref({
  term: String(term),
  type: '',
  agency: '',
  keyword: '',
  dateFrom: '',
  dateTo: ''
})

// 用過濾後的資料來算分頁數
const frontendTotalPages = computed(() => {
  return Math.ceil(filteredBills.value.length / itemsPerPage)
})

// 監聽路由參數變化，當屆次改變時重設篩選條件並重新載入
watch(() => route.params.term, async (newTerm) => {
    if (newTerm && parseInt(newTerm) !== term) {
        const newTermParsed = parseInt(newTerm);
        filters.value.term = String(newTermParsed);
        currentPage.value = 1;
        if (typeof refresh === 'function') await refresh();
    }
}, { immediate: true });

// 計算過濾後的議案
const filteredBills = computed(() => {
  if (!Array.isArray(bills.value)) return []

  return bills.value.filter(bill => {

    // 類型篩選 
    if (filters.value.type && bill.billType !== filters.value.type) return false

    // 機關篩選 
    if (filters.value.agency && bill.proposingEntity !== filters.value.agency) return false

    // 關鍵字篩選 
    if (filters.value.keyword) {
      const keyword = filters.value.keyword.toLowerCase();
      const content = [bill.subject, bill.description, bill.proposedAction, bill.billNumber]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!content.includes(keyword)) return false;
    }

    // 日期範圍篩選 
    const billDateISO = typeof formatTimestampToISO === 'function' 
      ? formatTimestampToISO(bill.submittedAt) 
      : bill.submittedAt;
      
    if (billDateISO) {
      if (filters.value.dateFrom && billDateISO < filters.value.dateFrom) return false
      if (filters.value.dateTo && billDateISO > filters.value.dateTo) return false
    }

    return true
  }).sort((a, b) => {
    const dateA = typeof formatTimestampToISO === 'function' ? formatTimestampToISO(a.submittedAt) : a.submittedAt;
    const dateB = typeof formatTimestampToISO === 'function' ? formatTimestampToISO(b.submittedAt) : b.submittedAt;
    if (!dateA || !dateB) return 0;
    return String(dateB).localeCompare(String(dateA));
  })
})

// 分頁計算 (僅限前端顯示)
const paginatedBills = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBills.value.slice(start, end)
})

// 方法
const updateFilters = (newFilters) => {
  filters.value = { ...filters.value, ...newFilters, term: String(term) };
  currentPage.value = 1;
}

const resetFilters = () => {
  filters.value = {
    term: String(term),
    type: '',
    agency: '',
    keyword: '',
    dateFrom: '',
    dateTo: ''
  }
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 輔助函數
const extractTermFromNumber = (billNumber) => {
  if (typeof billNumber !== 'string') return null;
  const match = billNumber.match(/^(\d+)屆/)
  return match ? parseInt(match[1]) : null
}

const extractNumberFromNumber = (billNumber) => {
  if (typeof billNumber !== 'string') return null;
  const match = billNumber.match(/第(\d+)號$/)
  return match ? parseInt(match[1]) : null
}

// 監聽前端頁碼變化，僅用於控制 paginatedBills，不觸發 API 請求
watch(currentPage, () => {
  // 當前頁碼改變時，不需要重新獲取數據，因為數據已經在 bills.value 中
});

// SEO 設定
useHead({
  title: `第${term}屆議案查詢 - 三峽校區議事服務`,
  meta: [
    {
      name: 'description',
      content: `查詢三峽校區學生議會第${term}屆議案資料`
    }
  ]
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>