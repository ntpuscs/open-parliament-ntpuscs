// server/utils/committeeReportsData.js
//
// 功能：
//   - 提供試算表欄位常數 COLUMN（前端與後端共用）
//   - 提供篩選輔助函式
//
// 實際的資料擷取由 scripts/fetchCommitteeReports.mjs 負責，
// 由 GitHub Actions 定期執行並將結果寫入 public/data/committeeReports.json。
//
// 前端讀取方式：
//   const { data } = await useFetch('/data/committeeReports.json')
//   // data.value.cachedAt  → ISO 8601 字串，資料最後更新時間
//   // data.value.count     → 資料筆數
//   // data.value.data      → CommitteeReport 陣列

// ─── 欄位常數（與試算表標題列完全對應） ────────────────────────────────────────

export const COLUMN = Object.freeze({
  TIMESTAMP:            '時間戳記',
  PROPOSER:             '議員姓名',
  COMMITTEE:            '欲提請以哪個委員會之名義提出建議報告？',
  DEPT_GENERAL_AFFAIRS: '您欲提出建議之部門(文務)',
  DEPT_FINANCE:         '您欲提出建議之部門(財務)',
  DEPT_LEGAL:           '您欲提出建議之部門(法制)',
  SUBJECT:              '主旨',
  DESCRIPTION:          '說明',
  PROPOSAL:             '建議方案',
  SERIAL_NUMBER:        '秘書處手動編號',
  SCHEDULED_MEETING:    '排入會議',
  COMMITTEE_RESOLUTION: '委員會決議摘要',
  REPORT_LINK:          '建議報告連結',
  GOV_RESPONSE_TEXT:    '學生會回覆(文字)',
  GOV_RESPONSE_REF:     '學生會回覆(提案字號)',
});

// ─── 篩選輔助函式 ────────────────────────────────────────────────────────────

/**
 * 篩選出「已有學生會回覆」的報告。
 * @param {Array} reports - JSON 檔案中 data 陣列
 * @returns {Array}
 */
export function filterReportsWithGovernmentResponse(reports) {
  return reports.filter(r => r.governmentResponse?.hasResponse);
}

/**
 * 篩選出「尚無學生會回覆」的報告。
 * @param {Array} reports - JSON 檔案中 data 陣列
 * @returns {Array}
 */
export function filterReportsPendingGovernmentResponse(reports) {
  return reports.filter(r => !r.governmentResponse?.hasResponse);
}

/**
 * 依委員會名稱篩選報告（完全比對）。
 * @param {Array}  reports       - JSON 檔案中 data 陣列
 * @param {string} committeeName - 委員會名稱
 * @returns {Array}
 */
export function filterReportsByCommittee(reports, committeeName) {
  return reports.filter(r => r[COLUMN.COMMITTEE] === committeeName);
}

/**
 * 依是否已排入會議篩選報告。
 * @param {Array}   reports    - JSON 檔案中 data 陣列
 * @param {boolean} scheduled  - true = 已排入，false = 尚未排入
 * @returns {Array}
 */
export function filterReportsByScheduled(reports, scheduled) {
  return reports.filter(r =>
    scheduled ? !!r[COLUMN.SCHEDULED_MEETING] : !r[COLUMN.SCHEDULED_MEETING]
  );
}