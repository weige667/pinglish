/**
 * 间隔重复算法（简化版 SM-2）
 * 根据 mastery 等级计算下次复习时间
 *
 * mastery: 0-5
 * 返回: 下次复习时间戳 (ms)
 */

const INTERVALS = [1, 3, 7, 21, 60, 180] // 天

export function calcNextReview(mastery, lastReview) {
  const idx = Math.min(mastery, INTERVALS.length - 1)
  const days = INTERVALS[idx]
  return lastReview + days * 86400000
}

/**
 * 获取当前需要复习的单词列表
 */
export function getDueWords(learnedWords) {
  const now = Date.now()
  return learnedWords.filter(w => !w.nextReview || w.nextReview <= now)
}

/**
 * 计算词汇量估算
 */
export function estimateVocabulary(learnedWords) {
  const mastered = learnedWords.filter(w => w.mastery >= 3).length
  const learning = learnedWords.filter(w => w.mastery >= 1 && w.mastery < 3).length
  return mastered + Math.floor(learning * 0.5)
}
