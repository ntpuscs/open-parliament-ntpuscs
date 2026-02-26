<template>
  <NuxtLink :to="`/bill/${billTerm}/${billNumber}`" target="_blank" rel="noopener">
  <div class="bill-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {{ bill.案由 }}
    </h3>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {{ bill.編號 }}
    </p>
    <div class="flex flex-wrap gap-2 mb-3">
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {{ bill.提案類型 }}
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ bill.時間戳記 }}
      </span>
    </div>
    <div class="text-sm text-gray-700 dark:text-gray-300">
<p v-if="bill['提案機關/議員'] === '本會議員'">
  <strong>提案者：</strong>本會{{ bill['提案機關主管/提案議員姓名'] }}議員
</p><p v-else-if="bill['提案機關/議員'] === '本會議長'">
  <strong>提案者：</strong>本會{{ bill['提案機關主管/提案議員姓名'] }}議長
</p>
<p v-else>
  <strong>提案者：</strong>{{ bill['提案機關/議員'] }}
</p>

    </div>
    <div class="text-sm text-gray-700 dark:text-gray-300">
      <p v-if="bill['排入會議'] !== ''">
        <strong>排入會議：</strong>{{ bill['排入會議'] }}
      </p>
    </div>
  </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bill: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const billTerm = computed(() => {
  const match = props.bill.編號.match(/(\d+)屆/)
  return match ? match[1] : '26'
})

const billNumber = computed(() => {
  const match = props.bill.編號.match(/第(\d+)號/)
  return match ? match[1] : '1'
})

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}
</script>

<style scoped>
.bill-card {
  transition: all 0.3s ease;
}

.bill-card:hover {
  transform: translateY(-2px);
}
</style>