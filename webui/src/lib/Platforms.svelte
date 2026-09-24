<script lang="ts">
  import { monitor } from '$lib/state.svelte';
  import MonitorStatus from '$lib/MonitorStatus.svelte';
  import { moduleSets } from '$lib/api';
</script>
<div class="page-header"><div><h3>Platforms</h3><p>Configured device families and conversion capacity.</p></div></div>
<MonitorStatus error={monitor.platformsError} at={monitor.platformsAt} empty={!monitor.platforms.length} />
{#if monitor.platforms.length}
  <div class="card table-scroll">
    <table aria-label="Platforms">
      <thead><tr><th scope="col">Platform</th><th scope="col">Device family</th><th scope="col">Available / total</th><th scope="col">Module sets</th></tr></thead>
      <tbody>
        {#each monitor.platforms as p (p.name)}
          <tr>
            <td><strong>{p.name}</strong></td>
            <td>{p.platform}</td>
            <td>{p.available_instances} / {p.total_instances}</td>
            <td>{moduleSets(p).join(', ')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
