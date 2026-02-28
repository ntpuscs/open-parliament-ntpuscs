// server/api/bills/index.get.ts
// 支援 Query: ?term=26, ?limit=10, ?type=all
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const billService = useBillService();

  let results: any[] = [];

  // 如果指定 type=all，則忽略 term 直接回傳全部議案
  if (query.type === 'all') {
    results = await billService.getAllBills();
  }
  
  // 如果有指定 term，則回傳該屆次的議案
  else if (query.term) {
    const termNumber = parseInt(query.term as string, 10);
    results = await billService.getBillsByTerm(termNumber);
  }
  
  // 預設回傳最新屆次
  else {
    results = await billService.getLatestTermBills();
  }

  // 支援 limit 限制筆數 (預設供首頁最新 10 筆使用)
  if (query.limit) {
    const limit = parseInt(query.limit as string, 10);
    // 時間戳記最新的在後面，故 slice 最後 limit 筆，然後 reverse 讓最新的在前面
    results = results.slice(-limit).reverse(); 
  }

  return results;
});