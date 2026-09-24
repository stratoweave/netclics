import { convert, getInstances, getPlatforms, type Platform, type Instance, type ConvertRequest, type ConvertResult } from './api';
export const monitor = $state({
  platforms: [] as Platform[], instances: [] as Instance[],
  platformsAt: 0, instancesAt: 0, platformsError: '', instancesError: '', refreshing: false
});
export async function refresh() {
  if (monitor.refreshing) return;
  monitor.refreshing = true;
  await Promise.all([
    getPlatforms().then(data => { monitor.platforms = data.platforms; monitor.platformsAt = Date.now(); monitor.platformsError = ''; })
      .catch(error => { monitor.platformsError = String(error.message ?? error); }),
    getInstances().then(data => { monitor.instances = data.instances; monitor.instancesAt = Date.now(); monitor.instancesError = ''; })
      .catch(error => { monitor.instancesError = String(error.message ?? error); })
  ]);
  monitor.refreshing = false;
}
export const workspace = $state({
  platform: '', module_set: 'all', format: 'cli' as ConvertRequest['format'],
  target_format: 'netconf' as ConvertRequest['target_format'],
  steps: [{ id: 1, text: '' }], nextId: 2, pending: false, startedAt: 0,
  error: '', result: null as ConvertResult | null, submitted: null as ConvertRequest | null
});
export function selectPlatform(name: string) {
  if (workspace.pending) return;
  workspace.platform = name; workspace.module_set = 'all';
}
export async function runConversion() {
  if (workspace.pending) return;
  if (!monitor.platforms.some(p => p.name === workspace.platform) || workspace.steps.some(s => !s.text.trim())) {
    workspace.error = 'Select a configured platform and enter configuration for every step.'; return;
  }
  const input: ConvertRequest = { platform: workspace.platform, module_set: workspace.module_set,
    format: workspace.format, target_format: workspace.target_format, input: workspace.steps.map(s => s.text) };
  workspace.pending = true; workspace.startedAt = Date.now(); workspace.error = ''; workspace.result = null;
  workspace.submitted = input;
  try { workspace.result = await convert(input); }
  catch (error) { workspace.error = error instanceof Error ? error.message : String(error); }
  finally { workspace.pending = false; void refresh(); }
}
