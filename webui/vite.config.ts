import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
export default defineConfig({
  plugins: [sveltekit()],
  build: { assetsInlineLimit: 32768 },
  server: { proxy: Object.fromEntries(['^/api(/|$)', '^/mcp(/|$)'].map(prefix =>
    [prefix, { target: process.env.STRATOWEAVE_API_ORIGIN ?? 'http://localhost:8080' }])) }
});
