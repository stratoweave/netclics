<script lang="ts">
  import StatusBanner from '$lib/core/ui/StatusBanner.svelte';
  let { error, at, empty = false }: { error: string; at: number; empty?: boolean } = $props();
</script>
{#if error}
  <StatusBanner message={{ type: at ? 'warning' : 'error', text: `${at ? 'Showing stale data. ' : 'Unable to load data. '}${error}` }} />
{:else if !at}<p class="muted" role="status">Loading…</p>
{:else if empty}<p class="empty-message">No entries configured.</p>{/if}
