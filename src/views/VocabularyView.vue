<template>
  <div class="vocab-view">
    <div class="match-header card">
      <div class="match-info">
        <span class="match-name">{{ matchName }}</span>
        <span class="match-score">比分 {{ score.correct }}:{{ score.wrong }}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPercent + '%' }"></div></div>
      <span class="progress-text">{{ currentIndex + 1 }} / {{ totalWords }} 词</span>
    </div>

    <div class="word-card card" v-if="currentWord && !showComplete">
      <div class="word-display">
        <span class="word-text">{{ currentWord.word }}</span>
        <button class="speak-btn" @click="speakWord(currentWord.word)">🔊</button>
      </div>
      <div class="options" v-if="mode === 'choice'">
        <button v-for="(opt, i) in currentOptions" :key="i" class="option-btn" :class="optionClass(i)" :disabled="answered" @click="checkAnswer(i)">
          <span class="option-label">{{ labels[i] }}</span>
          <span class="option-text">{{ opt }}</span>
          <span class="option-icon" v-if="answered && i === correctIndex">✓</span>
          <span class="option-icon" v-else-if="answered && i === selectedIndex && i !== correctIndex">✗</span>
        </button>
      </div>
      <div class="spell-mode" v-else>
        <p class="spell-hint">请输入单词</p>
        <input ref="spellInput" v-model="spellAnswer" class="spell-input" placeholder="输入单词..." @keyup.enter="checkSpell" :disabled="answered" />
        <button class="btn-primary" @click="checkSpell" :disabled="answered">确认</button>
      </div>
    </div>

    <div class="feedback-card card" v-if="answered && !showComplete">
      <div class="feedback-result" :class="lastCorrect ? 'correct' : 'wrong'">
        <span class="feedback-icon">{{ lastCorrect ? '✅' : '❌' }}</span>
        <span class="feedback-text">{{ lastCorrect ? '正确！+1分' : '错误，已记入错题本' }}</span>
      </div>
      <div class="feedback-detail" v-if="!lastCorrect">
        <p><strong>{{ currentWord.word }}</strong> — {{ currentWord.meaning }}</p>
        <p class="example" v-if="currentWord.example">{{ currentWord.example }}</p>
      </div>
      <button class="btn-primary next-btn" @click="nextWord">{{ currentIndex < totalWords - 1 ? '下一题' : '完成训练' }}</button>
    </div>

    <div class="complete-card card" v-if="showComplete">
      <div class="complete-header"><span class="complete-icon">🏓</span><h2>{{ completeTitle }}</h2></div>
      <div class="complete-stats">
        <div class="cs-item"><span class="cs-value">{{ score.correct }}</span><span class="cs-label">正确</span></div>
        <div class="cs-item"><span class="cs-value">{{ score.wrong }}</span><span class="cs-label">错题</span></div>
        <div class="cs-item"><span class="cs-value">{{ Math.round(score.correct / totalWords * 100) }}%</span><span class="cs-label">正确率</span></div>
      </div>
      <button class="btn-primary" @click="$router.push('/')">返回首页</button>
      <button class="btn-secondary" @click="restart">再来一局</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useWordsStore } from '@/stores/words'
import { useUserStore } from '@/stores/user'
import { speakWord } from '@/utils/speech'

const wordsStore = useWordsStore()
const userStore = useUserStore()
const mode = ref('choice')
const answered = ref(false)
const showComplete = ref(false)
const lastCorrect = ref(false)
const selectedIndex = ref(-1)
const correctIndex = ref(-1)
const spellAnswer = ref('')
const spellInput = ref(null)

