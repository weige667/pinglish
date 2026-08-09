<template>
  <div class="home-view">
    <!-- Hero 卡片 -->
    <div class="hero-card card">
      <div class="hero-top">
        <div class="hero-text">
          <h1 class="hero-title">Pinglish</h1>
          <p class="hero-subtitle">乒乓球主题 · 英语四级训练</p>
        </div>
        <div class="hero-rank">
          <span class="rank-icon">🏓</span>
          <span class="rank-name">{{ userStore.title }}</span>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat-item">
          <span class="stat-value">{{ userStore.vocabulary }}</span>
          <span class="stat-label">词汇量</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ userStore.streak }}</span>
          <span class="stat-label">连续打卡</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">{{ Math.floor(userStore.totalStudyMinutes / 60) }}h{{ userStore.totalStudyMinutes % 60 }}m</span>
          <span class="stat-label">学习时长</span>
        </div>
      </div>
    </div>

    <!-- 今日任务 -->
    <section class="section">
      <h2 class="section-title">今日任务</h2>
      <div class="task-card card" v-for="task in dailyTasks" :key="task.id" @click="goTask(task)">
        <div class="task-icon">{{ task.icon }}</div>
        <div class="task-info">
          <span class="task-name">{{ task.name }}</span>
          <span class="task-desc">{{ task.desc }}</span>
        </div>
        <div class="task-action">
          <span class="task-badge" :class="task.done ? 'done' : ''">{{ task.done ? '已完成' : '去训练' }}</span>
        </div>
      </div>
    </section>

    <!-- 打卡日历 -->
    <section class="section">
      <h2 class="section-title">本周打卡</h2>
      <div class="calendar card">
        <div class="calendar-row">
          <div class="day-cell" v-for="day in weekDays" :key="day.date" :class="{ checked: day.checked, today: day.isToday }">
            <span class="day-name">{{ day.label }}</span>
            <span class="day-icon">{{ day.checked ? '🔥' : day.isToday ? '⭐' : '·' }}</span>
            <span class="day-num">{{ day.num }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速入口 -->
    <section class="section">
      <h2 class="section-title">快速入口</h2>
      <div class="quick-grid">
        <div class="quick-card card" @click="$router.push('/diagnosis')">
          <span class="quick-icon">📝</span>
          <span class="quick-label">摸底测试</span>
        </div>
        <div class="quick-card card" @click="$router.push('/vocabulary')">
          <span class="quick-icon">📖</span>
          <span class="quick-label">词汇训练</span>
        </div>
        <div class="quick-card card" @click="$router.push('/exam')">
          <span class="quick-icon">🏆</span>
          <span class="quick-label">模拟考场</span>
        </div>
        <div class="quick-card card" @click="$router.push('/wrongbook')">
          <span class="quick-icon">📌</span>
          <span class="quick-label">错题本</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const dailyTasks = ref([
  { id: 'words', name: '词汇闯关', desc: '今日 20 词 · 省选拔赛', icon: '🔤', done: false, route: '/vocabulary' },
  { id: 'review', name: '复习旧词', desc: '待复习 5 词 · 热身赛', icon: '🔄', done: false, route: '/vocabulary' },
  { id: 'listen', name: '听力训练', desc: '1 篇慢速 · 基本功', icon: '🎧', done: false, route: '/listening' },
])

const now = new Date()
const weekDays = computed(() => {
  const days = []
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  const labels = ['一', '二', '三', '四', '五', '六', '日']
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push({
      label: labels[i],
      num: d.getDate(),
      date: d.toDateString(),
      isToday: d.toDateString() === now.toDateString(),
      checked: userStore.streak > 0 && i < ((userStore.streak - 1) % 7 + 1)
    })
  }
  return days
})

function goTask(task) {
  if (task.route) router.push(task.route)
}
</script>

<style scoped>
.home-view { padding-bottom: 20px; }

.hero-card {
  background: linear-gradient(135deg, #c1121f 0%, #e63946 50%, #e76f51 100%);
  padding: 24px;
  margin-bottom: 24px;
}

.hero-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.hero-title { font-size: 28px; font-weight: 800; color: #fff; }
.hero-subtitle { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }
.hero-rank { background: rgba(255,255,255,0.2); border-radius: 20px; padding: 6px 14px; display: flex; align-items: center; gap: 6px; }
.rank-icon { font-size: 18px; }
.rank-name { font-size: 13px; color: #fff; font-weight: 600; }
.hero-stats { display: flex; justify-content: space-around; }
.stat-item { text-align: center; }
.stat-value { display: block; font-size: 22px; font-weight: 700; color: #fff; }
.stat-label { font-size: 11px; color: rgba(255,255,255,0.65); margin-top: 2px; }
.stat-divider { width: 1px; background: rgba(255,255,255,0.2); }

.section { margin-bottom: 24px; }
.section-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; color: var(--color-text); }

.task-card { display: flex; align-items: center; padding: 16px 20px; cursor: pointer; transition: transform 0.15s; }
.task-card:active { transform: scale(0.98); }
.task-icon { font-size: 28px; margin-right: 14px; }
.task-info { flex: 1; }
.task-name { display: block; font-size: 15px; font-weight: 600; }
.task-desc { display: block; font-size: 12px; color: var(--color-text-muted); margin-top: 2px; }
.task-badge { font-size: 12px; padding: 5px 12px; border-radius: 14px; background: var(--color-primary); color: #fff; font-weight: 600; }
.task-badge.done { background: var(--color-success); }

.calendar { padding: 16px; }
.calendar-row { display: flex; justify-content: space-around; }
.day-cell { text-align: center; padding: 4px; }
.day-name { display: block; font-size: 11px; color: var(--color-text-muted); }
.day-icon { display: block; font-size: 18px; margin: 4px 0; }
.day-num { display: block; font-size: 13px; font-weight: 600; }
.day-cell.today .day-name { color: var(--color-accent); font-weight: 700; }
.day-cell.checked .day-num { color: var(--color-accent); }

.quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.quick-card { display: flex; flex-direction: column; align-items: center; padding: 20px; cursor: pointer; transition: transform 0.15s; }
.quick-card:active { transform: scale(0.96); }
.quick-icon { font-size: 32px; margin-bottom: 8px; }
.quick-label { font-size: 13px; font-weight: 600; }
</style>
