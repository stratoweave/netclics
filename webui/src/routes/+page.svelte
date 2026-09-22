<script lang="ts">
  import { onMount } from 'svelte';
  import FieldSelect from '$lib/core/ui/FieldSelect.svelte';
  import StatusBanner from '$lib/core/ui/StatusBanner.svelte';
  import MonitorStatus from '$lib/MonitorStatus.svelte';
  import ResultBlock from '$lib/ResultBlock.svelte';
  import { outputFormats } from '$lib/formats';
  import { moduleSets, type InputFormat, type OutputFormat } from '$lib/api';
  import { monitor, workspace as w, selectPlatform, runConversion } from '$lib/state.svelte';
  const inputs = [{ value: 'cli', label: 'CLI' }, { value: 'netconf', label: 'NETCONF XML' }];
  const outputs = outputFormats;
  let now = $state(Date.now());
  onMount(() => { const timer = setInterval(() => now = Date.now(), 1000); return () => clearInterval(timer); });
  let platform = $derived(monitor.platforms.find(p => p.name === w.platform));
  let sets = $derived(moduleSets(platform));
  let valid = $derived(!!platform && sets.includes(w.module_set) && w.steps.every(s => !!s.text.trim()));
  function move(index: number, offset: number) {
    const steps = [...w.steps]; [steps[index], steps[index + offset]] = [steps[index + offset], steps[index]]; w.steps = steps;
  }
  function extension(format: string) { return format === 'netconf' ? 'xml' : format === 'json' ? 'json' : 'txt'; }
  let outputViews = $state<Record<number, 'diff' | 'config'>>({});
  let resultsCurrent = $derived(!!w.result && !!w.submitted &&
    w.platform === w.submitted.platform && w.module_set === w.submitted.module_set &&
    w.format === w.submitted.format && w.target_format === w.submitted.target_format &&
    w.steps.length === w.submitted.input.length &&
    w.steps.every((step, i) => step.text === w.submitted!.input[i]));
  function convertSteps() {
    outputViews = {};
    void runConversion();
  }
