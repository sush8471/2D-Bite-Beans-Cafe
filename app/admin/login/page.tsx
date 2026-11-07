import Link from 'next/link';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import SetupRequired from '@/components/admin/SetupRequired';
import { getAdminSession } from '@/lib/admin/auth';

export const metadata = {
  title: 'Sign in',
};

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (!session.configured) {
    return <SetupRequired />;
  }

  if (session.user) {
    redirect('/admin');
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <Link href="/" className="admin-login__brand">
          <span className="admin-brand__mark">B</span>
          <span>
            Bite &amp; Beans
            <small>Content studio</small>
          </span>
        </Link>

        <h1>Welcome back</h1>
        <p className="admin-lede">Sign in to manage the menu, photos, and site content.</p>

        <LoginForm />
      </div>
    </div>
  );
}
