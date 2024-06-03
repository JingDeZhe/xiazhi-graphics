import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { globSync } from 'glob'

const pages = globSync('./*.html').map((v) => v.replace(/^(.*)\.html/, '$1'))
export default defineConfig({
  server: {
    port: 5183,
  },
  build: {
    rollupOptions: {
      input: pages.reduce((pv, cv) => {
        pv[cv] = fileURLToPath(new URL(`${cv}.html`, import.meta.url))
        return pv
      }, {}),
    },
  },
})
