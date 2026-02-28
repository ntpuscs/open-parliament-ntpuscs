// server/utils/billService.ts
import type { Bill, BillResponse } from '../../shared/types/bill';
import { getCurrentTerm } from '../../shared/utils/term'; // 雖然會 auto-import，但加上更明確

export const useBillService = () => {
  const getLatestTermBills = async (): Promise<Bill[]> => {
    const res = await $fetch<BillResponse>('/bill-data/latest_term.json');
    return res.data;
  };

  const getPastTermBills = async (): Promise<Bill[]> => {
    const res = await $fetch<BillResponse>('/bill-data/past_term.json');
    return res.data;
  };

  // 取得特定屆次的所有議案
  const getBillsByTerm = async (targetTerm: number): Promise<Bill[]> => {
    if (targetTerm === getCurrentTerm()) {
      return await getLatestTermBills();
    }
    
    // 如果是舊屆次，讀取歷屆檔案並透過解析 billNumber 來過濾
    const pastBills = await getPastTermBills();
    return pastBills.filter(bill => {
      const match = bill.billNumber.match(/^(\d+)屆/);
      return match && match[1] && parseInt(match[1], 10) === targetTerm;
    });
  };

  // 取得單一特定議案
  const getBillById = async (targetTerm: number, targetNum: number): Promise<Bill | undefined> => {
    // 預期格式："26屆北大峽議字第43號"
    const targetString = `${targetTerm}屆北大峽議字第${targetNum}號`;
    
    // 縮小搜尋範圍以提升效能
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