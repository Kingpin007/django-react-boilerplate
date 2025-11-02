/**
 * Type definitions for URL Shortener API
 */

export interface ShortURL {
  id: number;
  original_url: string;
  short_code: string;
  short_url: string;
  user: number | null;
  user_email: string | null;
  click_count: number;
  is_active: boolean;
  expires_at: string | null;
  created: string;
  modified: string;
}

export interface CreateShortURLRequest {
  original_url: string;
  custom_code?: string;
  expires_at?: string;
}

export interface ShortURLListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ShortURL[];
}

export interface ShortURLStatsResponse {
  short_code: string;
  original_url: string;
  click_count: number;
  created: string;
  is_expired: boolean;
}

