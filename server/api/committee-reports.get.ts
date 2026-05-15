// server/api/committee-reports.get.ts
export default defineEventHandler(async () => {
  const CDN_URL = 'https://cdn.jsdelivr.net/gh/ntpusu/legislative-data@main/data/committeeReports.json'

  try {
    // 透過 $fetch 取得遠端資料，並加入穩定性配置
    const data = await $fetch(CDN_URL, {
      retry: 3,
      retryDelay: 1000,
      timeout: 5000,
    })

    return data
  } catch (error) {
    console.error('[CDN Fetch Error] committeeReports.json:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '無法從遠端取得委員會報告資料！',
    })
  }
})