<template>
    <p>您係透過臨時總流水號查詢議案，這通常代表該議案秘書處尚未為程序審查，故無「北大峽議字」之編號。</p>
    <p class="font-bold"><NuxtLink :to="`/bill/${bill.term}`">返回第{{ bill.term }}屆議案列表</NuxtLink></p>
    <p v-if="status==='pending'">載入中。</p>
    <p v-if="error">{{ error }}</p>
    <div v-else-if="bill" class="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <p>系統查得以下議案總流水號編號為{{ bill?.rowIndex }}之議案：</p>
        <p class="text-lg font-bold mb-2">【案由】{{ bill.subject }}</p>
      <p class="mb-1">
        <strong>提案者：</strong>{{ bill.proposingEntity }}
        （<strong>機關主管或議員</strong>：{{ bill.proposerName }}；
        <strong>聯絡人</strong>：{{ bill.contactName }}）
      </p>
      <p class="mb-1"><strong>類型：</strong>{{ bill.billType }}</p>
      <p class="mb-1"><strong>提出日期：</strong>{{ bill.submittedAt }}</p>
      <p class="mb-1"><strong>說明：</strong>{{ bill.description }}</p>
      <p class="mb-1"><strong>辦法：</strong>{{ bill.proposedAction }}</p>
      <div v-if="bill.attachments && bill.attachments.length > 0" class="mt-2">
        <strong>附件：</strong>
        <ul class="list-disc list-inside">
          <li v-for="(attachment, index) in bill.attachments" :key="index">
            <a :href="attachment" target="_blank" rel="noopener" class="text-blue-600 dark:text-blue-400 hover:underline">
              附件 {{ index + 1 }}
            </a>
          </li>
        </ul>
      </div>
      <p class="mb-1"><strong>排入會議：</strong>{{ bill.scheduledSession }}</p>
    </div>
</template>
<script setup>
const route = useRoute()
const routeRowIndex = computed(() => parseInt(route.params.rowIndex))

if (!routeRowIndex.value || isNaN(routeRowIndex.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: '議案總流水號欠缺或非數值'
  })
}

const { data: bill, status, error } = await useFetch(`/api/bills/byRowIndex/${routeRowIndex.value}`);

useHead({
  title: bill.value ? `第 ${bill.value.rowIndex} 號議案` : '議案詳情',
  meta: [
    {
      name: 'description',
      content: bill.value ? `查看議案「${bill.value.subject}」的詳細資訊，包括提案者、類型、提出日期、說明、辦法等。` : '查看議案的詳細資訊。'
    }
  ]
})
</script>