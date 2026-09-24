import type { OutputFormat } from '$lib/api';

export const outputFormats: { value: OutputFormat; label: string }[] = [
  { value: 'cli', label: 'CLI' },
  { value: 'netconf', label: 'NETCONF XML' },
  { value: 'json', label: 'JSON' },
  { value: 'acton-gdata', label: 'Acton gdata' },
  { value: 'acton-adata', label: 'Acton adata' }
];
