import Link from 'next/link';
import AdminNav from '@/components/admin/AdminNav';
import { signOutAction } from '@/app/admin/actions';

type AdminShellProps = {
  userEmail: string;
  children: React.ReactNode;
};

export default function AdminShell({ userEmail, children }: AdminShellProps) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="admin-brand__mark">B</span>
          <span>
            Bite &amp; Beans
            <small>Content studio</small>
          </span>
        </Link>

        <AdminNav />

        <div className="admin-sidebar__footer">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            View website ↗
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span className="admin-topbar__label">Content studio</span>
          <div className="admin-topbar__actions">
            <span className="admin-user">{userEmail}</span>
            <form action={signOutAction}>
              <button type="submit" className="admin-btn admin-btn--ghost-dark">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
