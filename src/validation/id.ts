/**
 * ID validation utilities.
 */

import { ValidationError } from '../errors/index.js';

/**
 * Validate that a value is a positive integer.
 * @param id - The value to validate
 * @param fieldName - Name of the field for error messages
 * @throws ValidationError if id is not a positive integer
 */
export function validateId(id: unknown, fieldName: string): asserts id is number {
  if (typeof id !== 'number') {
    throw new ValidationError(
      fieldName,
      'type',
      `${fieldName} must be a number, got ${typeof id}`
    );
  }

  if (!Number.isInteger(id)) {
    throw new ValidationError(
      fieldName,
      'integer',
      `${fieldName} must be an integer, got ${id}`
    );
  }

  if (id <= 0) {
    throw new ValidationError(
      fieldName,
      'positive',
      `${fieldName} must be a positive integer, got ${id}`
    );
  }
}

/**
 * Validate that a value is a non-empty string.
 * @param value - The value to validate
 * @param fieldName - Name of the field for error messages
 * @throws ValidationError if value is not a non-empty string
 */
export function validateNonEmptyString(
  value: unknown,
  fieldName: string
): asserts value is string {
  if (typeof value !== 'string') {
    throw new ValidationError(
      fieldName,
      'type',
      `${fieldName} must be a string, got ${typeof value}`
    );
  }

  if (value.trim().length === 0) {
    throw new ValidationError(
      fieldName,
      'nonEmpty',
      `${fieldName} cannot be empty`
    );
  }
}

/**
 * Validate that an array is non-empty.
 * @param arr - The array to validate
 * @param fieldName - Name of the field for error messages
 * @throws ValidationError if array is empty
 */
export function validateNonEmptyArray<T>(
  arr: T[],
  fieldName: string
): asserts arr is [T, ...T[]] {
  if (!Array.isArray(arr)) {
    throw new ValidationError(
      fieldName,
      'type',
      `${fieldName} must be an array`
    );
  }

  if (arr.length === 0) {
    throw new ValidationError(
      fieldName,
      'nonEmpty',
      `${fieldName} cannot be empty`
    );
  }
}
