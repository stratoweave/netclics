<script lang="ts">import { page } from '$app/state';</script>
<div class="page-header"><div><h1>{page.status}</h1><p>{page.error?.message ?? 'Page not found'}</p></div></div><a class="btn btn-secondary" href="/">Back to conversion</a>
