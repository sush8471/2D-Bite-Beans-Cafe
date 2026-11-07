import rawContent from '@/data/content.json';
import type { SiteContent } from './types';

/**
 * Used when Supabase is not configured yet, or when a content request fails.
 * This keeps the public site fully functional before the database is seeded.
 */
export const defaultContent = rawContent as unknown as SiteContent;
