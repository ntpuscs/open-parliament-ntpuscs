// server/utils/billService.ts
import type { Bill, BillResponse } from '../../shared/types/bill';
import { getCurrentTerm } from '../../shared/utils/term';

export const useBillService = () => {
  const CDN_BASE_URL = 'https://cdn.jsdelivr.net/gh/ntpusu/legislative-data@main/data';

  // 以 Nitro 內建的 $fetch 存取遠端資料
  const readJsonFile = async (filename: string): Promise<BillResponse> => {
    try {
      // 透過 CDN 讀取資料，並加入超時與重試機制確保在 Cloudflare Pages 等環境穩定執行
      const data = await $fetch<BillResponse>(`${CDN_BASE_URL}/${filename}`, {
        retry: 3,
        retryDelay: 1000,
        timeout: 5000,
      });

      if (!data) {
        throw new Error('Empty data received from CDN');
      }

      // $fetch 讀取 JSON 會自動 parse，直接斷言型別即可
      return data as BillResponse;
    } catch (error) {
      // 錯誤拋出，並額外紀錄錯誤原因方便維護
      console.error(`[CDN Fetch Error] ${filename}:`, error);
      throw createError({ 
        statusCode: 500, 
        statusMessage: `無法從遠端取得議案資料檔案 ${filename} !` 
      });
    }
  };

  const getLatestTermBills = async (): Promise<Bill[]> => {
    const res = await readJsonFile('bill_latestTerm.json');
    return res.data;
  };

  const getPastTermBills = async (): Promise<Bill[]> => {
    const res = await readJsonFile('bill_pastTerms.json');
    return res.data;
  };

  // 取得最新屆次議案資料的快取時間
  const getLatestTermCachedAt = async (): Promise<string> => {
    const res = await readJsonFile('bill_latestTerm.json');
    return res.cachedAt;
  };

  // 取得歷屆議案資料的快取時間
  const getPastTermsCachedAt = async (): Promise<string> => {
    const res = await readJsonFile('bill_pastTerms.json');
    return res.cachedAt;
  };

  // 取得特定屆次的所有議案
  const getBillsByTerm = async (targetTerm: number): Promise<Bill[]> => {
    if (targetTerm === getCurrentTerm()) {
      return await getLatestTermBills();
    }

    const pastBills = await getPastTermBills();
    return pastBills.filter(bill => bill.term === targetTerm);
  };

  // 依議案總流水號（rowIndex）取得單一議案
  const getBillByRowIndex = async (targetRowIndex: number): Promise<Bill | undefined> => {
    const allBills = await getAllBills();
    return allBills.find(bill => bill.rowIndex === targetRowIndex);
  };

  // 由屆次 + 流水號取得單一特定議案
  // 先以 term/serialNumber 定位 rowIndex，再交由 getBillByRowIndex 取值
  const getBillById = async (targetTerm: number, targetSerialNumber: number): Promise<Bill | undefined> => {
    const bills = targetTerm === getCurrentTerm()
      ? await getLatestTermBills()
      : await getPastTermBills();

    const target = bills.find(
      bill => bill.term === targetTerm && bill.serialNumber === targetSerialNumber
    );

    if (!target) return undefined;

    return getBillByRowIndex(target.rowIndex);
  };

  // 取得所有議案
  const getAllBills = async (): Promise<Bill[]> => {
    const [latest, past] = await Promise.all([
      getLatestTermBills(),
      getPastTermBills()
    ]);
    return [...latest, ...past];
  };

  return {
    getLatestTermBills,
    getLatestTermCachedAt,
    getPastTermsCachedAt,
    getBillsByTerm,
    getBillByRowIndex,
    getBillById,
    getAllBills
  };
};