// shared/utils/term.ts

/**
 * 取得當前（最新）屆次
 * 判斷邏輯：每年 7 月 1 日到隔年 6 月 30 日為一屆。
 * 範例：2025年7月1日～2026年6月30日為第26屆。
 */
export const getCurrentTerm = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() 回傳 0-11，需加 1

  // 如果月份小於 7 (1月~6月)，則屬於「前一年」開始的屆次
  const baseYear = month < 7 ? year - 1 : year;
  
  // 國立臺北大學係 2000 年 2 月成立，故學生自治會屆次以 2000 年為基準年（第 1 屆），因此計算方式為 (baseYear - 1999)。
  return baseYear - 1999;
};

/**
 * 取得所有有效屆次區間陣列
 * 需求：有效屆次為 23 屆以後到最新屆次，因為 23 屆是第一屆開始有系統性地使用議案系統者。
 */
export const getValidTerms = (): number[] => {
  const currentTerm = getCurrentTerm();
  const validTerms: number[] = [];
  
  for (let term = 23; term <= currentTerm; term++) {
    validTerms.push(term);
  }
  
  // 習慣上會將最新屆次排在最前面 (降冪)
  return validTerms.reverse();
};

// 取得最早有效屆次
export const getEarliestTerm = (): number => {
  return 23;
};