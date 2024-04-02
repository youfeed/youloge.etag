import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.js',
      name: 'youloge.etag',
      fileName: (format) => `youloge.etag.${format}.js`,
    }
  }
})
