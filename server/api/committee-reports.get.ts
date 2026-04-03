// server/api/committee-reports.get.ts
export default defineEventHandler(async () => {
  const data = await useStorage('assets:server').getItem('data:committeeReports.json')
  return data
})