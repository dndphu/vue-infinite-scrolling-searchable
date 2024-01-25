// import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'

const resolvePath = (dir: string) => {
  return path.resolve(__dirname, 'src', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: [
        // presets
        'vue',
        {
          'vue-router': ['createRouter', 'createWebHistory', 'useRoute', 'useRouter']
        }
      ],
      dts: './config/auto-imports.d.ts'
    })
  ],
  resolve: {
    alias: {
      components: resolvePath('components'),
      layouts: resolvePath('layouts'),
      modules: resolvePath('modules'),
      api: resolvePath('./api'),
      '@': path.resolve(__dirname, './src')
    }
  }
})
