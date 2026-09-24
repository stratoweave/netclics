# NETCLICS Web UI

Svelte 5 / SvelteKit / TypeScript, built with Bun and Vite as a static SPA.
The UI ships inside the NETCLICS Acton binary on the existing HTTP/HTTPS
listeners. It uses the same StratoWeave styles, components, fonts, original
logo, and deterministic embedding pipeline as SORESPO.

## Development

```sh
cd webui
bun install --frozen-lockfile
cd ..
just dev-webui
```

Vite listens on localhost:5173 and proxies `/api` and `/mcp` to
`STRATOWEAVE_API_ORIGIN` (default `http://localhost:8080`). Run NETCLICS
separately with the desired configuration. No separate production UI server
or container is needed.

```sh
just gen-webui
acton build
acton test
cd webui && bun test
```

Commit `src/webui_assets.act` whenever UI sources change. CI checks frontend
types, client tests, and generated-asset freshness. Fonts and the unchanged
StratoWeave SVG logo are inlined because embedded responses contain text only.

## Workflows

- `/`: CLI or NETCONF XML input; CLI, XML, JSON, Acton gdata/adata output.
  Steps execute in order, with each input beside its output. Diff is the default
  output; switch to full configuration when needed. The base configuration is
  collapsed below the steps. Outputs include copy and download controls.
  Editing inputs or settings hides outdated results until you convert again.
- A guided tour starts on the first visit. Skip, Escape, or Finish remembers
  dismissal in browser local storage; **Guided tour** in the top-right header
  restarts it. If browser storage is unavailable, dismissal lasts for the
  current page only. The header also links to www.stratoweave.org.
- **System status** in the top-right header opens read-only platform capacity,
  module-set information, instance state, and schema compilation details.
  Convert is the only main page; old `/platforms` and `/instances` links return
  to it.

Monitoring refreshes every five seconds while visible. Failed refreshes retain
last-known data and label it stale. Conversion inputs/results live in browser
memory across navigation, and are cleared by a full reload. Conversion requests
are never retried automatically; closing the tab does not cancel backend work.

Explicit static mounts retain precedence. A static mount at `/` owns the root
and disables the embedded UI; other mounts can shadow UI routes at that prefix.
