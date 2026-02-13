# vue-seasons-falling 🌸 🌧️ 🍂 ❄️

[![npm version](https://img.shields.io/npm/v/vue-seasons-falling.svg)](https://www.npmjs.com/package/vue-seasons-falling)
[![license](https://img.shields.io/npm/l/vue-seasons-falling.svg)](https://www.npmjs.com/package/vue-seasons-falling)

A high-performance Vue 3 particle system featuring four seasonal effects with 3D-style physics: **Spring** (Sakura petals), **Summer** (rain), **Autumn** (maple leaves), and **Winter** (snow). Each season uses canvas-based rendering with distinct motion and appearance.

Vue 3 only. Works with any build tool (Vite, Webpack, etc.) — Vite is not required.

---

## Installation

```bash
npm install vue-seasons-falling
```

---

## Usage

### Local registration (`<script setup>`)

```vue
<script setup>
import SeasonsFalling from 'vue-seasons-falling';
</script>

<template>
  <div class="container">
    <SeasonsFalling
      season="winter"
      theme="light"
      :amount="150"
      :size="4"
      :speed="1.5"
      :wind="0.3"
      :opacity="0.8"
      :swing="1"
    />
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
```

### Global registration (`main.js`)

```js
import { createApp } from 'vue';
import App from './App.vue';
import SeasonsFalling from 'vue-seasons-falling';

const app = createApp(App);
app.component('SeasonsFalling', SeasonsFalling);
app.mount('#app');
```

Then use in any template:

```html
<SeasonsFalling season="spring" theme="light" :amount="100" />
```

---

## Props

| Prop     | Type    | Default   | Description |
| -------- | ------- | --------- | ----------- |
| `season` | String  | `'winter'` | Which effect to show: `'spring'`, `'summer'`, `'autumn'`, or `'winter'`. |
| `theme`  | String  | `'light'`  | Visual theme: `'light'` or `'dark'` (affects colours and opacity). |
| `amount` | Number  | `50`       | Number of particles. |
| `size`   | Number  | `5`        | Base size of particles. |
| `speed`  | Number  | `1.5`      | Vertical fall speed. |
| `wind`   | Number  | `0`        | Horizontal wind (positive = right). |
| `color`  | String  | `'#fff'`   | Override colour (HEX or RGB). |
| `opacity`| Number  | `0.8`      | Maximum opacity of particles. |
| `swing`  | Number  | `1`        | Horizontal swing amount (0 = no swing). |
| `image`  | String  | `null`     | Image URL to use instead of drawn shapes. |
| `zIndex` | Number  | `null`     | Canvas layer z-index. |
| `resize` | Boolean | `true`     | Auto-resize canvas on window resize. |

---

## Seasonal highlights

- **Spring (Sakura)** — Petals follow a smooth, spiral-like path with sine-based horizontal oscillation. Each petal has rotation and flip for a natural drifting feel.
- **Summer (Rain)** — Streaks are drawn as diagonal lines for a motion-blur effect; fast vertical speed and optional wind create a heavy rain look.
- **Autumn (Maple)** — Maple-leaf shapes with rotation and flip; some particles use zero opacity for a sparse, scattered look and varied sizes.
- **Winter (Snow)** — Circular flakes with soft shadow, gentle swing, and rotation for a classic snowfall effect.

---

## Credits

- **Original work**: [Fuxy526](https://github.com/Fuxy526) (2017)
- **Modification & maintenance**: Tom Sin (2026)

---

## License

MIT License.

Copyright (c) 2017 Fuxy526  
Copyright (c) 2026 Tom Sin
