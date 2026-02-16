<script setup>
import { ref, reactive, computed } from 'vue';
import SeasonsFalling from './components/SeasonsFalling.vue';
import { version } from '../package.json';

const seasons = ['spring', 'summer', 'autumn', 'winter'];
const config = reactive({
  season: 'spring',
  theme: 'light',
  isMouseActive: true,
  wind: 0,
  isFull: true
});

const windSteps = [-2.0, -0.5, 0, 0.5, 2.0];
const nextWind = () => {
  const currentIndex = windSteps.indexOf(config.wind);
  config.wind = windSteps[(currentIndex + 1) % windSteps.length];
};

const componentKey = computed(() => 
  Object.values(config).join('-')
);

const toggleValue = (key) => {
  if (typeof config[key] === 'boolean') {
    config[key] = !config[key];
  }
};

const setTheme = () => {
  config.theme = config.theme === 'light' ? 'dark' : 'light';
};
</script>

<template>
  <div id="app" :class="[config.theme, { 'is-boxed': !config.isFull }]">
    <div class="dashboard">
      <header>
        <h1>vue-seasons-falling</h1>
      </header>

      <div class="controls-wrapper">
        <nav class="btn-group">
          <button 
            v-for="s in seasons" :key="s" 
            @click="config.season = s" 
            :class="{ active: config.season === s }"
          >
            {{ s.toUpperCase() }}
          </button>
        </nav>

        <div class="btn-group extra-controls">
          <button @click="toggleValue('isMouseActive')" :class="{ active: config.isMouseActive }">
            MOUSE INTERACTION: {{ config.isMouseActive ? 'ON' : 'OFF' }}
          </button>
          
          <button @click="nextWind" :class="{ active: config.wind !== 0 }">
            WIND: {{ config.wind > 0 ? '+' : '' }}{{ config.wind }}
          </button>

          <!-- <button @click="toggleValue('isFull')" :class="{ active: config.isFull }">
            FULLSCREEN: {{ config.isFull ? 'ON' : 'OFF' }}
          </button> -->

          <button class="theme-btn" @click="setTheme">
            {{ config.theme === 'dark' ? '☀️ LIGHT' : '🌙 DARK' }}
          </button>
        </div>
      </div>

      <footer class="stats">
        <span>Particles: 200</span>
        <span class="divider">|</span>
        <span>v{{ version }}</span>
      </footer>
    </div>

    <SeasonsFalling
      :key="componentKey" 
      :season="config.season"
      :theme="config.theme"
      :amount="200"
      :wind="config.wind"
      :mouseInteraction="config.isMouseActive"
    />
  </div>
</template>

<style>
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<style scoped>

#app {
  --bg: hsl(0 0% 100%);
  --text: hsl(0 0% 20%);
  --btn-bg: rgba(255, 255, 255, 0.8);
  --btn-border: rgba(0, 0, 0, 0.1);
  --accent: rgba(0, 0, 0, 0.05); 
  --accent-text: hsl(0 0% 13%);
  
  position: relative;
  width: 100vw;
  height: 100vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Inter', system-ui, sans-serif;
}

#app.dark {
  --bg: hsl(240 10% 8%);
  --text: hsl(0 0% 90%);
  --btn-bg: rgba(40, 40, 40, 0.7);
  --btn-border: rgba(255, 255, 255, 0.1);
  --accent: rgba(255, 255, 255, 0.1);
  --accent-text: #fff;
}

/* Boxed 模式的樣式切換 */
#app.is-boxed {
  width: calc(100vw - 80px);
  height: calc(100vh - 80px);
  margin: 40px auto;
  border: 1px solid var(--btn-border);
  border-radius: 24px;
  overflow: hidden;
}

.dashboard {
  position: relative;
  z-index: 10;
  text-align: center;
  width: 90%;
  max-width: 600px;
  /* Let touch pass through to canvas for mouseInteraction on mobile; only interactive elements capture */
  pointer-events: none;
}

.dashboard h1,
.dashboard .btn-group button,
.dashboard .stats,
.dashboard a {
  pointer-events: auto;
}

.dashboard h1 {
  color: var(--text);
  font-weight: 200;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
  text-transform: lowercase;
}

.btn-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1rem;
}

.btn-group button {
  padding: 12px 24px;
  border: 1px solid var(--btn-border);
  background: var(--btn-bg);
  color: var(--text);
  cursor: pointer;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}

.btn-group button:hover {
  border-color: var(--text);
  transform: translateY(-2px);
}

.btn-group button.active {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
}

.extra-controls button {
  min-width: 140px;
  font-family: monospace;
}

.stats {
  margin-top: 3rem;
  font-size: 10px;
  color: var(--text);
  opacity: 0.4;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.divider { margin: 0 10px; }

@media (max-width: 600px) {
  #app.is-boxed { margin: 20px; width: calc(100vw - 40px); height: calc(100vh - 40px); }
  .btn-group button { padding: 8px 16px; font-size: 11px; }
}
</style>