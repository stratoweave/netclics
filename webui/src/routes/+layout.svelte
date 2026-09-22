<script lang="ts">
  import '$lib/fonts.css';
  import '../app.css';
  import '../netclics.css';
  import { onMount, type Snippet } from 'svelte';
  import Tour from '$lib/tour/Tour.svelte';
  import { isTourDone, startTour } from '$lib/tour/state.svelte';
  import logoUrl from '$lib/assets/stratoweave-logo.svg';
  import NavIcon from '$lib/core/ui/NavIcon.svelte';
  import StatusPill from '$lib/core/ui/StatusPill.svelte';
  import { monitor, refresh } from '$lib/state.svelte';
  import { startPolling } from '$lib/core/util/poll';
  import Platforms from '$lib/Platforms.svelte';
  import Instances from '$lib/Instances.svelte';
  let { children }: { children: Snippet } = $props();
  let statusDialog = $state<HTMLDialogElement>();
  let statusTitle = $state<HTMLHeadingElement>();
  function openStatus() {
    statusDialog?.showModal();
    statusTitle?.focus();
  }
  let statusView = $state<'platforms' | 'instances'>('platforms');
  let failed = $derived(!!(monitor.platformsError || monitor.instancesError));
  onMount(() => {
    if (!isTourDone()) startTour();
    return startPolling(refresh, 5000);
  });
</script>
<svelte:head><title>NETCLICS · StratoWeave</title></svelte:head>
<div class="app-shell">
  <div class="app-main-wrap">
    <header class="app-header">
      <a class="header-logo" href="/" aria-label="StratoWeave — NETCLICS home">
        <img src={logoUrl} alt="StratoWeave" width="1732" height="397" />
      </a>
      <span class="header-product">NETCLICS</span>
      <div class="header-actions" data-tour="header-actions">
        <span class="connection-status"><StatusPill tone={failed ? 'warning' : monitor.platformsAt && monitor.instancesAt ? 'success' : 'neutral'} label={failed ? 'connection issue' : monitor.platformsAt && monitor.instancesAt ? 'connected' : 'connecting'} /></span>
        <a class="btn btn-ghost btn-sm" href="https://www.stratoweave.org" target="_blank" rel="noopener noreferrer">StratoWeave ↗</a>
        <button class="btn btn-secondary btn-sm" aria-haspopup="dialog" onclick={startTour}>Guided tour</button>
        <button class="btn btn-secondary btn-sm" aria-haspopup="dialog" onclick={openStatus}>
          <NavIcon name="devices" />System status
        </button>
      </div>
    </header>
    <main class="app-content">{@render children()}</main>
  </div>
</div>

<dialog bind:this={statusDialog} class="status-dialog" aria-labelledby="status-title">
  <div class="status-header">
    <h2 id="status-title" bind:this={statusTitle} tabindex="-1">System status</h2>
    <div class="actions">
      <button class="btn btn-secondary btn-sm" onclick={() => statusDialog?.close()}>Close</button>
    </div>
  </div>
  <div class="status-switcher" role="group" aria-label="Status view">
    <button class="btn btn-sm" class:btn-primary={statusView === 'platforms'} class:btn-secondary={statusView !== 'platforms'} aria-pressed={statusView === 'platforms'} onclick={() => statusView = 'platforms'}>Platforms</button>
    <button class="btn btn-sm" class:btn-primary={statusView === 'instances'} class:btn-secondary={statusView !== 'instances'} aria-pressed={statusView === 'instances'} onclick={() => statusView = 'instances'}>Instances</button>
  </div>
  <div class="status-content">
    {#if statusView === 'platforms'}
      <Platforms />
    {:else}
      <Instances />
    {/if}
  </div>
</dialog>

<Tour />
