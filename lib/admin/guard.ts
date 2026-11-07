import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Next can evaluate a page before the parent layout's redirect resolves.
 * This guard keeps unconfigured admin pages from throwing a setup error.
 * The login page is the only admin route that renders without Supabase.
 */
export function requireSupabaseConfigured(): void {
  if (!isSupabaseConfigured) {
    redirect('/admin/login');
  }
}
