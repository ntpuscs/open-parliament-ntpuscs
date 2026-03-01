<template>
  <NuxtLink :to="bill.billNumber!==''?`/bill/${bill.term}/${bill.serialNumber}`:`/bill/unnumbered/${bill.rowIndex}`" target="_blank" rel="noopener">
  <div class="bill-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
    <p class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {{ bill.subject }}
    </p>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {{ bill.billNumber!==''? '第'+bill.billNumber.replace(/北大峽議字/, '') : '（本件秘書處尚未編號）' }}
    </p>
    <div class="text-sm text-gray-700 dark:text-gray-300">
<p v-if="bill.proposingEntity === '本會議員'">
  <strong>提案者：</strong>本會{{ bill.proposerName }}議員
</p><p v-else-if="bill.proposingEntity === '本會議長'">
  <strong>提案者：</strong>本會{{ bill.proposerName }}議長
</p>
<p v-else>
  <strong>提案者：</strong>{{ bill.proposingEntity }}
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
  if (typeof props.bill.billNumber !== 'string') return '26'
  const match = props.bill.billNumber.match(/(\d+)屆/)
  return match ? match[1] : '26'
})

const billNumber = computed(() => {
  if (typeof props.bill.billNumber !== 'string') return '1'
  const match = props.bill.billNumber.match(/第(\d+)號/)
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