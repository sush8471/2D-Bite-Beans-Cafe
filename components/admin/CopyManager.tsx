'use client';

import { useActionState } from 'react';
import { savePageCopy } from '@/app/admin/actions';
import SubmitButton from '@/components/admin/SubmitButton';
import { emptyActionState, type ActionState } from '@/lib/admin/action-state';
import type { CopyEntry } from '@/lib/types';

const PAGE_ORDER = ['home', 'menu', 'experience', 'visit', 'global'];
const PAGE_LABELS: Record<string, string> = {
  home: 'Home page',
  menu: 'Menu page',
  experience: 'Experience page',
  visit: 'Visit page',
  global: 'Buttons & global labels',
};

function FormMessage({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="admin-alert admin-alert--error" role="alert">
        {state.error}
      </p>
    );
  }
  if (state.ok) {
    return (
      <p className="admin-alert admin-alert--success" role="status">
        {state.message}
      </p>
    );
  }
  return null;
}

export default function CopyManager({ entries }: { entries: CopyEntry[] }) {
  const [state, formAction] = useActionState(savePageCopy, emptyActionState);

  const groups = new Map<string, CopyEntry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.page) ?? [];
    list.push(entry);
    groups.set(entry.page, list);
  }

  const pages = Array.from(groups.keys()).sort((a, b) => {
    const aIndex = PAGE_ORDER.indexOf(a);
    const bIndex = PAGE_ORDER.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <form action={formAction} className="admin-form">
      {pages.map((page) => {
        const rows = [...(groups.get(page) ?? [])].sort(
          (a, b) => a.sort_order - b.sort_order
        );

        return (
          <div className="admin-card" key={page}>
            <h2>{PAGE_LABELS[page] ?? page}</h2>
            <div className="admin-grid">
              {rows.map((entry) => (
                <div
                  className={`admin-field${entry.multiline ? ' admin-field--full' : ''}`}
                  key={entry.key}
                >
                  <label htmlFor={`copy-${entry.key}`}>{entry.label}</label>
                  {entry.multiline ? (
                    <textarea
                      id={`copy-${entry.key}`}
                      name={`copy:${entry.key}`}
                      defaultValue={entry.value}
                      rows={3}
                    />
                  ) : (
                    <input
                      id={`copy-${entry.key}`}
                      type="text"
                      name={`copy:${entry.key}`}
                      defaultValue={entry.value}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <FormMessage state={state} />

      <div className="admin-form__actions admin-form__actions--sticky">
        <SubmitButton>Save page copy</SubmitButton>
      </div>
    </form>
  );
}
