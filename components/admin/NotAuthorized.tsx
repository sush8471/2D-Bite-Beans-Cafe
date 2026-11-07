import { signOutAction } from '@/app/admin/actions';

type NotAuthorizedProps = {
  email?: string | null;
};

export default function NotAuthorized({ email }: NotAuthorizedProps) {
  return (
    <div className="admin-setup">
      <div className="admin-card">
        <span className="admin-eyebrow">Access denied</span>
        <h1>This account is not an admin</h1>
        <p className="admin-lede">
          You are signed in as <strong>{email || 'an unknown user'}</strong>, but this account
          is not listed in <code>public.admin_users</code>.
        </p>
        <p>
          Ask an existing admin to run this in the Supabase SQL Editor:
        </p>
        <pre className="admin-code">{`insert into public.admin_users (user_id, email)
select id, email from auth.users
where email = '${email || 'you@example.com'}'
on conflict (user_id) do nothing;`}</pre>
        <form action={signOutAction}>
          <button type="submit" className="admin-btn admin-btn--primary">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
