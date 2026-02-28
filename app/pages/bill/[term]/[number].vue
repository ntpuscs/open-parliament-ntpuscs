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
          <NuxtLink to="/bill" class="hover:text-primary">議案查詢</NuxtLink>
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
        <p class="text-red-700 dark:text-red-300">找不到議案：{{ term }}屆第{{ number }}號</p>
        <p class="text-red-700 dark:text-red-300">{{ error.message || '載入資料失敗' }}</p>
      </div>
    </div>

    <div v-if="status === 'pending'" class="flex justify-center items-center py-12 print:hidden">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span class="ml-2 text-gray-600 dark:text-gray-300">載入中...</span>
    </div>

    <div v-if="status !== 'pending' && !error && bill" class="space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 print:hidden">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ bill.billNumber }}
        </h1>
        <p class="text-lg text-gray-700 dark:text-gray-300">{{ bill.subject }}</p>
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
                          class="inline-flex items-center text-primary-400 hover:text-primary-600 dark: text-primary-400 dark:hover:text-white hover:underline"
                        >
                          <DocumentIcon class="h-4 w-4 mr-1" />
                          {{ attachment.name }}
                          <ArrowTopRightOnSquareIcon class="h-3 w-3 ml-1" />
                        </a>
                      </div>
                      <div v-if="bill.attachments.length === 0" class="text-gray-500 dark:text-gray-400">
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
                      <div v-if="bill.attachments.length === 0" class="text-gray-500">
                        無附件
                      </div>
                    </div>
                  </div>
                  <div v-else-if="field.isMultiline && field.key === 'description'" class="whitespace-pre-wrap">
                    <span v-html="formatIndentedDescription(bill[field.key])"></span>
                  </div>
                  <div v-else-if="field.isMultiline" class="whitespace-pre-wrap">
                    {{ bill[field.key] || '無' }}
                  </div>
                  <div v-else>
                    {{ bill[field.key] || '無' }}
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
import { getCurrentTerm } from '#imports'

// 獲取路由參數
const route = useRoute()
const term = computed(() => parseInt(route.params.term))
const number = computed(() => parseInt(route.params.number))

if (!term.value || isNaN(term.value) || !number.value || isNaN(number.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: '議案參數欠缺或非數值'
  })
}


const { data: bill, status, error } = await useFetch(`/api/bills/${term.value}/${number.value}`);

const tempBillNumber = computed(() => {
  
  if (bill.value?.billNumber) {
    return bill.value.billNumber;
  } else {
    return `第${getCurrentTerm()}屆未編號議案`;
  }
})

// SEO 設定
useHead(() => ({
  title: tempBillNumber.value,
  meta: [
    {
      name: 'description',
      // 修正：加上 .value
      content: bill.value?.subject ? bill.value.subject : `${tempBillNumber.value}議案詳細資料`
    },
    {
      name: 'robots',
      content: 'noindex, nofollow' // 由於議案數量龐大且偶爾涉及個人資料(如人事案)，先使用 noindex, nofollow
    }
  ]
}))

// 定義顯示欄位
const displayFields = computed(() => [
  { label: '編號', key: 'billNumber' },
  { label: '提案時間', key: 'submittedAt' }, 
  { label: '提案機關/議員', key: 'proposingEntity' },
  { label: '機關主管/\n議員姓名', key: 'proposerName' },
  { label: '聯絡人', key: 'contactName' },
  { label: '類型', key: 'billType' },
  { label: '案由', key: 'subject', isMultiline: true },
  { label: '說明', key: 'description', isMultiline: true },
  { label: '辦法', key: 'proposedAction', isMultiline: true },
  { label: '附件', key: 'attachments' },
  { label: '排入會議', key: 'scheduledSession' }
])

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

// 附件欄位：各附件編號、嘗試解析檔名或 Google Drive
const getAttachments = (billData) => {
  if (!billData || !Array.isArray(billData.attachments)) return [];

  return billData.attachments
    .filter((attachmentString) => typeof attachmentString === 'string' && attachmentString.trim())
    .map((attachmentString, index) => {
      let name = `附件 ${index + 1}`; // Default name

      const url = attachmentString.startsWith('http')
        ? attachmentString
        : `https://${attachmentString}`;

      if (
        url.startsWith('https://drive.google.com/') ||
        url.startsWith('https://docs.google.com/')
      ) {
        // Google Drive 連結
        name = `附件 ${index + 1} (Google Drive 連結)`;
      } else {
        // 嘗試解析檔名
        try {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          const fileName = pathParts[pathParts.length - 1];
          if (fileName) {
            name = decodeURIComponent(fileName);
          }
        } catch (e) {
          // URL 解析失敗則使用預設名稱
        }
      }

      return { name, url };
    });
};

// 複製連結功能
const showCopySuccess = ref(false)
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