/**
 * Backward-compatibility adapter for v1.x API.
 * @deprecated Use new GorgiasClient({ subdomain, email, apiKey }) instead.
 */

import { GorgiasClient } from './GorgiasClient.js';
import type { GorgiasClientConfig } from './GorgiasClient.js';

/**
 * Legacy options interface for backward compatibility.
 * @deprecated Use GorgiasClientConfig instead.
 */
export interface LegacyOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Create a GorgiasClient using the v1.x API signature.
 *
 * @deprecated Use `new GorgiasClient({ subdomain, email, apiKey })` instead.
 *
 * @param subdomain - Your Gorgias account subdomain
 * @param email - Email address for authentication
 * @param apiKey - API key from Gorgias
 * @param options - Legacy options (timeout, headers)
 * @returns GorgiasClient instance
 *
 * @example
 * ```typescript
 * // Deprecated v1.x style:
 * import { createGorgiasClient } from 'gorgias-client/compat';
 * const client = createGorgiasClient('mycompany', 'user@example.com', 'api-key');
 *
 * // Preferred v2.x style:
 * import { GorgiasClient } from 'gorgias-client';
 * const client = new GorgiasClient({
 *   subdomain: 'mycompany',
 *   email: 'user@example.com',
 *   apiKey: 'api-key',
 * });
 * ```
 */
export function createGorgiasClient(
  subdomain: string,
  email: string,
  apiKey: string,
  options?: LegacyOptions
): GorgiasClient {
  // Emit deprecation warning at runtime
  try {
    // eslint-disable-next-line no-console
    console.warn(
      '[gorgias-client] createGorgiasClient is deprecated. ' +
      'Use new GorgiasClient({ subdomain, email, apiKey }) instead.'
    );
  } catch {
    // Ignore if console is not available
  }

  const config: GorgiasClientConfig = {
    subdomain,
    email,
    apiKey,
  };

  if (options?.timeout) {
    config.timeoutMs = options.timeout;
  }

  return new GorgiasClient(config);
}
