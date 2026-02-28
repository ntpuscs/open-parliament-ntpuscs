// server/utils/billService.ts
import type { Bill, BillResponse } from '../../shared/types/bill';
import { getCurrentTerm } from '../../shared/utils/term';

export const useBillService = () => {
  // 使用 Nitro 內建的 Virtual Storage API，完美相容 Cloudflare Pages
  const readJsonFile = async (filename: string): Promise<BillResponse> => {
    // 讀取 server/assets/data/ 下的檔案，格式為 'assets:server:目錄:檔名'
    const data = await useStorage('assets:server').getItem(`data:${filename}`);
    
    if (!data) {
      throw createError({ statusCode: 500, statusMessage: `無法讀取資料檔案: ${filename}` });
    }
    
    // useStorage 讀取 JSON 會自動 parse，直接斷言型別即可
    return data as BillResponse;
  };

  const getLatestTermBills = async (): Promise<Bill[]> => {
    const res = await readJsonFile('bill_latestTerm.json');
    return res.data;
  };

  const getPastTermBills = async (): Promise<Bill[]> => {
    const res = await readJsonFile('bill_pastTerm.json');
    return res.data;
  };

  // 取得特定屆次的所有議案
  const getBillsByTerm = async (targetTerm: number): Promise<Bill[]> => {
    if (targetTerm === getCurrentTerm()) {
      return await getLatestTermBills();
    }
    
    const pastBills = await getPastTermBills();
    return pastBills.filter(bill => {
      const match = bill.billNumber.match(/^(\d+)屆/);
      return match && match[1] && parseInt(match[1], 10) === targetTerm;
    });
  };

  // 取得單一特定議案
  const getBillById = async (targetTerm: number, targetNum: number): Promise<Bill | undefined> => {
    const targetString = `${targetTerm}屆北大峽議字第${targetNum}號`;
    
    const bills = targetTerm === getCurrentTerm() 
      ? await getLatestTermBills() 
      : await getPastTermBills();

    return bills.find(bill => bill.billNumber === targetString);
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
    getBillsByTerm,
    getBillById,
    getAllBills
  };
};