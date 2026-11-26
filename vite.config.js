import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: './Python-programming-logic-game/',
  build: {
    chunkSizeWarningLimit: 1500
  }
});
