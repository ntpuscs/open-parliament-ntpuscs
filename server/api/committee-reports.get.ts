// server/api/committee-reports.get.ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(() => {
  // 讀取 public/data/committeeReports.json
  // process.cwd() 在 Nuxt 4 指向專案根目錄
  const filePath = resolve(process.cwd(), 'public/data/committeeReports.json')
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
})