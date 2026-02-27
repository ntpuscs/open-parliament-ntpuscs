// app/composables/useCommitteeReports.js
//
// 封裝讀取 committeeReports.json 的邏輯，供頁面或元件直接使用。
//
// 使用範例：
//   <script setup>
//   const { reports, cachedAt, pending, error } = await useCommitteeReports()
//   </script>

// ─── 篩選輔助函式 ────────────────────────────────────────────────────────────

/**
 * 篩選出「已有學生會回覆」的報告。
 * @param {Array} reports - JSON 檔案中 data 陣列
 * @returns {Array}
 */
export function filterReportsWithGovernmentResponse(reports) {
  return reports.filter(r => r.governmentResponse?.hasResponse)
}

/**
 * 篩選出「尚無學生會回覆」的報告。
 * @param {Array} reports - JSON 檔案中 data 陣列
 * @returns {Array}
 */
export function filterReportsPendingGovernmentResponse(reports) {
  return reports.filter(r => !r.governmentResponse?.hasResponse)
}

/**
 * 依委員會名稱篩選報告（完全比對）。
 * @param {Array}  reports       - JSON 檔案中 data 陣列
 * @param {string} committeeName - 委員會名稱
 * @returns {Array}
 */
export function filterReportsByCommittee(reports, committeeName) {
  return reports.filter(r => r.proposal?.committee === committeeName)
}

/**
 * 依是否已排入會議篩選報告。
 * @param {Array}   reports   - JSON 檔案中 data 陣列
 * @param {boolean} scheduled - true = 已排入，false = 尚未排入
 * @returns {Array}
 */
export function filterReportsByScheduled(reports, scheduled) {
  return reports.filter(r =>
    scheduled
      ? !!r.committeeReport?.scheduledMeeting
      : !r.committeeReport?.scheduledMeeting
  )
}

// ─── Composable ──────────────────────────────────────────────────────────────

/**
 * @typedef {Object} UseCommitteeReportsReturn
 * @property {import('vue').ComputedRef<Array>}   reports         - 全部報告
 * @property {import('vue').ComputedRef<Array>}   withResponse    - 已有學生會回覆
 * @property {import('vue').ComputedRef<Array>}   pendingResponse - 尚無學生會回覆
 * @property {import('vue').ComputedRef<string>}  cachedAt        - 資料最後更新時間（ISO 8601）
 * @property {import('vue').ComputedRef<number>}  count           - 資料總筆數
 * @property {import('vue').Ref<boolean>}         pending         - 是否正在載入
 * @property {import('vue').Ref<any>}             error           - 錯誤物件
 * @property {Function}                           byCommittee     - 依委員會名稱篩選，回傳 computed ref
 * @property {Function}                           byScheduled     - 依是否排入會議篩選，回傳 computed ref
 */

export async function useCommitteeReports() {
  const { data, pending, error } = await useFetch('/data/committeeReports.json', {
    // Nuxt 會在 SSR 階段讀取靜態檔案，結果會被 hydrate 到前端，不會重複請求
    key: 'committee-reports',
  })

  const reports = computed(() => data.value?.data ?? [])
  const cachedAt = computed(() => data.value?.cachedAt ?? null)
  const count = computed(() => data.value?.count ?? 0)
  const withResponse = computed(() => filterReportsWithGovernmentResponse(reports.value))
  const pendingResponse = computed(() => filterReportsPendingGovernmentResponse(reports.value))

  /** 依委員會名稱篩選，回傳 computed ref */
  function byCommittee(committeeName) {
    return computed(() => filterReportsByCommittee(reports.value, committeeName))
  }

  /** 依是否已排入會議篩選，回傳 computed ref */
  function byScheduled(scheduled) {
    return computed(() => filterReportsByScheduled(reports.value, scheduled))
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
    byScheduled,
  }
}