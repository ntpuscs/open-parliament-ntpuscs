// composables/useSecretariat.ts
import { ref, computed } from 'vue'
import { useFetch } from '#app'
import {useCurrentTerm} from './useCurrentTerm'

// 定義議案資料的 TypeScript 介面
interface Bill {
  // 原始 API 回傳的屬性名
  編號: string; // 例如: "26屆北大峽議字第1號"
  時間戳記: string;
  "提案機關/議員": string;
  "提案機關主管/提案議員姓名": string;
  "提案聯絡人姓名 ": string;
  "提案聯絡人公務電子郵件": string;
  提案類型: string;
  案由: string;
  說明: string;
  辦法: string;
  附件1: string;
  附件2: string;
  附件3: string;
  附件4: string;
  附件5: string;
  // 新增：解析後的屆期和議案號碼
  term: number;
  number: number;
}

// 定義 API 回傳的完整結構
interface ApiResponse {
  bills: Bill[];
}

/**
 * 將阿拉伯數字轉換為中文數字
 * @param num 阿拉伯數字
 * @returns 中文數字字串
 */
function toChineseNumeral(num: number): string {
  const chineseNumerals = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (num >= 0 && num <= 10) {
    return chineseNumerals[num];
  }
  else if (num > 10 && num < 20) {
    return '十' + (num % 10 === 0 ? '' : chineseNumerals[num % 10]);
  }
  // 對於大於20的數字簡單處理，如果超出範圍，直接返回數字字串
  return num.toString();
}

export function useSecretariat() {
  const { currentTerm } = useCurrentTerm(); // 獲取當前屆期
  const bills = ref<Bill[]>([]); // 儲存從 API 獲取的議案資料
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * 根據當前屆期從 API 獲取議案資料
   */
  const fetchBills = async () => {
    if (!currentTerm.value) {
      error.value = '無法獲取當前屆期，請稍後再試。';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      // 使用 Nuxt 3 的 useFetch 函數進行 API 請求
      // 將泛型型別改為 ApiResponse
      // 根據歷史經驗，每屆提案可能高達一百多案。
      const { data, pending, error: fetchError } = await useFetch<ApiResponse>(`/api/bills/${currentTerm.value}?pageSize=150`);

      if (fetchError.value) {
        error.value = `獲取議案資料失敗：${fetchError.value.message}`;
      } else if (data.value && data.value.bills) { // 確保 data.value 和 data.value.bills 都存在
        bills.value = data.value.bills.map(bill => {
          // 從 "編號" 欄位中解析屆期和編號
          const match = bill.編號.match(/(\d+)屆北大峽議字第(\d+)號/);
          const term = match ? parseInt(match[1], 10) : 0;
          const number = match ? parseInt(match[2], 10) : 0;

          return {
            ...bill, // 保留所有原始屬性
            term: term, // 賦值解析出的屆期
            number: number, // 賦值解析出的議案號碼
          };
        });
        // console.log('已載入議案資料:', bills.value); // 除錯用
      } else {
        error.value = 'API 回應資料格式不正確或無議案資料。';
      }
    } catch (e: any) {
      error.value = `獲取議案資料時發生錯誤：${e.message}`;
      console.error('fetchBills 錯誤:', e); // 輸出詳細錯誤訊息
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 根據輸入的議案編號順序，生成議程文字
   * @param orderString 逗號分隔的議案編號字串，例如 "1, 2, 4, 3"
   * @returns 生成的議程文字
   */
  const generateAgenda = (orderString: string): string => {
    if (!orderString || !bills.value.length) {
      return '請輸入有效的議案編號順序，並確保已載入議案資料。';
    }

    const orderNumbers = orderString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    let agendaText = '';

    orderNumbers.forEach((num, index) => {
      // 直接使用 bill.number 進行查找
      const bill = bills.value.find(b => b.number === num);

      if (bill) {
        // 使用 toChineseNumeral 轉換順序數字
        agendaText += `（${toChineseNumeral(index + 1)}）審查${bill.term}屆北大峽議字第${bill.number}號【${bill.案由}】。\n`;
      } else {
        agendaText += `（${toChineseNumeral(index + 1)}）無法找到${currentTerm.value}屆北大峽議字第${num}號議案。\n`;
      }
    });

    return agendaText;
  };

  /**
   * 根據輸入的議案編號順序，生成會議紀錄草稿的 Markdown 文字
   * @param orderString 逗號分隔的議案編號字串，例如 "1, 2, 4, 3"
   * @returns 生成的會議紀錄 Markdown 文字
   */
  const generateMinutes = (orderString: string): string => {
    if (!orderString || !bills.value.length) {
      return '請輸入有效的議案編號順序，並確保已載入議案資料。';
    }

    const orderNumbers = orderString.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    let minutesText = '';

    orderNumbers.forEach((num, index) => {
      // 直接使用 bill.number 進行查找
      const bill = bills.value.find(b => b.number === num);

      if (bill) {
        // 使用 toChineseNumeral 轉換順序數字
        minutesText += `### 第${toChineseNumeral(index + 1)}案\n\n`;
        minutesText += `編號：${bill.term}屆北大峽議字第${bill.number}號\n\n`;
        minutesText += `案由：${bill.案由}\n\n`;
        minutesText += `說明：\n${bill.說明}\n\n`;
        minutesText += `辦法：${bill.辦法}\n\n`;
        minutesText += `附件：詳見[已提案件查詢系統](https://sxcongress.ntpusu.org/bill/${bill.term}/${bill.number})\n\n`;
        minutesText += `決議：\n　一、提案機關說明及經本會議員詢答完畢。\n　二、議員提案包裹表決，議員附議，通過。\n　三、全案，同意票票，不同意票票，通過。\n\n`;
      } else {
        // 使用 toChineseNumeral 轉換順序數字
        minutesText += `## 第${toChineseNumeral(index + 1)}案\n\n`;
        minutesText += `無法找到${currentTerm.value}屆北大峽議字第${num}號議案的資料。\n\n`;
      }
    });

    return minutesText;
  };

  // 在組合函式被使用時立即獲取議案資料
  fetchBills();

  return {
    bills,
    currentTerm,
    isLoading,
    error,
    fetchBills,
    generateAgenda,
    generateMinutes,
  };
}
