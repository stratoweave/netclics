<script lang="ts">
  import type { Snippet } from 'svelte';
  import CodeBlock from '$lib/core/ui/CodeBlock.svelte';
  let { title, content, filename, controls, minHeight = '' }: { title: string; content: string; filename: string; controls?: Snippet; minHeight?: string } = $props();
  function download() {
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
</script>
<section class="result-block">
  <div class="section-heading">{#if controls}{@render controls()}{:else}<h3>{title}</h3>{/if}<button class="btn btn-ghost btn-sm" onclick={download}>Download</button></div>
  <CodeBlock {minHeight} {content} label={title} maxHeight="440px" />
</section>
