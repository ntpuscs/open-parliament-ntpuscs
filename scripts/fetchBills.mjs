import fs from 'node:fs/promises';
import path from 'node:path';
import Papa from 'papaparse';

// 從環境變數讀取
const SHEET_ID = process.env.BILLS_SHEET_ID;
const GID = process.env.BILLS_SHEET_GID; 

if (!SHEET_ID || !GID) {
  console.error('錯誤：未設定環境變數 BILLS_SHEET_ID 或 BILLS_SHEET_GID。請確認 .env 或 GitHub Secrets 設定。');
  process.exit(1);
}

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/bill-data');

/**
 * 負責比對資料並決定是否寫入檔案
 * string filename - 檔案名稱
 * Array newDataArray - 解析後的新資料陣列
 */
async function saveIfChanged(filename, newDataArray) {
  const filePath = path.join(OUTPUT_DIR, filename);
  let shouldWrite = true;

  try {
    // 嘗試讀取舊有檔案
    const existingContent = await fs.readFile(filePath, 'utf-8');
    const oldJson = JSON.parse(existingContent);
    // 僅抓取 data 欄位進行比對，忽略 cachedAt 的差異 
    const oldDataArray = oldJson.data || [];

    // 將新舊資料陣列轉為字串進行深度比對
    // PapaParse 產生的物件屬性順序固定，字串化比對安全且高效
    if (JSON.stringify(oldDataArray) === JSON.stringify(newDataArray)) {
      console.log(`[${filename}] 實際內容無變動，略過更新，保留原快取時間。`);
      shouldWrite = false;
    }
  } catch (error) {
    // 檔案不存在或解析失敗（例如第一次執行），維持 shouldWrite = true
    console.log(`[${filename}] 找不到舊檔案或解析失敗，將建立新檔案。`);
  }

  if (shouldWrite) {
    const outputData = {
      cachedAt: new Date().toISOString(), // 紀錄更新當下的 UTC 時間
      data: newDataArray
    };

    await fs.writeFile(filePath, JSON.stringify(outputData, null, 2), 'utf-8');
    console.log(`[${filename}] 資料已更新寫入！包含 ${newDataArray.length} 筆紀錄。`);
  }
}

async function main() {
  try {
    console.log(`Fetching data from Google Sheets...`);
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    const { data, errors } = Papa.parse(csvText, {
      header: true, 
      skipEmptyLines: true,
    });

    if (errors.length) {
      console.warn('CSV 解析過程中出現警告:', errors);
    }

    // --- 動態分析最新屆次 ---
    let currentTerm = null;
    
    // 從最後一筆資料往前找，尋找最後一個有效且符合格式的編號
    for (let i = data.length - 1; i >= 0; i--) {
      const row = data[i];
      const idStr = row['編號']?.trim() || '';
      
      if (idStr) {
        const match = idStr.match(/^(\d+)屆北大峽議字第\d+號$/);
        if (match) {
          currentTerm = parseInt(match[1], 10);
          break; // 找到後即可中斷迴圈
        }
      }
    }

    // 容錯機制
    if (!currentTerm) {
      console.warn('無法從資料中自動判斷最新屆次，將預設使用第 26 屆。請確認試算表「編號」欄位格式。');
      currentTerm = 26;
    } else {
      console.log(`動態偵測最新屆次為：第 ${currentTerm} 屆`);
    }
    // ---------------------------------

    const newTermData = [];
    const oldTermsData = [];

    for (const row of data) {
      const idStr = row['編號']?.trim() || '';
      const submittedAt = row['時間戳記']?.trim() || '';

      // 無效列跳過
      if (!submittedAt) continue; 

      // 1. 附件欄位整合與優化
      const attachments = [];
      for (let i = 1; i <= 5; i++) {
        const url = row[`附件${i}`]?.trim();
        if (url) {
          attachments.push(url);
        }
      }

      // 2. 欄位重新映射與隱私資料排除 (白名單機制)
      const transformedRow = {
        billNumber: idStr,
        submittedAt: submittedAt,
        proposingEntity: row['提案機關/議員']?.trim() || '',
        proposerName: row['提案機關主管/提案議員姓名']?.trim() || '',
        contactName: (row['提案聯絡人姓名 '])?.trim() || '',
        billType: row['提案類型']?.trim() || '',
        subject: row['案由']?.trim() || '',
        description: row['說明']?.trim() || '',
        proposedAction: row['辦法']?.trim() || '',
        attachments: attachments,
        scheduledSession: row['排入會議']?.trim() || ''
      };

      // 3. 判斷屆次並分流
      // 預設為最新屆次（這也包含了「編號為空」的狀況）
      let term = currentTerm;
      if (idStr) {
        const match = idStr.match(/^(\d+)屆北大峽議字第\d+號$/);
        if (match) {
          term = parseInt(match[1], 10);
        }
      }

      if (term === currentTerm) {
        newTermData.push(transformedRow);
      } else {
        oldTermsData.push(transformedRow);
      }
    }

    // 確保輸出目錄存在
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // 透過比對函數處理新舊屆次檔案
    await saveIfChanged('bill_latestTerm.json', newTermData);
    await saveIfChanged('bill_pastTerms.json', oldTermsData);

    console.log(`議案資料同步流程執行完畢！`);

  } catch (error) {
    console.error('獲取或處理資料時發生錯誤:', error);
    process.exit(1);
  }
}

main();