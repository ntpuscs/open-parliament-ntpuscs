<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

    <!-- ── 頁首區塊 ─────────────────────────────────────────── -->
    <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 py-3 text-sm text-gray-500 dark:text-gray-400">
          <NuxtLink to="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            首頁
          </NuxtLink>
          <span class="text-gray-300 dark:text-gray-600">/</span>
          <span class="text-gray-300 dark:text-gray-600">/</span>
          <span class="text-gray-900 dark:text-gray-100 font-medium">委員會報告</span>
        </nav>

        <!-- 標題列 -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 pt-2">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              委員會政策建議報告
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              及學生會回覆
            </p>
          </div>

          <!-- 資料更新時間 -->
          <p v-if="cachedAt" class="text-xs text-gray-400 dark:text-gray-500 shrink-0 pb-1">
            資料截至 {{ formatDate(cachedAt) }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── 篩選列 ──────────────────────────────────────────── -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div class="flex flex-col sm:flex-row gap-3">

        <!-- 關鍵字搜尋 -->
        <div class="relative flex-1 max-w-xs">
          <span class="absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500 pointer-events-none">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜尋主旨或提案人…"
            class="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   transition-colors"
          />
        </div>

        <!-- 委員會篩選 -->
        <select
          v-model="selectedCommittee"
          class="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                 transition-colors"
        >
          <option value="">所有委員會</option>
          <option v-for="c in committeeOptions" :key="c" :value="c">{{ c }}</option>
        </select>

        <!-- 回覆狀態篩選 -->
        <div class="flex gap-2">
          <button
            v-for="opt in responseFilters"
            :key="opt.value"
            @click="responseFilter = opt.value"
            :class="[
              'px-3 py-2 text-sm rounded-lg border font-medium transition-all duration-150',
              responseFilter === opt.value
                ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-400 dark:hover:border-primary-500'
            ]"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- 結果計數 -->
      <p class="mt-3 text-xs text-gray-400 dark:text-gray-500">
        共 {{ filteredReports.length }} 筆結果
      </p>
    </div>

    <!-- ── 卡片列表 ─────────────────────────────────────────── -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

      <!-- 載入中 -->
      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="i in 6" :key="i"
          class="h-44 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
        />
      </div>

      <!-- 錯誤 -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-sm">資料載入失敗，請稍後再試。</p>
      </div>

      <!-- 空結果 -->
      <div v-else-if="filteredReports.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-3-3v6M4 6h16M4 10h16M4 14h8"/>
          </svg>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-sm">找不到符合條件的建議報告。</p>
      </div>

      <!-- 卡片 grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="report in filteredReports"
          :key="report.rowIndex"
          @click="openModal(report)"
          class="group text-left rounded-xl border bg-white dark:bg-gray-900
                 border-gray-200 dark:border-gray-800
                 hover:border-primary-400 dark:hover:border-primary-600
                 hover:shadow-md dark:hover:shadow-primary-950/40
                 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500
                 overflow-hidden"
        >
          <!-- 頂部色條 -->
          <div class="h-1 w-full bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          <div class="p-5">
            <!-- 編號 + 狀態標籤 -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-xs font-mono font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 px-2 py-0.5 rounded">
                {{ report['秘書處手動編號'] || `#${report.rowIndex}` }}
              </span>
              <span
                :class="report.governmentResponse?.hasResponse
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800'"
                class="text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {{ report.governmentResponse?.hasResponse ? '已回覆' : '待回覆' }}
              </span>
            </div>

            <!-- 主旨 -->
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 mb-3 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
              {{ report['主旨'] || '（未填主旨）' }}
            </h3>

            <!-- meta 資訊 -->
            <div class="space-y-1">
              <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ report['議員姓名'] || '—' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {{ report['欲提請以哪個委員會之名義提出建議報告？'] || '—' }}
              </p>
              <p v-if="report['排入會議']" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ report['排入會議'] }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- ── Modal 彈窗 ──────────────────────────────────────── -->
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedReport"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        @click.self="closeModal"
      >
        <!-- 遮罩 -->
        <div class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" @click="closeModal" />

        <!-- 彈窗主體 -->
        <Transition
          enter-active-class="duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
          appear
        >
          <div
            class="relative z-10 w-full max-w-2xl max-h-[85vh] flex flex-col
                   bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
                   border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <!-- Modal 頂部色條 -->
            <div class="h-1 w-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 shrink-0" />

            <!-- Modal Header -->
            <div class="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div class="flex items-center gap-3 min-w-0">
                <span class="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 px-2.5 py-1 rounded shrink-0">
                  {{ selectedReport['秘書處手動編號'] || `#${selectedReport.rowIndex}` }}
                </span>
                <span
                  :class="selectedReport.governmentResponse?.hasResponse
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800'"
                  class="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                >
                  {{ selectedReport.governmentResponse?.hasResponse ? '已有學生會回覆' : '待學生會回覆' }}
                </span>
              </div>
              <button
                @click="closeModal"
                class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shrink-0"
                aria-label="關閉"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Modal 捲動區域 -->
            <div class="overflow-y-auto flex-1 px-6 py-5 space-y-5">

              <!-- 主旨 -->
              <div>
                <h2 class="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                  {{ selectedReport['主旨'] || '（未填主旨）' }}
                </h2>
              </div>

              <!-- 基本資訊 grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoField label="提案議員" :value="selectedReport['議員姓名']" />
                <InfoField label="委員會" :value="selectedReport['欲提請以哪個委員會之名義提出建議報告？']" />
                <InfoField label="排入會議" :value="selectedReport['排入會議']" />
                <InfoField label="提交時間" :value="selectedReport['時間戳記']" />
                <InfoField
                  v-if="selectedReport['您欲提出建議之部門(文務)']"
                  label="建議部門"
                  :value="selectedReport['您欲提出建議之部門(文務)']"
                />
                <InfoField
                  v-if="selectedReport['您欲提出建議之部門(財務)']"
                  label="建議部門"
                  :value="selectedReport['您欲提出建議之部門(財務)']"
                />
                <InfoField
                  v-if="selectedReport['您欲提出建議之部門(法制)']"
                  label="建議部門"
                  :value="selectedReport['您欲提出建議之部門(法制)']"
                />
              </div>

              <hr class="border-gray-100 dark:border-gray-800" />

              <!-- 說明 -->
              <ModalSection title="說明" :content="selectedReport['說明']" />

              <!-- 建議方案 -->
              <ModalSection title="建議方案" :content="selectedReport['建議方案']" />

              <!-- 委員會決議 -->
              <ModalSection
                v-if="selectedReport['委員會決議摘要']"
                title="委員會決議摘要"
                :content="selectedReport['委員會決議摘要']"
                accent
              />

              <!-- 建議報告連結 -->
              <div v-if="selectedReport['建議報告連結']">
                <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">建議報告連結</p>
                <a
                  :href="selectedReport['建議報告連結']"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400
                         hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-2 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  開啟完整報告文件
                </a>
              </div>

              <!-- 學生會回覆 -->
              <template v-if="selectedReport.governmentResponse?.hasResponse">
                <hr class="border-gray-100 dark:border-gray-800" />
                <div class="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4">
                  <p class="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                    學生會回覆
                  </p>
                  <p v-if="selectedReport['學生會回覆(文字)']" class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                    {{ selectedReport['學生會回覆(文字)'] }}
                  </p>
                  <p v-if="selectedReport['學生會回覆(提案字號)']" class="text-xs text-emerald-700 dark:text-emerald-400 mt-2">
                    提案字號：{{ selectedReport['學生會回覆(提案字號)'] }}
                  </p>
                </div>
              </template>

            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0 flex justify-end">
              <button
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium rounded-lg
                       bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup>
