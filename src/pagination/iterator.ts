/**
 * Pagination utilities for auto-iterating through paginated results.
 */

import type { PaginatedResponse } from '../types.js';
import { NetworkError } from '../errors/index.js';

export interface PaginationConfig {
  /** Page size for each request. Default: 100 */
  pageSize?: number;
  /** AbortSignal for cancellation */
  signal?: AbortSignal;
}

/**
 * Async generator that automatically paginates through results.
 * @param fetchPage - Function to fetch a page of results
 * @param config - Pagination configuration
 * @yields Individual items from each page
 */
export async function* paginate<T>(
  fetchPage: (cursor?: string, limit?: number) => Promise<PaginatedResponse<T>>,
  config: PaginationConfig = {}
): AsyncGenerator<T, void, undefined> {
  const pageSize = config.pageSize ?? 100;
  let cursor: string | undefined;

  do {
    // Check for cancellation
    if (config.signal?.aborted) {
      throw new NetworkError('Pagination cancelled');
    }

    const response = await fetchPage(cursor, pageSize);

    for (const item of response.data) {
      yield item;
    }

    cursor = response.meta.next_cursor;
  } while (cursor);
}

/**
 * Collect all items from a paginated endpoint into an array.
 * Use with caution for large datasets - consider using the async iterator instead.
 * @param fetchPage - Function to fetch a page of results
 * @param config - Pagination configuration
 * @returns Array of all items
 */
export async function collectAll<T>(
  fetchPage: (cursor?: string, limit?: number) => Promise<PaginatedResponse<T>>,
  config: PaginationConfig = {}
): Promise<T[]> {
  const results: T[] = [];

  for await (const item of paginate(fetchPage, config)) {
    results.push(item);
  }

  return results;
}
