// server/api/bills/byRowIndex/[rowIndex].get.ts
// 處理 /api/bills/byRowIndex/123 這種請求
export default defineEventHandler(async (event) => {
  const rowIndex = parseInt(getRouterParam(event, 'rowIndex') || '3', 10);

  if (!rowIndex || isNaN(rowIndex)) {
    throw createError({ statusCode: 400, statusMessage: '無效的議案總流水號' });
  }

  const billService = useBillService();
  const bill = await billService.getBillByRowIndex(rowIndex);

  if (!bill) {
    throw createError({ statusCode: 404, statusMessage: '找不到該議案' });
  }

  return bill;
});