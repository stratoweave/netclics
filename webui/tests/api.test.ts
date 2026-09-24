import { afterEach, expect, test } from 'bun:test';
import { convert, getPlatforms, moduleSets } from '../src/lib/api';
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
test('module sets use configured names, with all available exactly once', () => {
  expect(moduleSets({ name: 'test', platform: 'junos', module_sets: ['all', 'native'], scaling_type: 'dynamic', total_instances: 0, available_instances: 0 })).toEqual(['all', 'native']);
  expect(moduleSets()).toEqual(['all']);
});
test('multi-step conversion preserves order and API field names, without a short timeout', async () => {
  const body = { input: ['first\n', 'second'], platform: 'router', module_set: 'all', format: 'cli' as const, target_format: 'json' as const };
  globalThis.fetch = (async (url, options) => {
    expect(url).toBe('/api/v1/convert');
    expect(options?.method).toBe('POST');
    expect(JSON.parse(options?.body as string)).toEqual(body);
    expect(options?.signal).toBeUndefined();
    return Response.json({ success: true, base_config: '{}', steps: [] });
  }) as typeof fetch;
  expect((await convert(body)).success).toBe(true);
});
test('HTTP 200 conversion failures are surfaced without retry', async () => {
  let calls = 0;
  globalThis.fetch = (async () => { calls++; return Response.json({success: false, error: 'No ready device'}); }) as typeof fetch;
  await expect(convert({ input: ['x'], platform: 'p', module_set: 'all', format: 'cli', target_format: 'netconf' })).rejects.toThrow('No ready device');
  expect(calls).toBe(1);
});
test('HTTP errors and non-JSON responses are surfaced', async () => {
  globalThis.fetch = (async () => Response.json({error: 'Unavailable'}, {status: 503})) as typeof fetch;
  await expect(getPlatforms()).rejects.toThrow('Unavailable');
  globalThis.fetch = (async () => new Response('<html>', {status: 502})) as typeof fetch;
  await expect(getPlatforms()).rejects.toThrow('invalid response (HTTP 502)');
});
