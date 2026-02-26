// composables/useCurrentTerm.js
// 功能：計算當前屆次
import { ref, computed } from 'vue'

export const useCurrentTerm = () => {
  const STARTING_TERM = 23 // 起始屆次
  const STARTING_YEAR = 2023 // 23屆對應的起始年份 (2023年6月30日以前23屆，7月1日以後24屆)

  const currentTerm = computed(() => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // 月份從 0 開始，所以要加 1
    const currentDay = now.getDate()

    // 計算基礎屆次：起始屆次 + 經過的完整年份數
    let term = STARTING_TERM + (currentYear - STARTING_YEAR)

    // 如果當前日期已經過了當年的 6 月 30 日 (即 7 月 1 日或之後)，則屆次加一
    // 這裡的邏輯是假設每年的 7 月 1 日是新屆次開始的時間點
    if (currentMonth > 6 || (currentMonth === 6 && currentDay >= 30)) { // 6月30日(含)以前是舊屆次，7月1日(含)以後是新屆次
        term += 1
    }

    return term
  })

  // 計算所有可用屆次（從起始屆次到當前屆次）
  const availableTermsRange = computed(() => {
    const terms = []
    const latestTerm = currentTerm.value
    for (let i = STARTING_TERM; i <= latestTerm; i++) {
      terms.push(i)
    }
    return terms.sort((a, b) => b - a); // 倒序排列，最新屆次在前
  })

  return {
    currentTerm,
    availableTermsRange
  }
}