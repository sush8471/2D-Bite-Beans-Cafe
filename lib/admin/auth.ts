import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AdminSession =
  | { configured: false }
  | {
      configured: true;
      user: null;
      isAdmin: false;
      supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
    }
  | {
      configured: true;
      user: { id: string; email?: string | null };
      isAdmin: boolean;
      supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
    };

/**
 * Verifies the session against Supabase Auth, then checks admin membership.
 * The UI and every Server Action use this; RLS enforces the same rules in Postgres.
 */
export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured) return { configured: false };

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { configured: true, user: null, isAdmin: false, supabase };
  }

  const { data: isAdmin, error } = await supabase.rpc('is_admin');
  if (error) {
    console.error('[admin] is_admin() check failed', error);
  }

  return {
    configured: true,
    user: { id: user.id, email: user.email },
    isAdmin: Boolean(isAdmin),
    supabase,
  };
}
