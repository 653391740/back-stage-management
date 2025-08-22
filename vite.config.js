import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  base: '/', // 使用绝对路径，避免history模式下的资源路径问题
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    open: true,
  },
  optimizeDeps: {
    include: ['element-ui', 'vue', 'vue-router'] // 添加vue和vue-router到预构建依赖
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'element-ui': ['element-ui'],
          'vue': ['vue', 'vue-router'], // 将vue相关依赖单独打包
        }
      }
    }
  }
})
