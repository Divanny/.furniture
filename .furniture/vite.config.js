import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver(),
      ],
      types: [{
        from: 'notivue',
        names: ['push'],
      }],
    },
    )
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),

    }
  },
})
