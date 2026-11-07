import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import NotAuthorized from '@/components/admin/NotAuthorized';
import { getAdminSession } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session.configured) {
    // The login page renders the setup instructions, so send unconfigured
    // visitors there instead of letting child pages query a missing client.
    redirect('/admin/login');
  }

  if (!session.user) {
    redirect('/admin/login');
  }

  if (!session.isAdmin) {
    return <NotAuthorized email={session.user.email} />;
  }

  return <AdminShell userEmail={session.user.email ?? ''}>{children}</AdminShell>;
}
