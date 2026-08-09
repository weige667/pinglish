import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExamStore = defineStore('exam', () => {
  const records = ref([])     // [{ date, type, score, total, timeSpent, sections }]

  function addRecord(record) {
    records.value.push({
      ...record,
      date: new Date().toISOString()
    })
  }

  function getLatestScore() {
    if (records.value.length === 0) return null
    return records.value[records.value.length - 1]
  }

  return { records, addRecord, getLatestScore }
})
