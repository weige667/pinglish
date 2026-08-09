import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWordsStore = defineStore('words', () => {
  const learnedWords = ref([])         // [{ word, mastery, lastReview, nextReview }]
  const wrongWords = ref([])           // [{ word, count, lastWrong }]
  const currentLevel = ref('junior')

  function markLearned(word, correct) {
    const existing = learnedWords.value.find(w => w.word === word)
    if (existing) {
      existing.mastery = correct ? Math.min(existing.mastery + 1, 5) : Math.max(existing.mastery - 1, 0)
      existing.lastReview = Date.now()
    } else {
      learnedWords.value.push({ word, mastery: correct ? 1 : 0, lastReview: Date.now(), nextReview: Date.now() })
    }

    if (!correct) {
      const wrong = wrongWords.value.find(w => w.word === word)
      if (wrong) {
        wrong.count++
        wrong.lastWrong = Date.now()
      } else {
        wrongWords.value.push({ word, count: 1, lastWrong: Date.now() })
      }
    }
  }

  function getWordsForLevel(level) {
    currentLevel.value = level
    // TODO: 从 IndexedDB 按级别加载词库
  }

  return { learnedWords, wrongWords, currentLevel, markLearned, getWordsForLevel }
})
