export type InputFormat = 'cli' | 'netconf';
export type OutputFormat = InputFormat | 'json' | 'acton-gdata' | 'acton-adata';
export interface Platform {
  name: string; platform: string; module_sets: string[];
  scaling_type: 'static' | 'dynamic'; total_instances: number; available_instances: number;
  min_instances?: number; max_instances?: number; starting_instances?: number;
}
export interface Instance {
  platform_name: string; platform: string; instance_id: string; ip_address: string;
  state: string; netconf_port: number; ssh_port: number; instance_type: string; description?: string;
  module_sets: Record<string, { compiled: boolean; error: string | null }>;
}
export interface ConvertRequest {
  input: string[]; format: InputFormat; target_format: OutputFormat; platform: string; module_set: string;
}
export interface ConvertResult {
  success: true; base_config: string; platform: string; platform_version: string;
  steps: { input: string; config: string; diff: string }[];
}
export async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/v1/${path}`, {
    headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { method: 'POST', body: JSON.stringify(body) } : { signal: AbortSignal.timeout(15000) })
  });
  let data;
  try { data = await response.json(); }
  catch { throw new Error(`Server returned an invalid response (HTTP ${response.status}).`); }
  if (!response.ok || data.success === false) throw new Error(data.error ?? `HTTP ${response.status}`);
  return data as T;
}
export const getPlatforms = () => request<{ platforms: Platform[] }>('platforms');
export const getInstances = () => request<{ instances: Instance[] }>('instances');
export const convert = (body: ConvertRequest) => request<ConvertResult>('convert', body);
export function moduleSets(platform?: Platform): string[] {
  return [...new Set(['all', ...(platform?.module_sets ?? [])])];
}
