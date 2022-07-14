import { defineConfig } from 'astro/config'
import { viteStaticCopy as copy } from 'vite-plugin-static-copy'
import tailwind from '@astrojs/tailwind'
import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  vite: {
    plugins: [
      copy({
        targets: [
          {
            src: 'node_modules/@emdgroup-liquid/liquid/dist/liquid/assets/*',
            dest: 'assets',
          },
        ],
      }),
    ],
  },
})
