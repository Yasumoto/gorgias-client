/**
 * Subdomain validation for Gorgias API.
 */

import { ValidationError } from '../errors/index.js';

/**
 * Valid subdomain pattern:
 * - 1-63 characters
 * - Starts and ends with alphanumeric
 * - May contain hyphens in the middle
 * - Case insensitive
 */
const SUBDOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i;

/**
 * Validate a Gorgias subdomain.
 * @param subdomain - The subdomain to validate
 * @throws ValidationError if subdomain is invalid
 */
export function validateSubdomain(subdomain: string): void {
  if (!subdomain || typeof subdomain !== 'string') {
    throw new ValidationError(
      'subdomain',
      'required',
      'Subdomain is required'
    );
  }

  const trimmed = subdomain.trim();
  if (trimmed.length === 0) {
    throw new ValidationError(
      'subdomain',
      'required',
      'Subdomain cannot be empty'
    );
  }

  if (!SUBDOMAIN_REGEX.test(trimmed)) {
    throw new ValidationError(
      'subdomain',
      'format',
      'Subdomain must be alphanumeric with optional hyphens (not at start/end), 1-63 characters'
    );
  }
}
