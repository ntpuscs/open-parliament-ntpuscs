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
      僅有第 {{ STARTING_TERM }} ~ {{ currentTerm }} 屆資料
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
          :filters="filters.value"
          :available-terms="[parseInt(route.params.term)]" :available-types="availableTypes"
          :available-agencies="availableAgencies"
          @update:filters="updateFilters"
          @reset-filters="resetFilters"
        />
      </div>

      <div v-if="!pending && !error && filteredBills.length > 0" class="space-y-6">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          共找到 {{ filteredBills.length }} 筆議案 (總計 {{ totalItems }} 筆)
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
            :key="bill.編號"
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
import { useBills } from '~/composables/useBills'
import { useCurrentTerm } from '~/composables/useCurrentTerm'

// 取得屆次範圍
const { currentTerm, availableTermsRange } = useCurrentTerm()
const STARTING_TERM = 23

const route = useRoute()
const term = parseInt(route.params.term)

// 判斷是否超出屆次範圍
const isOutOfRange = computed(() => {
  return isNaN(term) || term < STARTING_TERM || term > currentTerm.value
})

// 只有在合法屆次才查詢資料
let billsStore, bills, pending, error, totalItems, totalPages, availableTypes, availableAgencies
if (!isOutOfRange.value) {
  billsStore = useBills()
  billsStore.updateFilters({ term: String(term) })
  await billsStore.fetchBillsByTerm(term)
  bills = billsStore.bills
  pending = billsStore.loading
  error = billsStore.error
  totalItems = billsStore.totalItems
  totalPages = billsStore.totalPages
  availableTypes = billsStore.availableTypes
  availableAgencies = billsStore.availableAgencies
}

// 獲取路由參數
// const route = useRoute()
// const term = parseInt(route.params.term)

// 驗證屆次參數
if (!term || isNaN(term)) {
  throw createError({
    statusCode: 404,
    statusMessage: '屆次參數無效'
  })
}

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

// 使用 composable 獲取議案資料

// const { bills, loading: pending, error, refresh, totalItems, totalPages, availableTypes, availableAgencies } = await useBills(filters)

// const billsStore = useBills()
// billsStore.updateFilters({ term: String(term) })
// await billsStore.fetchBillsByTerm(term)

// const bills = billsStore.bills
// const pending = billsStore.loading
// const error = billsStore.error
// const totalItems = billsStore.totalItems
// const totalPages = billsStore.totalPages
// const availableTypes = billsStore.availableTypes
// const availableAgencies = billsStore.availableAgencies

// 監聽路由參數變化，當屆次改變時重設篩選條件並重新載入
watch(() => route.params.term, async (newTerm) => {
    if (newTerm && parseInt(newTerm) !== term) {
        const newTermParsed = parseInt(newTerm);
        filters.value.term = String(newTermParsed);
        currentPage.value = 1;
        await refresh();
    }
}, { immediate: true });

// 輔助函數：將日期時間字串轉換為 ISO 格式 (YYYY-MM-DDTHH:mm:ss)
const formatTimestampToISO = (timestampString) => {
  if (!timestampString) return null;
  try {
    // 替換「下午」為「PM」，「上午」為「AM」
    const normalizedString = timestampString
      .replace('下午', 'PM')
      .replace('上午', 'AM');
    let date = new Date(normalizedString);

    if (isNaN(date.getTime())) {
      // 如果直接解析失敗，嘗試手動解析 'YYYY/MM/DD AM/PM HH:mm:ss' 格式
      const parts = timestampString.match(/(\d{4})\/(\d{1,2})\/(\d{1,2}) (上午|下午) (\d{1,2}):(\d{1,2}):(\d{1,2})/);
      if (parts) {
        let year = parseInt(parts[1]);
        let month = parseInt(parts[2]) - 1; // 月份是從 0 開始
        let day = parseInt(parts[3]);
        let hour = parseInt(parts[5]);
        let minute = parseInt(parts[6]);
        let second = parseInt(parts[7]);
        const ampm = parts[4];

        if (ampm === '下午' && hour < 12) {
          hour += 12;
        } else if (ampm === '上午' && hour === 12) {
          hour = 0;
        }
        date = new Date(year, month, day, hour, minute, second);
        if (isNaN(date.getTime())) return null;
      } else {
        return null;
      }
    }
    // 回傳完整 ISO 字串 (不帶時區)
    return date.toISOString().replace('Z', '');
  } catch (e) {
    console.error("Error formatting timestamp for comparison:", e);
    return null;
  }
};


// 計算過濾後的議案
const filteredBills = computed(() => {
  if (!Array.isArray(bills.value)) return []

  return bills.value.filter(bill => {
    // 屆次篩選
    const billTerm = extractTermFromNumber(bill.編號)
    if (billTerm !== term) return false

    // 類型篩選（支援 type 或 提案類型）
    if (
      (filters.value.type && bill.提案類型 !== filters.value.type) ||
      (filters.value.提案類型 && bill.提案類型 !== filters.value.提案類型)
    ) return false

    // 機關篩選（支援 agency 或 提案機關/議員）
    if (
      (filters.value.agency && bill['提案機關/議員'] !== filters.value.agency) ||
      (filters.value['提案機關/議員'] && bill['提案機關/議員'] !== filters.value['提案機關/議員'])
    ) return false

    // 編號篩選
    if (
      filters.value.編號 &&
      !String(bill.編號).includes(filters.value.編號)
    ) return false

    // 提案人篩選
    if (
      filters.value['提案機關主管/提案議員姓名'] &&
      !String(bill['提案機關主管/提案議員姓名'] || '').includes(filters.value['提案機關主管/提案議員姓名'])
    ) return false

    // 案由篩選
    if (
      filters.value.案由 &&
      !String(bill.案由 || '').includes(filters.value.案由)
    ) return false

    // 說明篩選
    if (
      filters.value.說明 &&
      !String(bill.說明 || '').includes(filters.value.說明)
    ) return false

    // 辦法篩選
    if (
      filters.value.辦法 &&
      !String(bill.辦法 || '').includes(filters.value.辦法)
    ) return false

    // 關鍵字篩選（支援 keyword）
    if (
      filters.value.keyword &&
      ![bill?.案由, bill?.說明, bill?.辦法, bill?.編號]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(filters.value.keyword.toLowerCase())
    ) return false

    // 日期範圍篩選
    const billDateISO = formatTimestampToISO(bill.時間戳記)
    if (!billDateISO) return false
    if (filters.value.dateFrom && billDateISO < filters.value.dateFrom) return false
    if (filters.value.dateTo && billDateISO > filters.value.dateTo) return false

    return true
  }).sort((a, b) => {
    const dateA = formatTimestampToISO(a.時間戳記)
    const dateB = formatTimestampToISO(b.時間戳記)
    if (!dateA || !dateB) return 0
    return dateB.localeCompare(dateA)
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
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>