// composables/useBills.js

import { ref, computed, watch } from 'vue'

export const useBills = () => {
  // 響應式資料
  const bills = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(10) // 預設只請求10筆資料，但後續請求時覆蓋它
  const totalItems = ref(0)
  const totalPages = ref(0)
  const filters = ref({})
  const term = ref(null)

  // 計算屬性
  const hasError = computed(() => !!error.value)
  const isEmpty = computed(() => bills.value.length === 0 && !loading.value)
  const hasData = computed(() => bills.value.length > 0)

  // 重置狀態
  const resetState = () => {
    bills.value = []
    error.value = null
    totalItems.value = 0
    totalPages.value = 0
    currentPage.value = 1
  }

  // 獲取所有議案
  const fetchAllBills = async (queryParams = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const params = {
        page: 1, // 如果你想一次性獲取所有資料，頁碼通常設為 1
        pageSize: 500, // <-- 將這裡改為一個足夠大的數值，例如 500 或 1000
        ...filters.value,
        ...queryParams
      }

      const response = await $fetch('/api/bills', {
        params
      })

      if (response && Array.isArray(response.bills)) {
        bills.value = response.bills
        totalItems.value = response.total || bills.value.length // 使用 API 返回的總數，如果沒有則用當前獲取到的數量
        totalPages.value = response.totalPages || Math.ceil(totalItems.value / params.pageSize) // 重新計算總頁數
        currentPage.value = response.page || 1
        // pageSize.value = response.pageSize || params.pageSize; // 可以更新 Composables 內部的 pageSize ref 以匹配請求的數量
      } else {
        bills.value = []
        totalItems.value = 0
        totalPages.value = 0
        console.warn('API response for all bills was not in expected format:', response);
      }
      
      return response
    } catch (err) {
      error.value = err.message || '獲取議案資料失敗'
      console.error('Error fetching all bills:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 獲取特定屆次的議案
  const fetchBillsByTerm = async (termNumber, queryParams = {}) => {
    loading.value = true
    error.value = null
    term.value = termNumber
    
    try {
      const params = {
        page: 1, // 如果想一次性獲取該屆次所有資料，頁碼設為 1
        pageSize: 500, // <-- 將這裡改為一個足夠大的數值
        ...filters.value,
        ...queryParams
      }

      const response = await $fetch(`/api/bills/${termNumber}`, {
        params
      })



      if (response && Array.isArray(response.bills)) {
        


        bills.value = response.bills
        totalItems.value = response.total || bills.value.length
        totalPages.value = response.totalPages || Math.ceil(totalItems.value / params.pageSize)
        currentPage.value = response.page || 1
        // pageSize.value = response.pageSize || params.pageSize;
      } else {
        bills.value = []
        totalItems.value = 0
        totalPages.value = 0
        console.warn('API response for bills by term was not in expected format:', response);
      }
      
      return response
    } catch (err) {
      error.value = err.message || `獲取第${termNumber}屆議案資料失敗`
      console.error('Error fetching bills by term:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 獲取單一議案詳情
  const fetchBillDetail = async (termNumber, billNumber) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch(`/api/bills/${termNumber}`, {
        params: {
          page: 1,
          pageSize: 150, // 依據歷史經驗，假設每屆議案數量不會超過150。如果會超過，請記得修改此處，以及其他程式。
        }
      })

      const targetBill = response?.bills?.find(bill => {
        const match = bill.編號.match(/第(\d+)號/)
        return match && match[1] === billNumber
      })

      if (!targetBill) {
        throw new Error(`找不到編號為第${billNumber}號的議案`)
      }

      return targetBill
    } catch (err) {
      error.value = err.message || `獲取議案詳情失敗`
      console.error('Error fetching bill detail:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更新篩選條件
  const updateFilters = (newFilters) => {
    filters.value = { ...newFilters }
    currentPage.value = 1 // 重置到第一頁
  }

  // 清除篩選條件
  const clearFilters = () => {
    filters.value = {}
    currentPage.value = 1
  }

  // 變更頁碼
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // 刷新資料
  const refresh = async () => {
    if (term.value) {
      await fetchBillsByTerm(term.value)
    } else {
      await fetchAllBills()
    }
  }

  // 格式化日期
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

  // 從編號解析屆次
  const parseTermFromNumber = (billNumber) => {
    const match = billNumber.match(/(\d+)屆/)
    return match ? match[1] : null
  }

  // 從編號解析議案號碼
  const parseBillNumberFromNumber = (billNumber) => {
    const match = billNumber.match(/第(\d+)號/)
    return match ? match[1] : null
  }

  // 檢查是否為有效的議案編號
  const isValidBillNumber = (billNumber) => {
    const regex = /\d+屆.*第\d+號/
    return regex.test(billNumber)
  }

  // 搜尋議案
  const searchBills = async (searchTerm) => {
    const searchFilters = {
      編號: searchTerm,
      案由: searchTerm,
      說明: searchTerm,
      '提案機關/議員': searchTerm,
      '提案機關主管/提案議員姓名': searchTerm
    }
    
    await updateFilters(searchFilters)
    await refresh()
  }

  return {
    // 響應式資料
    bills,
    loading,
    error,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    filters,
    term,
    
    // 計算屬性
    hasError,
    isEmpty,
    hasData,
    
    // 方法
    resetState,
    fetchAllBills,
    fetchBillsByTerm,
    fetchBillDetail,
    updateFilters,
    clearFilters,
    changePage,
    refresh,
    searchBills,
    
    // 工具方法
    formatDate,
    parseTermFromNumber,
    parseBillNumberFromNumber,
    isValidBillNumber
  }
}