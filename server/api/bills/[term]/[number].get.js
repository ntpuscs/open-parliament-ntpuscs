// import { fetchAllBillsFromGoogleSheets } from '~/server/utils/billsData'; // 導入工具函數

export default defineEventHandler(async (event) => {
  const { term, number } = event.context.params; // 從路由參數中獲取屆次和議案號碼

  // 參數驗證
  if (!term || isNaN(parseInt(term))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid term parameter',
    });
  }
  if (!number || isNaN(parseInt(number))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid bill number parameter',
    });
  }

  const termString = term; // 屆次作為字串用於比對
  const billNumberString = number; // 議案號碼作為字串用於比對

  try {
    // 獲取所有議案資料
    const allBills = await fetchAllBillsFromGoogleSheets();

    if (!allBills || !Array.isArray(allBills)) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to retrieve bills data from source or data format is incorrect.',
      });
    }

    // 首先根據屆次篩選
    const billsForTerm = allBills.filter(b => {
      const match = b.編號.match(/(\d+)屆/);
      return match && match[1] === termString; // 根據屆次字串篩選
    });

    // 在該屆議案中找到符合條件的單一議案
    const targetBill = billsForTerm.find(b => {
      // 確保 bill.編號 存在
      if (!b || !b.編號) {
        return false;
      }
      // 從議案編號中提取數字部分 (例如從 "第123號" 提取 "123")
      const match = b.編號.match(/第(\d+)號$/);
      // 比較提取出的數字字串和傳入的 billNumberString
      return match && match[1] === billNumberString;
    });

    if (!targetBill) {
      throw createError({
        statusCode: 404,
        statusMessage: `Bill number ${billNumberString} not found for term ${termString}.`,
      });
    }

    // 成功找到議案，返回該議案資料
    return { bill: targetBill };

  } catch (error) {
    console.error(`API Error fetching bill ${billNumberString} for term ${termString}:`, error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch bill detail.',
    });
  }
});