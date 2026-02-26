// server/api/bills/SpecificClassic/[id].get.ts
// import { fetchAllBillsFromGoogleSheets } from '~/server/utils/billsData';

/**
 * API 路由：根據屆次和提案號碼，返回對應的 AppSheet 網址
 * 路由格式：/api/bills/SpecificClassic/26-4
 * 參數說明：26 代表屆次，4 代表提案號碼
 */
export default defineEventHandler(async (event) => {
  try {
    // 獲取路由參數
    const routeId = getRouterParam(event, 'id');
    
    if (!routeId) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少必要參數',
        data: {
          error: '請提供屆次和提案號碼，格式如：26-4',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 解析參數：分割屆次和提案號碼
    const parts = routeId.split('-');
    if (parts.length !== 2) {
      throw createError({
        statusCode: 400,
        statusMessage: '參數格式錯誤',
        data: {
          error: '參數格式應為：屆次-提案號碼，例如：26-4',
          example: '/api/getBillDataOld/26-4',
          timestamp: new Date().toISOString(),
        },
      });
    }

    const [termStr, billNumberStr] = parts;
    const term = parseInt(termStr, 10);
    const billNumber = parseInt(billNumberStr, 10);

    // 驗證數字格式
    if (isNaN(term) || isNaN(billNumber) || term <= 0 || billNumber <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '參數必須為正整數',
        data: {
          error: '屆次和提案號碼都必須為正整數',
          received: { term: termStr, billNumber: billNumberStr },
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 構造要查找的編號格式：如「26屆北大峽議字第4號」
    const targetBillId = `${term}屆北大峽議字第${billNumber}號`;

    // 從 Google Sheets 獲取所有議案資料
    const allBills = await fetchAllBillsFromGoogleSheets();

    if (!allBills || allBills.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: '無法獲取議案資料',
        data: {
          error: '試算表中沒有找到任何議案資料',
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 查找匹配的議案
    let matchedIndex = -1;
    const matchedBill = allBills.find((bill, index) => {
      if (bill.編號 === targetBillId) {
        matchedIndex = index;
        return true;
      }
      return false;
    });

    if (!matchedBill) {
      throw createError({
        statusCode: 404,
        statusMessage: '找不到指定的議案',
        data: {
          error: `找不到編號為「${targetBillId}」的議案`,
          searchedId: targetBillId,
          availableTerms: getAvailableTerms(allBills),
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 計算 AppSheet 的 row 值
    // Google Sheets 中的行號從 1 開始（第 1 行是標題），資料從第 2 行開始
    // matchedIndex 是在資料陣列中的索引（從 0 開始），所以要 +2
    const appSheetRowNumber = matchedIndex + 2;

    // 構造 AppSheet 網址
    const appSheetUrl = `https://www.appsheet.com/start/44df5ea0-8f78-4d04-b897-79d7ca662248#view=議案詳細內容&row=${appSheetRowNumber}`;

    // 返回成功回應
    return {
      success: true,
      data: {
        billId: targetBillId,
        term: term,
        billNumber: billNumber,
        rowNumber: appSheetRowNumber,
        appSheetUrl: appSheetUrl,
        billTitle: matchedBill.案由 || '無標題',
      },
      message: '成功找到議案資料',
      timestamp: new Date().toISOString(),
    };

  } catch (error: any) {
    // 如果錯誤已經是 createError 建立的，直接拋出
    if (error.statusCode) {
      throw error;
    }

    // 處理其他未預期的錯誤
    console.error('Error in getBillDataOld API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: '伺服器內部錯誤',
      data: {
        error: '處理請求時發生未預期的錯誤',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
});

/**
 * 輔助函數：從議案資料中提取所有可用的屆次
 */
function getAvailableTerms(bills: any[]): number[] {
  const terms = new Set<number>();
  
  bills.forEach(bill => {
    if (bill.編號) {
      const match = bill.編號.match(/(\d+)屆/);
      if (match) {
        terms.add(parseInt(match[1], 10));
      }
    }
  });
  
  return Array.from(terms).sort((a, b) => a - b);
}