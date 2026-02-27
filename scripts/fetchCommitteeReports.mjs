// scripts/fetchCommitteeReports.mjs
//
// 由 GitHub Actions 執行，負責：
//   1. 從 Google Sheets 抓取委員會建議報告資料
//   2. 寫入 public/data/committeeReports.json
//
// 執行方式：
//   node scripts/fetchCommitteeReports.mjs
//
// 所需環境變數（在 GitHub Actions Secrets 設定）：
//   COMMITTEE_REPORTS_SHEET_ID  — Google 試算表的 Spreadsheet ID
//   COMMITTEE_REPORTS_SHEET_GID — 分頁的 gid（選填，預設為 '0'）

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── 欄位常數 ────────────────────────────────────────────────────────────────

const COLUMN = Object.freeze({
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

// ─── CSV 解析器 ──────────────────────────────────────────────────────────────

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch   = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field);
        field = '';
      } else if (ch === '\r' && next === '\n') {
        row.push(field);
        field = '';
        rows.push(row);
        row = [];
        i++;
      } else if (ch === '\n') {
        row.push(field);
        field = '';
        rows.push(row);
        row = [];
      } else {
        field += ch;
      }
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (rows.at(-1)?.every(f => f === '')) {
    rows.pop();
  }

  return rows;
}

// ─── 資料擷取與解析 ──────────────────────────────────────────────────────────

async function fetchReports() {
  const spreadsheetId = process.env.COMMITTEE_REPORTS_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error('環境變數 COMMITTEE_REPORTS_SHEET_ID 未設定。');
  }

  const gid = process.env.COMMITTEE_REPORTS_SHEET_GID ?? '0';
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

  console.log(`正在從 Google Sheets 抓取資料...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }

  const csvText = await response.text();
  const rows    = parseCSV(csvText);

  if (!rows || rows.length === 0) {
    return [];
  }

  const headers  = rows[0];
  const dataRows = rows.slice(1);
  const reports  = [];

  dataRows.forEach((row, i) => {
    const report = {};
    headers.forEach((header, index) => {
      report[header] = row[index] ?? '';
    });

    // 過濾真正的空行
    if (!report[COLUMN.SERIAL_NUMBER] && !report[COLUMN.SUBJECT]) {
      return;
    }

    report.rowIndex = i + 1;

    // 結構化學生會回覆
    report.governmentResponse = {
      text:        report[COLUMN.GOV_RESPONSE_TEXT],
      refNumber:   report[COLUMN.GOV_RESPONSE_REF],
      hasResponse: !!(
        report[COLUMN.GOV_RESPONSE_TEXT] || report[COLUMN.GOV_RESPONSE_REF]
      ),
    };

    reports.push(report);
  });

  return reports;
}

// ─── 主流程 ──────────────────────────────────────────────────────────────────

async function main() {
  try {
    const reports = await fetchReports();

    // 包裝成含 cachedAt 的頂層物件
    const output = {
      cachedAt: new Date().toISOString(),
      count:    reports.length,
      data:     reports,
    };

    // 確保輸出目錄存在
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const outputDir  = path.resolve(__dirname, '../public/data');
    const outputFile = path.join(outputDir, 'committeeReports.json');

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8');

    console.log(`成功寫入 ${outputFile}`);
    console.log(`   共 ${reports.length} 筆資料，cachedAt: ${output.cachedAt}`);
  } catch (error) {
    console.error('抓取失敗：', error.message);
    process.exit(1); // 讓 GitHub Actions 標記為失敗
  }
}

main();
