import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig(({ command }) => {
  const isDemo = process.env.BUILD_TARGET === 'demo';

  // basic configuration
  const config = {
    plugins: [vue()],
    server: {
      port: 3000,
      open: true
    },
    // if deploying to github.io, base must be the repo name
    base: isDemo ? '/vue-seasons-falling/' : '/', 
  };

  if (isDemo) {
    // ---------------------------------
    // mode A: build Demo website (for GitHub Pages)
    // ---------------------------------
    config.build = {
      outDir: 'dist-demo', // the output folder name, corresponding to GitHub Actions
    };
  } else {
    // ---------------------------------
    // mode B: build Library (for publishing to NPM)
    // ---------------------------------
    config.build = {
      lib: {
        entry: resolve(__dirname, 'src/components/SeasonsFalling.vue'),
        name: 'VueSeasonsFalling',
        fileName: (format) => `vue-seasons-falling.${format}.js`
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'vue-seasons-falling.css';
            return assetInfo.name;
          }
        }
      }
    };
  }

  return config;
});