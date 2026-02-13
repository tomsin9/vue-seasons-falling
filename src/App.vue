<template>
  <div id="app" :class="theme">
    <div class="dashboard">
      <h1>Vue Seasons Falling</h1>
      <div class="btn-group">
        <button v-for="s in seasons" :key="s" 
          @click="changeSeason(s)" 
          :class="{ active: currentSeason === s }">
          {{ s.toUpperCase() }}
        </button>
        <button class="theme-btn" @click="toggleTheme" :title="theme === 'dark' ? 'Switch to light' : 'Switch to dark'">
          {{ theme === 'dark' ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>
      <div class="stats">
        <span>Particles: 200</span> | 
        <span>Wind: 0.5</span>
      </div>
    </div>

    <SeasonsFalling 
      :key="currentSeason"
      :season="currentSeason"
      :theme="theme"
      :amount="200"
      :size="4"
      :speed="1.5"
      :wind="0.5"
      :swing="1"
      :opacity="0.8"
    />
  </div>
</template>

<script>
import SeasonsFalling from './components/SeasonsFalling.vue';

export default {
  name: 'app',
  components: { SeasonsFalling },
  data() {
    return {
      currentSeason: 'autumn',
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      theme: 'light', // 'light' | 'dark'
      // 根據季節自動換背景色，測試視覺效果
      bgColors: {
        spring: '#fce4ec', // 淺粉
        summer: '#e0f7fa', // 淺藍
        autumn: '#fff3e0', // 淺橘
        winter: '#1a1a1a'  // 深灰（Google AI Studio 風格）
      }
    }
  },
  computed: {
    bgColor() {
      return this.bgColors[this.currentSeason];
    }
  },
  methods: {
    changeSeason(s) {
      this.currentSeason = s;
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    }
  }
}
</script>

<style>
/* 讓畫布撐滿全螢幕 */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: background-color 0.8s ease; /* 換季時背景平滑過渡 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app.light {
  background: #fff;
}

#app.dark {
  background: #1a1a1a;
}

.dashboard {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: auto;
  text-align: center;
}

.dashboard h1 { color: #888; font-weight: 300; margin-bottom: 20px; }

.btn-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

/* light theme (default) */
.btn-group button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s;
}

.btn-group button.active {
  background: #333;
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.btn-group button.theme-btn {
  opacity: 0.9;
}

/* dark theme */
#app.dark h1 { color: #ccc; }
#app.dark .btn-group button {
  border-color: #444;
  background: #2a2a2a;
  color: #eee;
}
#app.dark .btn-group button.active {
  background: #5a9;
  color: #111;
  border-color: #5a9;
}
#app.dark .btn-group button.theme-btn:hover {
  background: #3a3a3a;
}
#app.dark .stats { color: #999; }

.stats {
  margin-top: 15px;
  font-size: 12px;
  color: #999;
}
</style>

<!-- <template>
  <div id="app">
    <SeasonsFalling />
  </div>
</template>

<script>
import SeasonsFalling from './components/SeasonsFalling.vue';

export default {
  name: 'app',
  components: { SeasonsFalling }
}
</script> -->
