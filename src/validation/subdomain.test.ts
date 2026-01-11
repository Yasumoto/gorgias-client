import { describe, it, expect } from 'vitest';
import { validateSubdomain } from './subdomain.js';
import { ValidationError } from '../errors/index.js';

describe('validateSubdomain', () => {
  it('accepts valid subdomains', () => {
    expect(() => validateSubdomain('mycompany')).not.toThrow();
    expect(() => validateSubdomain('my-company')).not.toThrow();
    expect(() => validateSubdomain('company123')).not.toThrow();
    expect(() => validateSubdomain('a')).not.toThrow();
    expect(() => validateSubdomain('a1')).not.toThrow();
  });

  it('rejects empty subdomain', () => {
    expect(() => validateSubdomain('')).toThrow(ValidationError);
    expect(() => validateSubdomain('   ')).toThrow(ValidationError);
  });

  it('rejects subdomain starting with hyphen', () => {
    expect(() => validateSubdomain('-company')).toThrow(ValidationError);
  });

  it('rejects subdomain ending with hyphen', () => {
    expect(() => validateSubdomain('company-')).toThrow(ValidationError);
  });

  it('rejects subdomain with invalid characters', () => {
    expect(() => validateSubdomain('my_company')).toThrow(ValidationError);
    expect(() => validateSubdomain('my.company')).toThrow(ValidationError);
    expect(() => validateSubdomain('my company')).toThrow(ValidationError);
  });

  it('provides meaningful error messages', () => {
    try {
      validateSubdomain('');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect((error as ValidationError).field).toBe('subdomain');
      expect((error as ValidationError).constraint).toBe('required');
    }
  });
});
