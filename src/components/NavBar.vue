<template>
  <nav class="navbar">
    <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item">
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
const navItems = [
  { path: '/', icon: '🏓', label: '首页' },
  { path: '/vocabulary', icon: '📖', label: '词汇' },
  { path: '/exam', icon: '🏆', label: '考场' },
  { path: '/dashboard', icon: '📊', label: '数据' }
]
</script>

<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: space-around;
  background: var(--color-bg-card);
  padding: 8px 0;
  z-index: 100;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-muted);
  padding: 4px 16px;
  transition: color 0.2s;
}

.nav-item.router-link-active {
  color: var(--color-accent);
}

.nav-icon {
  font-size: 22px;
}

.nav-label {
  font-size: 11px;
  margin-top: 2px;
}
</style>