// ─── 子元件：InfoField ───────────────────────────────────────
const InfoField = defineComponent({
  props: { label: String, value: String },
  template: `
    <div v-if="value">
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-0.5">{{ label }}</p>
      <p class="text-sm text-gray-800 dark:text-gray-200">{{ value }}</p>
    </div>
  `,
})

// ─── 子元件：ModalSection ────────────────────────────────────
const ModalSection = defineComponent({
  props: { title: String, content: String, accent: Boolean },
  template: `
    <div v-if="content">
      <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">{{ title }}</p>
      <p
        :class="accent
          ? 'text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 rounded-lg p-3'
          : 'text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed'"
      >{{ content }}</p>
    </div>
  `,
})

// ─── 資料 ────────────────────────────────────────────────────
const { data, pending, error } = await useFetch('/data/committeeReports.json', {
  key: 'committee-reports',
})

const allReports = computed(() => data.value?.data ?? [])
const cachedAt   = computed(() => data.value?.cachedAt ?? null)

// ─── 篩選狀態 ────────────────────────────────────────────────
const searchQuery       = ref('')
const selectedCommittee = ref('')
const responseFilter    = ref('all')

const responseFilters = [
  { label: '全部',   value: 'all'     },
  { label: '已回覆', value: 'replied' },
  { label: '待回覆', value: 'pending' },
]

// 委員會下拉選項（去重）
const committeeOptions = computed(() =>
  [...new Set(
    allReports.value
      .map(r => r['欲提請以哪個委員會之名義提出建議報告？'])
      .filter(Boolean)
  )].sort()
)

// 篩選後的報告清單
const filteredReports = computed(() => {
  return allReports.value.filter(r => {
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      const subject  = (r['主旨'] ?? '').toLowerCase()
      const proposer = (r['議員姓名'] ?? '').toLowerCase()
      if (!subject.includes(q) && !proposer.includes(q)) return false
    }
    if (selectedCommittee.value && r['欲提請以哪個委員會之名義提出建議報告？'] !== selectedCommittee.value) {
      return false
    }
    if (responseFilter.value === 'replied' && !r.governmentResponse?.hasResponse) return false
    if (responseFilter.value === 'pending' &&  r.governmentResponse?.hasResponse) return false
    return true
  })
})

// ─── Modal 狀態 ──────────────────────────────────────────────
const selectedReport = ref(null)

function openModal(report) {
  selectedReport.value = report
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  selectedReport.value = null
  document.body.style.overflow = ''
}

// ESC 關閉
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
function handleKeydown(e) {
  if (e.key === 'Escape') closeModal()
}

// ─── 工具函式 ────────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleString('zh-TW', {
    year:   'numeric',
    month:  '2-digit',
    day:    '2-digit',
    hour:   '2-digit',
    minute: '2-digit',
  })
}

// ─── SEO ─────────────────────────────────────────────────────
useHead({
  title: '委員會政策建議報告',
})
</script>