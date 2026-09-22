import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Deterministic, content-derived app version: identical sources produce an
// identical version (byte-reproducible builds for the embedded-assets
// pipeline), while any UI change produces a new one, so SvelteKit's
// version.json polling makes stale open tabs reload after an upgrade
// instead of failing on hashed chunks the new binary no longer serves.
const VERSION_INPUTS = ['src', 'static', 'package.json', 'bun.lock', 'svelte.config.js', 'vite.config.ts', 'tsconfig.json'];

function contentVersion() {
  const hash = createHash('sha256');
  const walk = (rel) => {
    const abs = fileURLToPath(new URL('./' + rel, import.meta.url));
    if (!existsSync(abs)) return;
    if (statSync(abs).isDirectory()) {
      for (const name of readdirSync(abs).sort()) walk(rel + '/' + name);
      return;
    }
    hash.update(rel + '\0');
    hash.update(readFileSync(abs));
    hash.update('\0');
  };
  for (const input of VERSION_INPUTS) walk(input);
  return hash.digest('hex').slice(0, 12);
}

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapterStatic({ fallback: 'index.html' }),
    version: { name: contentVersion() }
  }
};