</script>
<div class="page-header"><div><h1>NETCLICS</h1><p><strong>NETCONF ↔ CLI Conversion System</strong></p><p>Convert CLI snippets into NETCONF XML/RESTCONF JSON payloads or Acton code for <a href="https://www.stratoweave.org" target="_blank" rel="noopener noreferrer">StratoWeave</a> transforms.</p></div></div>
<div class="stack conversion-workspace">
  <section class="card" aria-label="Conversion settings" data-tour="settings">
    <div class="card-body stack">
      <div class="conversion-settings">
        <FieldSelect label="Platform" value={w.platform} options={[{value: '', label: 'Select a platform'}, ...monitor.platforms.map(p => ({value: p.name, label: p.name}))]} disabled={w.pending} onchange={selectPlatform} />
        <FieldSelect label="Module set" value={w.module_set} options={sets.map(s => ({value: s, label: s}))} disabled={w.pending} onchange={s => w.module_set = s} />
        <FieldSelect label="Input format" value={w.format} options={inputs} disabled={w.pending} onchange={s => w.format = s as InputFormat} />
        <FieldSelect label="Output format" value={w.target_format} options={outputs} disabled={w.pending} onchange={s => w.target_format = s as OutputFormat} />
      </div>
      <div class="conversion-actions">
        <div>
          <MonitorStatus error={monitor.platformsError} at={monitor.platformsAt} empty={!monitor.platforms.length} />
        </div>
        <button class="btn btn-primary" data-tour="convert" disabled={w.pending || !valid} onclick={convertSteps}>{w.pending ? 'Converting…' : 'Convert'}</button>
      </div>
      {#if w.pending}<p role="status" class="muted">Conversion running · {Math.max(0, Math.floor((now - w.startedAt) / 1000))}s.</p>{/if}
      <StatusBanner message={w.error ? { type: 'error', text: w.error } : null} />
    </div>
  </section>

  {#each w.steps as step, index (step.id)}
    {@const result = resultsCurrent ? w.result?.steps[index] : undefined}
    {@const view = outputViews[step.id] ?? 'diff'}
    <section class="card conversion-step" aria-labelledby={`step-title-${step.id}`}>
      <div class="card-header step-header">
        <h2 id={`step-title-${step.id}`}>Step {index + 1}</h2>
        <div class="actions">
          <button class="btn btn-ghost btn-sm" aria-label={`Move step ${index + 1} up`} disabled={w.pending || index === 0} onclick={() => move(index, -1)}>Up</button>
          <button class="btn btn-ghost btn-sm" aria-label={`Move step ${index + 1} down`} disabled={w.pending || index === w.steps.length - 1} onclick={() => move(index, 1)}>Down</button>
          <button class="btn btn-ghost btn-sm" aria-label={`Remove step ${index + 1}`} disabled={w.pending || w.steps.length === 1} onclick={() => w.steps = w.steps.filter(s => s.id !== step.id)}>Remove</button>
        </div>
      </div>
      <div class="card-body step-pair">
        <div class="step-input" data-tour={index === 0 ? 'input' : undefined}>
          <div class="step-input-heading"><label for={`step-${step.id}`}>Input</label><span class="muted">{w.format === 'cli' ? 'CLI' : 'NETCONF XML'}</span></div>
          <textarea id={`step-${step.id}`} aria-label={`Step ${index + 1} input`} bind:value={step.text} disabled={w.pending} spellcheck="false" placeholder={w.format === 'cli' ? 'Paste CLI configuration…' : 'Paste NETCONF XML configuration…'} rows="12"></textarea>
        </div>
        <div data-tour={index === 0 ? 'output' : undefined} class="step-output" aria-label={`Step ${index + 1} output`}>
          {#snippet outputControls()}
            <div class="actions" role="group" aria-label={`Step ${index + 1} output view`}>
              <button class="btn btn-sm" class:btn-primary={view === 'diff'} class:btn-secondary={view !== 'diff'} aria-pressed={view === 'diff'} onclick={() => outputViews[step.id] = 'diff'}>Diff</button>
              <button class="btn btn-sm" class:btn-primary={view === 'config'} class:btn-secondary={view !== 'config'} aria-pressed={view === 'config'} onclick={() => outputViews[step.id] = 'config'}>Full configuration</button>
            </div>
          {/snippet}
          {#if result && w.submitted}
            <ResultBlock title={view === 'diff' ? 'Diff' : 'Full configuration'} content={result[view]} filename={`step-${index + 1}-${view}.${extension(w.submitted.target_format)}`} controls={outputControls} minHeight="260px" />
            {#if view === 'diff' && !result.diff.trim()}<p class="muted">No changes from this step.</p>{/if}
          {:else}
            <div class="section-heading">{@render outputControls()}</div>
            <div class="step-output-placeholder">
              <h3>{w.pending ? 'Converting this sequence…' : w.result ? 'Ready to update' : 'Your changes will appear here'}</h3>
              <p>{w.pending ? 'Results appear when all steps have completed.' : view === 'diff' ? 'Convert to see what this step changes.' : 'Convert to see the complete configuration after this step.'}</p>
            </div>
          {/if}
        </div>
      </div>
    </section>
  {/each}
  <div class="actions" data-tour="add-step"><button class="btn btn-secondary" disabled={w.pending} onclick={() => w.steps.push({id: w.nextId++, text: ''})}>Add step</button></div>

  {#if resultsCurrent && w.result && w.submitted}
    <details class="card base-configuration">
      <summary>Base configuration <span class="muted">Before step 1</span></summary>
      <div class="card-body"><ResultBlock title="Base configuration" content={w.result.base_config} filename={`base.${extension(w.submitted.target_format)}`} /></div>
    </details>
  {/if}
</div>
