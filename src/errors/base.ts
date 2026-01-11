/**
 * Base error class for all Gorgias client errors.
 */

export abstract class GorgiasError extends Error {
  /** Error code for programmatic handling */
  abstract readonly code: string;
  /** Trace ID for request correlation */
  readonly traceId?: string;
  /** ISO timestamp when error occurred */
  readonly timestamp: string;

  constructor(message: string, traceId?: string) {
    super(message);
    this.name = this.constructor.name;
    this.traceId = traceId;
    this.timestamp = new Date().toISOString();
    // Maintains proper stack trace for where error was thrown (V8 engines)
    if ('captureStackTrace' in Error) {
      (Error as { captureStackTrace(target: object, constructor?: Function): void })
        .captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Context about the request that failed (no sensitive data).
 */
export interface RequestContext {
  method: string;
  path: string;
}
