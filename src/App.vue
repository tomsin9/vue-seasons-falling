<script setup>
import { ref } from 'vue';
import SeasonsFalling from './components/SeasonsFalling.vue';

const currentSeason = ref('spring');
const seasons = ['spring', 'summer', 'autumn', 'winter'];
const theme = ref('light'); // 'light' | 'dark'

function changeSeason(s) {
  currentSeason.value = s;
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
</script>

<template>
  <div id="app" :class="theme">
    <div class="dashboard">
      <h1>vue-seasons-falling</h1>

      <div class="btn-group-container">
        <div class="btn-group">
          <button v-for="s in seasons" :key="s" 
            @click="changeSeason(s)" 
            :class="{ active: currentSeason === s }">
            {{ s.toUpperCase() }}
          </button>
          
          <button class="theme-btn" @click="toggleTheme" 
            :title="theme === 'dark' ? 'Switch to light' : 'Switch to dark'">
              {{ theme === 'dark' ? '☀️ LIGHT MODE' : '🌙 DARK MODE' }}
          </button>
        </div>
      </div>


      <div class="stats">
        <span>Particles: 150</span> | 
        <span>Wind: 0.2</span>
      </div>
    </div>

    <!-- Fullscreen Mode -->
    <!-- :key forces re-render when season changes -->
    <SeasonsFalling
      :key="'bg-' + currentSeason" 
      :season="currentSeason"
      :theme="theme"
      :amount="150"
      :wind="0.2"
      fullScreen
    />

    <!-- Zone Mode -->
    <!-- <p class="banner-label" 
     style="position: relative; z-index: 10; text-align: center; margin: 24px 0 0; font-size: 12px; color: #888;">
     ↓ Zone Mode (Fill parent layer)
    </p>
    <div class="banner-demo" 
      style="position: relative; width: 100%; max-width: 600px; height: 280px; margin: 8px auto 20px; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <SeasonsFalling
        :key="'banner-' + currentSeason"
        :season="currentSeason"
        :theme="theme"
      />
    </div> -->

  </div>
</template>

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

#app {
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