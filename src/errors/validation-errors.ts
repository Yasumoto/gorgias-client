/**
 * Client-side input validation errors.
 */

import { GorgiasError } from './base.js';

/**
 * Input validation failed before making API request.
 */
export class ValidationError extends GorgiasError {
  readonly code = 'VALIDATION_ERROR';
  /** Field that failed validation */
  readonly field: string;
  /** Constraint that was violated */
  readonly constraint: string;

  constructor(field: string, constraint: string, message: string) {
    super(message);
    this.field = field;
    this.constraint = constraint;
  }
}
