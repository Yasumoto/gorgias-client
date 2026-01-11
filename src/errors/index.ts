/**
 * Error exports for the Gorgias client.
 */

export { GorgiasError } from './base.js';
export type { RequestContext } from './base.js';
export {
  GorgiasAPIError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationAPIError,
  NetworkError,
  TimeoutError,
} from './api-errors.js';
export type { GorgiasErrorResponse } from './api-errors.js';
export { ValidationError } from './validation-errors.js';
