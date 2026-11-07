export default function SetupRequired() {
  return (
    <div className="admin-setup">
      <div className="admin-card">
        <span className="admin-eyebrow">Setup required</span>
        <h1>Connect Supabase to open the content studio</h1>
        <p className="admin-lede">
          The public website is already running on its bundled content. Follow these steps
          once to make everything editable from this admin.
        </p>

        <ol className="admin-steps">
          <li>
            Create a project at <strong>supabase.com</strong>, then open the SQL Editor and run{' '}
            <code>supabase/schema.sql</code>, followed by <code>supabase/seed.sql</code>.
          </li>
          <li>
            In the Supabase dashboard, add an Auth user with an email and password
            (Authentication → Users → Add user).
          </li>
          <li>
            Grant that user admin access:
            <pre className="admin-code">{`insert into public.admin_users (user_id, email)
select id, email from auth.users
where email = 'you@example.com';`}</pre>
          </li>
          <li>
            Copy the project URL and anon key into <code>.env.local</code>:
            <pre className="admin-code">{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}</pre>
          </li>
          <li>Restart the dev server and sign in at <code>/admin/login</code>.</li>
        </ol>

        <p className="admin-help">
          Full instructions, including storage setup and deployment, are in <code>SETUP.md</code>.
        </p>
      </div>
    </div>
  );
}
