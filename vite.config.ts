import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@components', replacement: resolve(__dirname, './src/components/') },
      { find: '@graphql', replacement: resolve(__dirname, './src/graphql/') },
      { find: '@views', replacement: resolve(__dirname, './src/views/') }
    ]
  }
})
