import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const stage = ref('junior')          // junior | high | cet4 | cet6
  const vocabulary = ref(0)            // 预估词汇量
  const streak = ref(0)                // 连续打卡天数
  const lastCheckin = ref(null)        // 上次打卡日期
  const title = ref('省队选手')        // 称号
  const medals = ref([])               // 已获得徽章
  const totalStudyMinutes = ref(0)

  const nextTitle = computed(() => {
    const v = vocabulary.value
    if (v >= 5500) return '世界冠军'
    if (v >= 4000) return '亚洲冠军'
    if (v >= 3000) return '全国冠军'
    if (v >= 2000) return '省冠军'
    return '省队选手'
  })

  function checkin() {
    const today = new Date().toDateString()
    if (lastCheckin.value === today) return
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (lastCheckin.value === yesterday) {
      streak.value++
    } else {
      streak.value = 1
    }
    lastCheckin.value = today
  }

  function addVocabulary(n) {
    vocabulary.value += n
    title.value = nextTitle.value
  }

  function addStudyTime(minutes) {
    totalStudyMinutes.value += minutes
  }

  return { stage, vocabulary, streak, lastCheckin, title, medals, totalStudyMinutes, checkin, addVocabulary, addStudyTime, nextTitle }
})
