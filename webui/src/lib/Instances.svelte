<script lang="ts">
  import { monitor } from '$lib/state.svelte';
  import MonitorStatus from '$lib/MonitorStatus.svelte';
  import FieldSelect from '$lib/core/ui/FieldSelect.svelte';
  import StatusPill from '$lib/core/ui/StatusPill.svelte';
  let platform = $state(''); let selectedState = $state('');
  let platforms = $derived([...new Set(monitor.instances.map(i => i.platform_name))].sort());
  let states = $derived([...new Set(monitor.instances.map(i => i.state))].sort());
  let instances = $derived(monitor.instances.filter(i => (!platform || i.platform_name === platform) && (!selectedState || i.state === selectedState)));
</script>
<div class="page-header"><div><h3>Instances</h3><p>Device availability and module-set compilation status.</p></div></div>
<div class="form-grid filters"><FieldSelect label="Platform" value={platform} onchange={v => platform = v} options={[{value: '', label: 'All platforms'}, ...platforms.map(p => ({value: p, label: p}))]} />
<FieldSelect label="State" value={selectedState} onchange={v => selectedState = v} options={[{value: '', label: 'All states'}, ...states.map(s => ({value: s, label: s.toLowerCase()}))]} /></div>
<MonitorStatus error={monitor.instancesError} at={monitor.instancesAt} empty={!monitor.instances.length} />
{#if monitor.instances.length && !instances.length}<p class="empty-message">No instances match these filters.</p>{/if}
{#if instances.length}
  <div class="instance-grid">
    {#each instances as i (`${i.platform_name}/${i.instance_id}`)}
      <section class="card instance-card" aria-label={`Instance ${i.instance_id} on ${i.platform_name}`}>
        <div class="card-header">
          <div><h4>{i.instance_id}</h4><p class="muted">{i.instance_type}</p></div>
          <StatusPill label={i.state.toLowerCase()} tone={i.state === 'ready' ? 'success' : i.state === 'error' ? 'danger' : 'warning'} />
        </div>
        <div class="card-body stack">
          {#if i.description}<p class="muted">{i.description}</p>{/if}
          <dl class="facts">
            <dt>Platform</dt><dd>{i.platform_name}</dd>
            <dt>Device family</dt><dd>{i.platform}</dd>
            <dt>Connection</dt><dd class="mono">{i.ip_address}<p class="muted">NETCONF {i.netconf_port} · SSH {i.ssh_port}</p></dd>
          </dl>
          <div class="instance-modules">
            <h5>Module sets</h5>
            {#each Object.entries(i.module_sets) as [name, status]}
              <div class="module-status">
                <strong>{name}</strong>
                <StatusPill label={status.compiled ? 'compiled' : status.error && status.error !== 'Schema not compiled' ? 'error' : 'pending'} tone={status.compiled ? 'success' : status.error && status.error !== 'Schema not compiled' ? 'danger' : 'warning'} />
                {#if status.error}<p class="muted">{status.error}</p>{/if}
              </div>
            {:else}
              <span class="muted">No module sets reported</span>
            {/each}
          </div>
        </div>
      </section>
    {/each}
  </div>
{/if}
