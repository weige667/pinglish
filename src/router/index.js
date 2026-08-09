import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/diagnosis', name: 'diagnosis', component: () => import('../views/DiagnosisView.vue') },
  { path: '/vocabulary', name: 'vocabulary', component: () => import('../views/VocabularyView.vue') },
  { path: '/grammar', name: 'grammar', component: () => import('../views/GrammarView.vue') },
  { path: '/listening', name: 'listening', component: () => import('../views/ListeningView.vue') },
  { path: '/reading', name: 'reading', component: () => import('../views/ReadingView.vue') },
  { path: '/exam', name: 'exam', component: () => import('../views/ExamView.vue') },
  { path: '/wrongbook', name: 'wrongbook', component: () => import('../views/WrongbookView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
