'use client';

import { useActionState } from 'react';
import { signIn } from '@/app/admin/actions';
import SubmitButton from '@/components/admin/SubmitButton';
import { emptyActionState } from '@/lib/admin/action-state';

export default function LoginForm() {
  const [state, formAction] = useActionState(signIn, emptyActionState);

  return (
    <form action={formAction} className="admin-login__form">
      <div className="admin-field">
        <label htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          type="email"
          name="email"
          autoComplete="username"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="admin-field">
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      {state.error ? (
        <p className="admin-alert admin-alert--error" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton
        className="admin-btn admin-btn--primary admin-login__submit"
        pendingLabel="Signing in…"
      >
        Sign in
      </SubmitButton>

      <p className="admin-help admin-help--center">
        Admin accounts are created in the Supabase dashboard.
      </p>
    </form>
  );
}
