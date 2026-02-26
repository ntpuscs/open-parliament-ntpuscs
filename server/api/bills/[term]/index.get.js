// import { fetchAllBillsFromGoogleSheets } from '~/server/utils/billsData'; // 導入新的工具函數

export default defineEventHandler(async (event) => {
  try {
    const term = getRouterParam(event, 'term');
    const query = getQuery(event);

    // 獲取所有議案資料
    const allBills = await fetchAllBillsFromGoogleSheets();

    if (!allBills || allBills.length === 0) {
      return {
        bills: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        term: term
      };
    }

    // 根據屆次篩選
    let filteredBills = allBills.filter(bill => {
      const match = bill.編號.match(/(\d+)屆/);
      return match && match[1] === term; // term 是字串，直接比對
    });

    // 套用其他篩選條件
    if (query.編號) {
      filteredBills = filteredBills.filter(bill =>
        bill.編號.includes(query.編號)
      );
    }

    if (query.提案類型) {
      filteredBills = filteredBills.filter(bill =>
        bill.提案類型 === query.提案類型
      );
    }

    if (query['提案機關/議員']) {
      filteredBills = filteredBills.filter(bill =>
        bill['提案機關/議員'].includes(query['提案機關/議員'])
      );
    }

    if (query['提案機關主管/提案議員姓名']) {
      filteredBills = filteredBills.filter(bill =>
        bill['提案機關主管/提案議員姓名'].includes(query['提案機關主管/提案議員姓名'])
      );
    }

    if (query.案由) {
      filteredBills = filteredBills.filter(bill =>
        bill.案由.includes(query.案由)
      );
    }

    if (query.說明) {
      filteredBills = filteredBills.filter(bill =>
        bill.說明.includes(query.說明)
      );
    }

    if (query.辦法) {
      filteredBills = filteredBills.filter(bill =>
        bill.辦法.includes(query.辦法)
      );
    }

    // 日期篩選
    if (query.dateFrom || query.dateTo) {
      filteredBills = filteredBills.filter(bill => {
        try {
          const billDate = new Date(bill.時間戳記);
          const fromDate = query.dateFrom ? new Date(query.dateFrom) : null;
          const toDate = query.dateTo ? new Date(query.dateTo) : null;

          if (fromDate && billDate < fromDate) return false;
          if (toDate && billDate > toDate) return false;

          return true;
        } catch (error) {
          console.warn('Invalid date format:', bill.時間戳記);
          return true; // 如果日期格式錯誤，不進行篩選
        }
      });
    }

    if (query.排入會議) {
      filteredBills = filteredBills.filter(bill =>
        bill.排入會議.includes(query.排入會議)
      );
    }

    // 按時間排序（最新的在前）
    filteredBills.sort((a, b) => {
      try {
        const dateA = new Date(a.時間戳記);
        const dateB = new Date(b.時間戳記);
        return dateB - dateA;
      } catch (error) {
        console.warn('Error sorting by date:', error);
        return 0;
      }
    });

    // 分頁處理
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedBills = filteredBills.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredBills.length / pageSize);

    return {
      bills: paginatedBills,
      total: filteredBills.length,
      page,
      pageSize,
      totalPages,
      term: term
    };

  } catch (error) {
    console.error('Error fetching bills for term:', error);

    // 錯誤處理
    throw createError({
      statusCode: 500,
      statusMessage: `獲取第${getRouterParam(event, 'term')}屆議案資料時發生錯誤`,
      data: {
        error: error.message,
        timestamp: new Date().toISOString(),
        term: getRouterParam(event, 'term')
      }
    });
  }
});