const juniorWords = [
  { word: 'abandon', meaning: 'v. 放弃；抛弃', example: 'He abandoned his plan.' },
  { word: 'ability', meaning: 'n. 能力；才能', example: 'She has great ability in music.' },
  { word: 'abroad', meaning: 'adv. 在国外；到国外', example: 'He studied abroad for two years.' },
  { word: 'accept', meaning: 'v. 接受；承认', example: 'Please accept this gift.' },
  { word: 'achieve', meaning: 'v. 达到；取得', example: 'She achieved her goal.' },
  { word: 'active', meaning: 'adj. 积极的；活跃的', example: 'He is an active student.' },
  { word: 'admire', meaning: 'v. 钦佩；赞赏', example: 'I admire your courage.' },
  { word: 'advantage', meaning: 'n. 优势；有利条件', example: 'This plan has many advantages.' },
  { word: 'adventure', meaning: 'n. 冒险；奇遇', example: 'Life is an adventure.' },
  { word: 'afford', meaning: 'v. 负担得起；提供', example: 'I cannot afford this car.' },
  { word: 'ancient', meaning: 'adj. 古代的；古老的', example: 'This is an ancient temple.' },
  { word: 'announce', meaning: 'v. 宣布；通告', example: 'They announced the winner.' },
  { word: 'appreciate', meaning: 'v. 欣赏；感激', example: 'I appreciate your help.' },
  { word: 'attempt', meaning: 'v./n. 尝试；企图', example: 'He made an attempt to escape.' },
  { word: 'attract', meaning: 'v. 吸引；引起', example: 'The lights attracted many people.' },
  { word: 'balance', meaning: 'n. 平衡；余额', example: 'Keep a balance between work and life.' },
  { word: 'bargain', meaning: 'n. 便宜货 v. 讨价还价', example: 'This dress is a real bargain.' },
  { word: 'benefit', meaning: 'n. 利益 v. 有益于', example: 'Exercise benefits your health.' },
  { word: 'blame', meaning: 'v. 责备；归咎于', example: 'Don\'t blame yourself.' },
  { word: 'breathe', meaning: 'v. 呼吸', example: 'Breathe deeply and relax.' },
]

const currentIndex = ref(0)
const score = ref({ correct: 0, wrong: 0 })
const shuffledWords = ref([])
const totalWords = computed(() => shuffledWords.value.length)
const currentWord = computed(() => shuffledWords.value[currentIndex.value] || null)

const matchName = computed(() => {
  const idx = currentIndex.value
  if (idx < 5) return '省选拔赛'
  if (idx < 10) return '省锦标赛'
  if (idx < 15) return '全国锦标赛'
  return '全锦赛决赛'
})

const progressPercent = computed(() => totalWords.value ? Math.round((currentIndex.value + 1) / totalWords.value * 100) : 0)

const completeTitle = computed(() => {
  const rate = score.value.correct / totalWords.value
  if (rate >= 0.9) return '🏆 省冠军！'
  if (rate >= 0.7) return '🥈 省亚军'
  if (rate >= 0.5) return '🥉 省季军'
  return '💪 继续努力！'
})

const labels = ['A', 'B', 'C', 'D']

function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }

const currentOptions = computed(() => {
  if (!currentWord.value) return []
  const correct = currentWord.value.meaning
  const others = juniorWords.filter(w => w.word !== currentWord.value.word)
  const wrong = shuffle(others).slice(0, 3).map(w => w.meaning)
  const options = shuffle([correct, ...wrong])
  correctIndex.value = options.indexOf(correct)
  return options
})

function optionClass(i) {
  if (!answered.value) return ''
  if (i === correctIndex.value) return 'correct'
  if (i === selectedIndex.value) return 'wrong'
  return 'dimmed'
}

function checkAnswer(i) {
  if (answered.value) return
  answered.value = true; selectedIndex.value = i
  const ok = i === correctIndex.value; lastCorrect.value = ok
  if (ok) { score.value.correct++; wordsStore.markLearned(currentWord.value.word, true) }
  else { score.value.wrong++; wordsStore.markLearned(currentWord.value.word, false) }
}

function checkSpell() {
  if (answered.value || !spellAnswer.value.trim()) return
  answered.value = true
  const ok = spellAnswer.value.trim().toLowerCase() === currentWord.value.word.toLowerCase()
  lastCorrect.value = ok
  if (ok) { score.value.correct++; wordsStore.markLearned(currentWord.value.word, true) }
  else { score.value.wrong++; wordsStore.markLearned(currentWord.value.word, false) }
}

function nextWord() {
  if (currentIndex.value < totalWords.value - 1) {
    currentIndex.value++; answered.value = false; selectedIndex.value = -1; spellAnswer.value = ''
    nextTick(() => { if (mode.value === 'spell') spellInput.value?.focus() })
  } else {
    showComplete.value = true
    userStore.addVocabulary(score.value.correct)
    userStore.addStudyTime(5); userStore.checkin()
  }
}

