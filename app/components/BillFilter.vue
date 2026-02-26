<template>
  <div class="bill-filter bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
    <h3
      class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center cursor-pointer select-none"
      @click="isCollapsed = !isCollapsed"
    >
      <span class="mr-2">篩選議案</span>
      <svg
        :class="['transition-transform', isCollapsed ? 'rotate-0' : 'rotate-180']"
        width="20" height="20" fill="none" viewBox="0 0 20 20"
      >
        <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </h3>
    <div v-show="!isCollapsed">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- 編號篩選 -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            編號
          </label>
          <input
            v-model="localFilters.編號"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="請輸入編號關鍵字"
          />
        </div>

        <!-- 提案機關/議員篩選 -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            提案機關/議員
          </label>
          <input
            v-model="localFilters['提案機關/議員']"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="請輸入提案機關/議員(完整)"
          />
        </div>

        <!-- 提案人篩選 -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            提案人
          </label>
          <input
            v-model="localFilters['提案機關主管/提案議員姓名']"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="請輸入提案人姓名"
          />
        </div>

        <!-- 提案類型篩選 -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            提案類型
          </label>
          <select
            v-model="localFilters.提案類型"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">全部類型</option>
            <option value="人事案">人事案</option>
            <option value="法規案">法規案</option>
            <option value="預算案">預算案</option>
            <option value="決議案">決議案</option>
            <option value="質詢案">質詢案</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <!-- 日期範圍篩選 -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            提案日期起
          </label>
          <input
            v-model="localFilters.dateFrom"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            提案日期迄
          </label>
          <input
            v-model="localFilters.dateTo"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        

        <!-- 案由篩選 -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            案由
          </label>
          <input
            v-model="localFilters.案由"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="請輸入案由關鍵字"
          />
        </div>

        <!-- 說明篩選 -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            說明
          </label>
          <input
            v-model="localFilters.說明"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="請輸入說明關鍵字"
          />
        </div>

        <!-- 辦法篩選 -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            辦法
          </label>
          <input
            v-model="localFilters.辦法"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="請輸入辦法關鍵字"
          />
        </div>

        <!-- 排入會議篩選 -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            排入會議
          </label>
          <input
            v-model="localFilters.排入會議"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="排入會議關鍵字..."
          />
        </div>

      </div>

      <!-- 操作按鈕 -->
      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="clearFilters"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          清除篩選
        </button>
        <button
          @click="applyFilters"
          class="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-md transition-colors"
        >
          套用篩選
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:filters'])

const localFilters = ref({
  編號: '',
  '提案機關/議員': '',
  '提案機關主管/提案議員姓名': '',
  提案類型: '',
  案由: '',
  說明: '',
  辦法: '',
  排入會議: '',
  dateFrom: '',
  dateTo: '',
  ...props.filters
})

// 監聽父組件傳入的篩選條件變化
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...localFilters.value, ...newFilters }
}, { deep: true })

const applyFilters = () => {
  // 過濾掉空值
  const activeFilters = Object.entries(localFilters.value)
    .filter(([key, value]) => value !== '' && value !== null && value !== undefined)
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
  
  emit('update:filters', activeFilters)
}

const clearFilters = () => {
  localFilters.value = {
    編號: '',
    '提案機關/議員': '',
    '提案機關主管/提案議員姓名': '',
    提案類型: '',
    案由: '',
    說明: '',
    辦法: '',
    排入會議: '',
    dateFrom: '',
    dateTo: ''
  }
  emit('update:filters', {})
}

const isCollapsed = ref(true)

// 實時篩選（可選，如果需要即時篩選效果）
// watch(localFilters, () => {
//   applyFilters()
// }, { deep: true })
</script>

<style scoped>
.filter-group {
  @apply flex flex-col;
}

.bg-primary {
  background-color: #0F2D4B;
}

.bg-primary-dark {
  background-color: #0a1f35;
}

.ring-primary {
  --tw-ring-color: #0F2D4B;
}

.focus\:ring-primary:focus {
  --tw-ring-color: #0F2D4B;
}

.border-primary {
  border-color: #0F2D4B;
}
</style>