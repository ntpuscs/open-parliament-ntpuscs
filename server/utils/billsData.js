// server/utils/billsData.js

/**
 * 從提案系統（Google Forms）後台（Google Spreadsheets）取得所有議案資料，並解析為物件陣列。
 * - 過濾掉編號和案由都為空的「真正空行」。
 * - 為每筆資料加上 rowIndex（對應試算表的資料列順序，從 1 開始）。
 * @returns {Promise<Array>} 返回一個解析為議案物件陣列的 Promise。
 */
export async function fetchAllBillsFromGoogleSheets() {
  try {
    const spreadsheetId = process.env.BILLS_SHEET_ID;
    // 若試算表有多個分頁，可在 .env 設定 BILLS_SHEET_GID（預設分頁 gid 通常為 0）
    const gid = process.env.BILLS_SHEET_GID ?? '0';

    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (!rows || rows.length === 0) {
      return [];
    }

    // 第一行是標題
    const headers = rows[0];
    const dataRows = rows.slice(1);

    const processedBills = [];

    // 遍歷資料列，過濾真正的空行，並為每行加上流水編號（rowIndex）
    dataRows.forEach((row, i) => {
      const bill = {};
      headers.forEach((header, index) => {
        bill[header] = row[index] ?? '';
      });

      // 過濾「真正的空行」（編號和案由都為空）
      if (!bill.編號 && !bill.案由) {
        return;
      }

      // rowIndex 從 1 開始，對應試算表的第幾個資料列（不含標題列）
      bill.rowIndex = i + 1;

      processedBills.push(bill);
    });

    return processedBills;

  } catch (error) {
    console.error('Error fetching all bills from Google Sheets:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '無法從 Google 試算表擷取或處理議案。',
      data: {
        error: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

/**
 * 簡易 CSV 解析器，支援以雙引號包裹且內含逗號或換行的欄位。
 * @param {string} text - CSV 原始字串
 * @returns {string[][]} 二維陣列
 */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        // 跳脫的雙引號 ""
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
        i++; // 跳過 \n
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

  // 處理最後一行
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // 移除最後可能的空行
  if (rows.at(-1)?.every(f => f === '')) {
    rows.pop();
  }

  return rows;
}