import { describe, it, expect } from 'vitest';
import { validateId, validateNonEmptyString, validateNonEmptyArray } from './id.js';
import { ValidationError } from '../errors/index.js';

describe('validateId', () => {
  it('accepts positive integers', () => {
    expect(() => validateId(1, 'customerId')).not.toThrow();
    expect(() => validateId(100, 'customerId')).not.toThrow();
    expect(() => validateId(999999, 'customerId')).not.toThrow();
  });

  it('rejects zero', () => {
    expect(() => validateId(0, 'customerId')).toThrow(ValidationError);
  });

  it('rejects negative numbers', () => {
    expect(() => validateId(-1, 'customerId')).toThrow(ValidationError);
    expect(() => validateId(-100, 'customerId')).toThrow(ValidationError);
  });

  it('rejects non-integers', () => {
    expect(() => validateId(1.5, 'customerId')).toThrow(ValidationError);
    expect(() => validateId(NaN, 'customerId')).toThrow(ValidationError);
    expect(() => validateId(Infinity, 'customerId')).toThrow(ValidationError);
  });

  it('rejects non-numbers', () => {
    expect(() => validateId('1' as unknown as number, 'customerId')).toThrow(ValidationError);
    expect(() => validateId(null as unknown as number, 'customerId')).toThrow(ValidationError);
    expect(() => validateId(undefined as unknown as number, 'customerId')).toThrow(ValidationError);
  });

  it('includes field name in error', () => {
    try {
      validateId(-1, 'ticketId');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).field).toBe('ticketId');
    }
  });
});

describe('validateNonEmptyString', () => {
  it('accepts non-empty strings', () => {
    expect(() => validateNonEmptyString('hello', 'name')).not.toThrow();
    expect(() => validateNonEmptyString('a', 'name')).not.toThrow();
  });

  it('rejects empty strings', () => {
    expect(() => validateNonEmptyString('', 'name')).toThrow(ValidationError);
    expect(() => validateNonEmptyString('   ', 'name')).toThrow(ValidationError);
  });

  it('rejects non-strings', () => {
    expect(() => validateNonEmptyString(123 as unknown as string, 'name')).toThrow(ValidationError);
    expect(() => validateNonEmptyString(null as unknown as string, 'name')).toThrow(ValidationError);
  });
});

describe('validateNonEmptyArray', () => {
  it('accepts non-empty arrays', () => {
    expect(() => validateNonEmptyArray([1], 'ids')).not.toThrow();
    expect(() => validateNonEmptyArray(['a', 'b'], 'tags')).not.toThrow();
  });

  it('rejects empty arrays', () => {
    expect(() => validateNonEmptyArray([], 'ids')).toThrow(ValidationError);
  });
});
