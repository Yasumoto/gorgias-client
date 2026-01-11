/**
 * Gorgias API Client
 *
 * A modern, well-typed TypeScript client for the Gorgias REST API.
 *
 * @example
 * ```typescript
 * import { GorgiasClient } from 'gorgias-client';
 *
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

// Main client
export { GorgiasClient } from './GorgiasClient.js';
export type { GorgiasClientConfig } from './GorgiasClient.js';

// Errors
export {
  GorgiasError,
  GorgiasAPIError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationAPIError,
  NetworkError,
  TimeoutError,
  ValidationError,
} from './errors/index.js';
export type { RequestContext, GorgiasErrorResponse } from './errors/index.js';

// HTTP types for advanced usage
export type {
  HttpClient,
  HttpRequestConfig,
  HttpResponse,
  RetryConfig,
  RequestOptions,
} from './http/index.js';
export { DEFAULT_RETRY_CONFIG } from './http/index.js';

// Pagination utilities
export { paginate, collectAll } from './pagination/index.js';
export type { PaginationConfig } from './pagination/index.js';

// Logger interface
export type { Logger } from './logging/types.js';

// Domain types
export type {
  // Customer
  Customer,
  CustomerChannel,
  CustomerCreateRequest,
  CustomerUpdateRequest,
  // Ticket
  Ticket,
  TicketStatus,
  TicketSummary,
  Tag,
  SatisfactionSurvey,
  TicketCreateRequest,
  TicketUpdateRequest,
  // Message
  TicketMessage,
  TicketMessageSource,
  MessageIntent,
  Attachment,
  MacroAction,
  MessageAction,
  SendingError,
  TicketMessageCreateRequest,
  TicketMessageUpdateRequest,
  // User
  User,
  UserCreateRequest,
  UserUpdateRequest,
  // Integration
  Integration,
  IntegrationHttp,
  IntegrationUser,
  // Event
  Event,
  // Pagination
  PaginatedResponse,
  PaginationParams,
} from './types.js';

// Resource list param types
export type { CustomerListParams } from './resources/Customers.js';
export type { TicketListParams } from './resources/Tickets.js';
export type { EventListParams } from './resources/Events.js';

// Backward compatibility (deprecated)
export { createGorgiasClient } from './compat.js';
export type { LegacyOptions } from './compat.js';
