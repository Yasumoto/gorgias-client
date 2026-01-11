/**
 * Main Gorgias API client.
 */

import { FetchHttpClient } from './http/FetchHttpClient.js';
import type { HttpClient, RetryConfig } from './http/index.js';
import { DEFAULT_RETRY_CONFIG } from './http/index.js';
import { validateSubdomain } from './validation/index.js';
import type { Logger } from './logging/types.js';

import { Customers } from './resources/Customers.js';
import { Tickets } from './resources/Tickets.js';
import { Messages } from './resources/Messages.js';
import { Users } from './resources/Users.js';
import { Integrations } from './resources/Integrations.js';
import { Events } from './resources/Events.js';

/**
 * Configuration for the Gorgias client.
 */
export interface GorgiasClientConfig {
  /** Your Gorgias account subdomain (e.g., "mycompany") */
  subdomain: string;
  /** Email address for authentication */
  email: string;
  /** API key from Settings > REST API in Gorgias */
  apiKey: string;
  /** Retry configuration for transient failures */
  retry?: Partial<RetryConfig>;
  /** Request timeout in milliseconds. Default: 30000 */
  timeoutMs?: number;
  /** Optional logger for debugging and observability */
  logger?: Logger;
  /** Header name for trace ID propagation. Default: 'x-trace-id' */
  traceIdHeader?: string;
  /** Override base URL (useful for testing) */
  baseUrl?: string;
}

/**
 * Gorgias API client.
 *
 * @example
 * ```typescript
 * const client = new GorgiasClient({
 *   subdomain: 'mycompany',
 *   email: 'user@example.com',
 *   apiKey: 'your-api-key',
 * });
 *
 * // List customers
 * const customers = await client.customers.list();
 *
 * // Get a specific ticket
 * const ticket = await client.tickets.get(12345);
 *
 * // Auto-paginate through all tickets
 * for await (const ticket of client.tickets.listAll()) {
 *   console.log(ticket.id);
 * }
 * ```
 */
export class GorgiasClient {
  /** Customer operations */
  public readonly customers: Customers;
  /** Ticket operations */
  public readonly tickets: Tickets;
  /** Message operations */
  public readonly messages: Messages;
  /** User operations */
  public readonly users: Users;
  /** Integration operations */
  public readonly integrations: Integrations;
  /** Event operations */
  public readonly events: Events;

  private readonly http: HttpClient;
  private readonly config: Required<
    Pick<GorgiasClientConfig, 'subdomain' | 'email' | 'timeoutMs' | 'traceIdHeader'>
  >;

  constructor(config: GorgiasClientConfig) {
    // Validate subdomain
    validateSubdomain(config.subdomain);

    // Store config with defaults
    this.config = {
      subdomain: config.subdomain,
      email: config.email,
      timeoutMs: config.timeoutMs ?? 30000,
      traceIdHeader: config.traceIdHeader ?? 'x-trace-id',
    };

    // Build auth header (HTTP Basic Auth)
    const credentials = Buffer.from(`${config.email}:${config.apiKey}`).toString('base64');
    const authHeader = `Basic ${credentials}`;

    // Build base URL
    const baseUrl = config.baseUrl ?? `https://${config.subdomain}.gorgias.com/api`;

    // Create HTTP client
    this.http = new FetchHttpClient({
      baseUrl,
      authHeader,
      defaultTimeoutMs: this.config.timeoutMs,
      retry: { ...DEFAULT_RETRY_CONFIG, ...config.retry },
      logger: config.logger,
      traceIdHeader: this.config.traceIdHeader,
    });

    // Initialize resource classes
    this.customers = new Customers(this.http);
    this.tickets = new Tickets(this.http);
    this.messages = new Messages(this.http);
    this.users = new Users(this.http);
    this.integrations = new Integrations(this.http);
    this.events = new Events(this.http);
  }

  /**
   * Get the configured subdomain.
   */
  get subdomain(): string {
    return this.config.subdomain;
  }

  /**
   * Get the configured email.
   */
  get email(): string {
    return this.config.email;
  }
}