function restart() { initGame() }

function initGame() {
  currentIndex.value = 0; score.value = { correct: 0, wrong: 0 }
  answered.value = false; showComplete.value = false
  selectedIndex.value = -1; spellAnswer.value = ''
  shuffledWords.value = shuffle(juniorWords).slice(0, 10)
}

onMounted(() => initGame())
</script>

<style scoped>
.vocab-view { padding-bottom: 20px; }
.match-header { padding: 16px 20px; margin-bottom: 16px; }
.match-info { display: flex; justify-content: space-between; margin-bottom: 10px; }
.match-name { font-weight: 700; font-size: 15px; color: var(--color-accent); }
.match-score { font-size: 14px; color: var(--color-text-muted); }
.progress-bar { height: 6px; background: var(--color-bg-surface); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--color-accent); border-radius: 3px; transition: width 0.3s; }
.progress-text { display: block; text-align: right; font-size: 12px; color: var(--color-text-muted); margin-top: 6px; }
.word-card { padding: 32px 24px; margin-bottom: 16px; text-align: center; }
.word-display { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 24px; }
.word-text { font-size: 32px; font-weight: 800; color: var(--color-text); }
.speak-btn { background: var(--color-bg-surface); padding: 8px 12px; font-size: 20px; border-radius: 50%; }
.options { display: flex; flex-direction: column; gap: 10px; }
.option-btn { display: flex; align-items: center; gap: 12px; width: 100%; text-align: left; padding: 14px 16px; background: var(--color-bg-surface); color: var(--color-text); border-radius: var(--radius); font-size: 14px; font-weight: 500; transition: all 0.2s; border: 2px solid transparent; }
.option-btn:not(:disabled):active { transform: scale(0.98); }
.option-label { font-size: 13px; color: var(--color-text-muted); font-weight: 700; min-width: 20px; }
.option-text { flex: 1; }
.option-icon { font-size: 16px; font-weight: 700; }
.option-btn.correct { border-color: var(--color-success); background: rgba(42,157,143,0.15); }
.option-btn.wrong { border-color: var(--color-danger); background: rgba(231,111,81,0.15); }
.option-btn.dimmed { opacity: 0.4; }
.spell-mode { margin-top: 8px; }
.spell-hint { font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px; }
.spell-input { width: 100%; padding: 14px 16px; font-size: 18px; background: var(--color-bg-surface); color: var(--color-text); border: 2px solid var(--color-bg-surface); border-radius: var(--radius); margin-bottom: 12px; outline: none; text-align: center; }
.spell-input:focus { border-color: var(--color-accent); }
.spell-mode .btn-primary { width: 100%; }
.feedback-card { padding: 20px; margin-bottom: 16px; }
.feedback-result { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.feedback-icon { font-size: 24px; }
.feedback-text { font-size: 16px; font-weight: 600; }
.feedback-result.correct .feedback-text { color: var(--color-success); }
.feedback-result.wrong .feedback-text { color: var(--color-danger); }
.feedback-detail { margin-bottom: 16px; padding: 12px; background: var(--color-bg-surface); border-radius: 8px; }
.feedback-detail p { margin: 0; }
.example { font-size: 13px; color: var(--color-text-muted); margin-top: 6px !important; }
.next-btn { width: 100%; }
.complete-card { padding: 32px 24px; text-align: center; }
.complete-header { margin-bottom: 24px; }
.complete-icon { font-size: 48px; display: block; margin-bottom: 8px; }
.complete-header h2 { font-size: 24px; color: var(--color-accent); }
.complete-stats { display: flex; justify-content: space-around; margin-bottom: 24px; }
.cs-item { text-align: center; }
.cs-value { display: block; font-size: 28px; font-weight: 800; }
.cs-label { display: block; font-size: 12px; color: var(--color-text-muted); margin-top: 4px; }
.complete-card .btn-primary, .complete-card .btn-secondary { width: 100%; margin-bottom: 10px; }
.btn-secondary { background: var(--color-bg-surface); color: var(--color-text); }
</style>
