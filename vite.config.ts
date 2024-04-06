import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 研发环境配置接口代理到后端服务
  server: {
    proxy: {
      '/v1/admin': {
        target: 'http://127.0.0.1:8066',
        changeOrigin: true,
      },
    },
  },
})
