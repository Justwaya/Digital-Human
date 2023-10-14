import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 自动导入vue中的hook reactive、ref等
import AutoImport from "unplugin-auto-import/vite"
// 自动导入组件
import Components from 'unplugin-vue-components/vite';
import { resolve } from 'path'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // headers: {
    //   'Cross-Origin-Opener-Policy': 'same-origin',
    //   'Cross-Origin-Embedder-Policy': 'require-corp',
    // },
    // proxy: {
    //     '/api': {
    //       target: '', //代理地址
    //       changeOrigin: true,
    //       // secure: true, // 是否https接口
    //       // ws: true, // 是否代理websockets
    //       rewrite: (path) => path.replace(/^\/api/, '')
    //     }
    //   }
    port: 8000,
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  plugins: [
    vue(),
    VueSetupExtend(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      // 存放位置
      dts: "src/type/auto-import.d.ts"
    }),
    Components({
      // 引入组件的,包括自定义组件
      // 存放的位置
      dts: "src/type/components.d.ts",
    }),

  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
})
