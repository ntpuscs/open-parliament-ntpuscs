// composables/useCommitteeReports.js
//
// 封裝讀取 committeeReports.json 的邏輯，供頁面或元件直接使用。
//
// 使用範例：
//   <script setup>
//   const { reports, cachedAt, pending, error } = await useCommitteeReports()
//   </script>

import {
  filterReportsWithGovernmentResponse,
  filterReportsPendingGovernmentResponse,
  filterReportsByCommittee,
} from '~/server/utils/committeeReportsData'

/**
 * @typedef {Object} UseCommitteeReportsReturn
 * @property {import('vue').Ref<Array>}   reports     - 全部報告
 * @property {import('vue').Ref<Array>}   withResponse    - 已有學生會回覆
 * @property {import('vue').Ref<Array>}   pendingResponse - 尚無學生會回覆
 * @property {import('vue').Ref<string>}  cachedAt    - 資料最後更新時間（ISO 8601）
 * @property {import('vue').Ref<number>}  count       - 資料總筆數
 * @property {import('vue').Ref<boolean>} pending     - 是否正在載入
 * @property {import('vue').Ref<any>}     error       - 錯誤物件
 * @property {Function}                   byCommittee - 依委員會名稱篩選
 */

export async function useCommitteeReports() {
  const { data, pending, error } = await useFetch('/data/committeeReports.json', {
    // Nuxt 會在 SSR 階段讀取靜態檔案，結果會被 hydrate 到前端，不會重複請求
    key: 'committee-reports',
  })

  const reports         = computed(() => data.value?.data          ?? [])
  const cachedAt        = computed(() => data.value?.cachedAt       ?? null)
  const count           = computed(() => data.value?.count          ?? 0)
  const withResponse    = computed(() => filterReportsWithGovernmentResponse(reports.value))
  const pendingResponse = computed(() => filterReportsPendingGovernmentResponse(reports.value))

  /** 依委員會名稱篩選，回傳 computed ref */
  function byCommittee(committeeName) {
    return computed(() => filterReportsByCommittee(reports.value, committeeName))
  }

  return {
    reports,
    withResponse,
    pendingResponse,
    cachedAt,
    count,
    pending,
    error,
    byCommittee,
  }
}