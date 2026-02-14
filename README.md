# vue-seasons-falling 🌸 🌧️ 🍂 ❄️

[![npm version](https://img.shields.io/npm/v/vue-seasons-falling.svg)](https://www.npmjs.com/package/vue-seasons-falling)
[![license](https://img.shields.io/npm/l/vue-seasons-falling.svg)](https://www.npmjs.com/package/vue-seasons-falling)

A high-performance Vue 3 particle component with four seasonal effects: **Spring** (Sakura petals), **Summer** (rain), **Autumn** (maple leaves), and **Winter** (snow). Built with the native Canvas API for silky-smooth performance.

[**🔗 Explore Live Demo & Playground**](https://tomsin9.github.io/vue-seasons-falling/)

---

## Changelog

## What's New in v0.2.x

- **Auto-Season Mode** — Automatically switches between seasons based on the current month.
- **Interactive Force Field** — Particles react to mouse and touch, drifting away as you interact.
- **Mobile Optimized** — Fixed canvas distortion and added smart density scaling for consistent performance from mobile to 4K.
- **Layout Flexibility** — Seamlessly switch between `fullScreen` background or nested container mode.

[Full CHANGELOG.md](./CHANGELOG.md)

---

## Installation

```bash
npm install vue-seasons-falling
```

---

## Usage

```vue
<script setup>
import SeasonsFalling from 'vue-seasons-falling';
</script>

<template>
  <SeasonsFalling
    season="spring"
    fullScreen
    :amount="200"
  />
</template>
```

---

## Props

| Prop             | Type    | Default    | Description |
| ---------------- | ------- | ---------- | ----------- |
| `autoSeason`     | Boolean | `false`    | Automatically pick season based on the current month. |
| `season`         | String  | `'spring'` | Manual mode: `'spring'`, `'summer'`, `'autumn'`, or `'winter'`. |
| `theme`          | String  | `'light'`  | `'light'` or `'dark'` (affects colours and opacity). |
| `amount`         | Number  | `100`      | Base particle count (auto-scaled by screen size, 80–600). |
| `size`           | Number  | `5`        | Base size of particles. |
| `speed`          | Number  | `1.5`      | Vertical fall speed. |
| `wind`           | Number  | `0`        | Horizontal wind (positive = right). |
| `color`          | String  | `'#fff'`   | Override colour (HEX or RGB). |
| `opacity`        | Number  | `0.8`      | Maximum opacity of particles. |
| `swing`          | Number  | `1`        | Horizontal swing (0 = no swing). |
| `image`          | String  | `null`     | Image URL to use instead of drawn shapes. |
| `zIndex`         | Number  | `null`     | Canvas layer z-index. |
| `resize`         | Boolean | `true`     | Auto-resize canvas on window resize. |
| `fullScreen`     | Boolean | `false`    | `true` = fixed (viewport); `false` = absolute (fill parent). |
| `mouseInteraction` | Boolean | `false`    | Enable mouse/touch "force field" effect. |

---

## Credits

- **Original component**: [Fuxy526/vue-snowf](https://github.com/Fuxy526/vue-snowf)
- **Modernized & enhanced**: [Tom Sin](https://github.com/tomsin9)

---

## License

[MIT](LICENSE) © Tom Sin
