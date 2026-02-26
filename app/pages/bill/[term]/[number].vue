<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 列印專用標題 -->
    <div class="hidden print:block text-center mb-8">
      <h1 class="text-2xl font-bold">國立臺北大學三峽校區學生議會提案資料</h1>
    </div>

    <!-- 導覽列與麵包屑：列印時隱藏 -->
    <nav class="mb-6 print:hidden">
      <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <li>
          <NuxtLink to="/" class="hover:text-primary">首頁</NuxtLink>
        </li>
        <li>/</li>
        <li>
          <NuxtLink to="/bill/new-list" class="hover:text-primary">議案查詢</NuxtLink>
        </li>
        <li>/</li>
        <li>
          <NuxtLink :to="`/bill/${term}`" class="hover:text-primary">第{{ term }}屆</NuxtLink>
        </li>
        <li>/</li>
        <li class="text-gray-900 dark:text-white">第{{ number }}號</li>
      </ol>
    </nav>

    <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg print:hidden">
      <div class="flex items-center">
        <ExclamationTriangleIcon class="h-5 w-5 text-red-500 mr-2" />
        <p class="text-red-700 dark:text-red-300">{{ error.message || '載入資料失敗' }}</p>
      </div>
    </div>

    <div v-if="pending" class="flex justify-center items-center py-12 print:hidden">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-300">載入中...</span>
    </div>

    <div v-if="!pending && !error && bill" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 print:hidden">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ bill.編號 }}
        </h1>
        <p class="text-lg text-gray-700 dark:text-gray-300">{{ bill.案由 }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 print:hidden">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">詳細資料</h2>
        </div>
        <div>
          <table class="w-full">
            <tbody>
              <tr
                v-for="(field, index) in displayFields"
                :key="index"
                class="block sm:table-row border-b sm:border-0 last:border-b-0"
              >
                <td
                  class="block sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 w-full sm:w-1/4 border-b-0 sm:border-b"
                >
                  {{ field.label }}
                </td>
                <td
                  class="block sm:table-cell px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b-0 sm:border-b"
                >
                  <div v-if="field.key === 'attachments'" class="space-y-2">
                    <!-- 非列印模式：顯示連結 -->
                    <div v-if="!window?.matchMedia?.('print').matches" class="print:hidden">
                      <div v-for="(attachment, attachIndex) in getAttachments(bill)" :key="attachIndex">
                        <a
                          v-if="attachment.url"
                          :href="attachment.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center text-primary hover:text-primary-600 dark: text-primary-400 dark:hover:text-white hover:underline"
                        >
                          <DocumentIcon class="h-4 w-4 mr-1" />
                          {{ attachment.name }}
                          <ArrowTopRightOnSquareIcon class="h-3 w-3 ml-1" />
                        </a>
                      </div>
                      <div v-if="getAttachments(bill).length === 0" class="text-gray-500 dark:text-gray-400">
                        無附件
                      </div>
                    </div>
                    <!-- 列印模式：顯示純文字 -->
                    <div class="hidden print:block break-all">
                      <div v-for="(attachment, attachIndex) in getAttachments(bill)" :key="attachIndex">
                        <span style="text-indent: -1em; margin-left: 1em; display: block;">
                          附件 {{ attachIndex + 1 }}：{{ attachment.url }}
                        </span>
                      </div>
                      <div v-if="getAttachments(bill).length === 0" class="text-gray-500">
                        無附件
                      </div>
                    </div>
                  </div>
                  <div v-else-if="field.key === '提案時間'">
                    {{ formatTimestamp(bill[field.originalKey]) }}
                  </div>
                  <div v-else-if="field.isMultiline && field.key === '說明'" class="whitespace-pre-wrap">
                    <span v-html="formatIndentedDescription(bill[field.originalKey])"></span>
                  </div>
                  <div v-else-if="field.isMultiline" class="whitespace-pre-wrap">
                    {{ bill[field.originalKey] || '無' }}
                  </div>
                  <div v-else>
                    {{ bill[field.originalKey] || '無' }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 下排按鈕：列印時隱藏 -->
      <div class="flex flex-wrap gap-4 print:hidden">
        <NuxtLink
          :to="`/bill/${term}`"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ChevronLeftIcon class="h-4 w-4 mr-2" />
          返回議案清單
        </NuxtLink>
        <button
          @click="copyUrl"
          class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors dark:bg-primary-400 dark:hover:bg-primary-300"
        >
          <LinkIcon class="h-4 w-4 mr-2" />
          複製連結
        </button>
        <button
          @click="printPage"
          class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors dark:bg-green-700 dark:hover:bg-green-800"
        >
          <PrinterIcon class="h-4 w-4 mr-2" />
          列印
        </button>
      </div>
    </div>

    <div v-if="!pending && !error && !bill" class="text-center py-12 print:hidden">
      <DocumentTextIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">找不到此議案</h3>
      <p class="text-gray-600 dark:text-gray-300">請確認議案編號是否正確</p>
      <div class="mt-4">
        <NuxtLink
          :to="`/bill/${term}`"
          class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          查看第{{ term }}屆議案
        </NuxtLink>
      </div>
    </div>

    <div
      v-if="showCopySuccess"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 print:hidden"
    >
      連結已複製到剪貼簿
    </div>

    <!-- 列印專用結尾 -->
    <div
      class="hidden print:block text-sm text-gray-700 mt-12"
      style="word-break: break-all;"
    >
      <div>
        {{ printFooterText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ExclamationTriangleIcon,
  DocumentTextIcon,
  DocumentIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  LinkIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline'

// 獲取路由參數
const route = useRoute()
const term = computed(() => parseInt(route.params.term))
const number = computed(() => parseInt(route.params.number))

if (!term.value || isNaN(term.value) || !number.value || isNaN(number.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: '議案參數無效'
  })
}

// 使用 Nuxt 內建的 useAsyncData 來從 API 獲取資料
// URL 直接指向我們新建立的 API 路由
const { data, pending, error } = await useAsyncData(
  `bill-${term.value}-${number.value}`, // 唯一的 key
  () => $fetch(`/api/bills/${term.value}/${number.value}`) // 請求 API
)

// 解構出 bill 資料
// 注意：如果 API 返回 { bill: targetBill }，那麼 data.value.bill 就是您要的議案物件
const bill = computed(() => data.value?.bill);


// 響應式數據
const showCopySuccess = ref(false)


// SEO 設定
const billTitle = computed(() => {
  return bill.value ? `${bill.value.編號} - 三峽校區議事服務` : `第${term}屆第${number}號議案 - 三峽校區議事服務`
})

useHead(() => ({
  title: bill.value
    ? `${bill.value.編號} - 三峽校區議事服務`
    : `第${term}屆第${number}號議案 - 三峽校區議事服務`,
  meta: [
    {
      name: 'description',
      content: bill.value
        ? bill.value.案由
        : `第${term}屆第${number}號議案詳細資料`
    },
    {
      name: 'robots',
      content: 'noindex, nofollow' // 由於內容是動態生成且可能非公開，建議使用 noindex, nofollow
    }
  ]
}))

// 定義顯示欄位
const displayFields = computed(() => [
  { label: '編號', key: '編號', originalKey: '編號' },
  { label: '提案時間', key: '提案時間', originalKey: '時間戳記' }, // Keep originalKey for direct access
  { label: '提案機關/議員', key: '提案機關/議員', originalKey: '提案機關/議員' },
  { label: '機關主管/\n議員姓名', key: '提案機關主管/提案議員姓名', originalKey: '提案機關主管/提案議員姓名' },
  { label: '聯絡人', key: '提案聯絡人姓名', originalKey: '提案聯絡人姓名 ' },
  //{ label: '提案聯絡人公務電子郵件', key: '提案聯絡人公務電子郵件', originalKey: '提案聯絡人公務電子郵件' }, // Add this field
  { label: '類型', key: '提案類型', originalKey: '提案類型' },
  { label: '案由', key: '案由', originalKey: '案由', isMultiline: true },
  { label: '說明', key: '說明', originalKey: '說明', isMultiline: true },
  { label: '辦法', key: '辦法', originalKey: '辦法', isMultiline: true },
  { label: '附件', key: 'attachments', originalKey: 'attachments' }, // This will now be a "virtual" field
  { label: '排入會議', key: '排入會議', originalKey: '排入會議' }
])

// New function to format timestamp strings more robustly
const formatTimestamp = (timestampString) => {
  if (!timestampString) return '無';
  try {
    // Replace '下午' with 'PM' and '上午' with 'AM' for better Date parsing
    const normalizedString = timestampString
      .replace('下午', 'PM')
      .replace('上午', 'AM');

    const date = new Date(normalizedString);

    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
      // Fallback for tricky formats, try to manually parse
      const parts = timestampString.match(/(\d{4})\/(\d{1,2})\/(\d{1,2}) (上午|下午) (\d{1,2}):(\d{1,2}):(\d{1,2})/);
      if (parts) {
        let year = parseInt(parts[1]);
        let month = parseInt(parts[2]) - 1; // Month is 0-indexed
        let day = parseInt(parts[3]);
        let hour = parseInt(parts[5]);
        let minute = parseInt(parts[6]);
        const ampm = parts[4];

        if (ampm === '下午' && hour < 12) {
          hour += 12;
        } else if (ampm === '上午' && hour === 12) { // Midnight (12 AM)
          hour = 0;
        }
        const parsedDate = new Date(year, month, day, hour, minute);
        return parsedDate.toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return timestampString; // Return original if parsing fails
    }

    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      // hour12: true // Ensure AM/PM is correctly rendered based on locale
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return timestampString; // Fallback to original string on error
  }
}

// Updated getAttachments function to handle multiple '附件' columns
const getAttachments = (billData) => {
  if (!billData) return [];
  const attachments = [];
  let i = 1;
  while (billData[`附件${i}`]) {
    const attachmentString = billData[`附件${i}`];
    if (attachmentString.trim()) {
      
      let name = `附件 ${i}`; // Default name

      const url = attachmentString.startsWith('http') ? attachmentString : `https://${attachmentString}`;

      if ( url.startsWith('https://drive.google.com/') || url.startsWith('https://docs.google.com/') ) {
        // For Google Drive links
        name = `附件 ${i} (Google Drive 連結)`;
      }
      else {
        // 如非 Google Drive 連結，嘗試解析檔名
        try {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          const fileName = pathParts[pathParts.length - 1];
          if (fileName) {
              name = decodeURIComponent(fileName);
          }
        } catch (e) {
            // If URL parsing fails, stick with default name
        }
      }
      attachments.push({ name: name, url: url });
    }
    i++;
  }
  return attachments;
};


// 說明欄位：偵測每行是否以「一、」等開頭，若是則凸排兩全形字元
function formatIndentedDescription(desc) {
  if (!desc) return '無';
  const cjkNums = '一二三四五六七八九十';
  return desc
    .split('\n')
    .map(line => {
      if (line.match(new RegExp(`^[${cjkNums}]、`))) {
        // 使用 <p> 並套用 text-indent 與 margin-left
        return `<p style="text-indent: -2em; margin-left: 2em;">${line}</p>`;
      }
      return `<p>${line}</p>`;
    })
    .join('');
}

// 複製連結功能
const copyUrl = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showCopySuccess.value = true;
    setTimeout(() => {
      showCopySuccess.value = false;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy URL:', err);
    alert('複製連結失敗，請手動複製。');
  });
};

// 列印功能
const printPage = () => {
  window.print();
};

// 列印頁尾資訊
const printFooterText = computed(() => {
  const now = new Date()
  const pad = n => n.toString().padStart(2, '0')
  const dateStr = `資料為${now.getFullYear()-1911}年${now.getMonth() + 1}月${now.getDate()}日${pad(now.getHours())}時${pad(now.getMinutes())}分${pad(now.getSeconds())}秒`
  return `${dateStr}自網址 ${typeof window !== 'undefined' ? window.location.href : ''} 載入。`
})
</script>

<style>
/* filepath: bill/:term/:number */
/* Tailwind 已有 print:hidden、print:block，這裡保險再補充一次 */
@media print {
  .print\:hidden { display: none !important; }
  .print\:block { display: block !important;  }
    body {
    font-family: "Times New Roman", Times, "標楷體", "DFKai-SB", serif !important;
  }
  /* 表格字體放大 */
  table, th, td {
    font-size: 1.1rem !important;
  }
  /* 標題欄（左欄）粗體、全黑 */
  td:first-child {
    font-weight: bold !important;
    color: #000 !important;
    background: none !important;
  }
  /* 資料欄（右欄）正常粗細、全黑 */
  td:not(:first-child) {
    font-weight: normal !important;
    color: #000 !important;
    background: none !important;
  }
}
</style>