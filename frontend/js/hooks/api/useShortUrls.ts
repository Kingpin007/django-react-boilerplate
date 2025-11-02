/**
 * TanStack Query hooks for Short URL operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './utils';
import type { ShortURL, ShortURLListResponse, CreateShortURLRequest, ShortURLStatsResponse } from './types';

/**
 * Query keys for Short URLs
 */
export const shortUrlKeys = {
  all: ['shortUrls'] as const,
  lists: () => [...shortUrlKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...shortUrlKeys.lists(), filters] as const,
  details: () => [...shortUrlKeys.all, 'detail'] as const,
  detail: (id: number) => [...shortUrlKeys.details(), id] as const,
  stats: (id: number) => [...shortUrlKeys.all, 'stats', id] as const,
};

/**
 * Fetch all short URLs for the authenticated user
 */
export function useShortUrls() {
  return useQuery({
    queryKey: shortUrlKeys.lists(),
    queryFn: async () => {
      return apiRequest<ShortURLListResponse>('/api/short-urls/');
    },
  });
}

/**
 * Fetch a specific short URL by ID
 */
export function useShortUrl(id: number, enabled = true) {
  return useQuery({
    queryKey: shortUrlKeys.detail(id),
    queryFn: async () => {
      return apiRequest<ShortURL>(`/api/short-urls/${id}/`);
    },
    enabled,
  });
}

/**
 * Fetch statistics for a short URL
 */
export function useShortUrlStats(id: number, enabled = true) {
  return useQuery({
    queryKey: shortUrlKeys.stats(id),
    queryFn: async () => {
      return apiRequest<ShortURLStatsResponse>(`/api/short-urls/${id}/stats/`);
    },
    enabled,
  });
}

/**
 * Create a new short URL
 */
export function useCreateShortUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateShortURLRequest) => {
      return apiRequest<ShortURL>('/api/short-urls/shorten/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // Invalidate and refetch short URLs list
      queryClient.invalidateQueries({ queryKey: shortUrlKeys.lists() });
    },
  });
}

/**
 * Update a short URL
 */
export function useUpdateShortUrl(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<ShortURL>) => {
      return apiRequest<ShortURL>(`/api/short-urls/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      // Update the cached data
      queryClient.setQueryData(shortUrlKeys.detail(id), data);
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: shortUrlKeys.lists() });
    },
  });
}

/**
 * Delete a short URL
 */
export function useDeleteShortUrl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return apiRequest<void>(`/api/short-urls/${id}/`, {
        method: 'DELETE',
      });
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: shortUrlKeys.detail(id) });
      // Invalidate lists to reflect deletion
      queryClient.invalidateQueries({ queryKey: shortUrlKeys.lists() });
    },
  });
}

