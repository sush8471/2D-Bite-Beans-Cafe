'use client';

import Link from 'next/link';
import { useActionState, useId } from 'react';
import ImageField from '@/components/admin/ImageField';
import SubmitButton from '@/components/admin/SubmitButton';
import {
  deleteCollectionRow,
  saveCollectionRow,
} from '@/app/admin/actions';
import { emptyActionState, type ActionState } from '@/lib/admin/action-state';
import {
  getCollection,
  type AdminField,
  type CollectionConfig,
  type TableName,
} from '@/lib/admin/collections';

type Row = Record<string, unknown>;

type CollectionManagerProps = {
  table: TableName;
  rows: Row[];
};

function nextSortOrder(rows: Row[]): number {
  return rows.reduce((max, row) => Math.max(max, Number(row.sort_order) || 0), 0) + 10;
}

function defaultsFor(config: CollectionConfig, rows: Row[]): Row {
  const defaults: Row = {
    is_published: true,
    sort_order: nextSortOrder(rows),
  };

  for (const field of config.fields) {
    if (field.type === 'checkbox') {
      if (!(field.name in defaults)) defaults[field.name] = false;
    } else if (field.type === 'number') {
      if (!(field.name in defaults)) defaults[field.name] = 0;
    } else {
      defaults[field.name] = '';
    }
  }

  return defaults;
}

function FieldControl({ field, value }: { field: AdminField; value: unknown }) {
  const inputId = useId();

  if (field.type === 'checkbox') {
    return (
      <div className={`admin-field${field.full ? ' admin-field--full' : ''}`}>
        <label className="admin-check">
          <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} />
          <span>{field.label}</span>
        </label>
        {field.help ? <p className="admin-help">{field.help}</p> : null}
      </div>
    );
  }

  return (
    <div className={`admin-field${field.full ? ' admin-field--full' : ''}`}>
      <label htmlFor={inputId}>{field.label}</label>

      {field.type === 'image' ? (
        <ImageField
          name={field.name}
          defaultValue={value == null ? '' : String(value)}
          folder={field.folder}
        />
      ) : field.type === 'textarea' ? (
        <textarea
          id={inputId}
          name={field.name}
          defaultValue={value == null ? '' : String(value)}
          rows={field.rows ?? 3}
          placeholder={field.placeholder}
        />
      ) : field.type === 'number' ? (
        <input
          id={inputId}
          type="number"
          name={field.name}
          defaultValue={value == null ? 0 : Number(value)}
          min={field.min ?? 0}
          step={1}
        />
      ) : (
        <input
          id={inputId}
          type="text"
          name={field.name}
          defaultValue={value == null ? '' : String(value)}
          placeholder={field.placeholder}
        />
      )}

      {field.help ? <p className="admin-help">{field.help}</p> : null}
    </div>
  );
}

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

export function RowForm({
  config,
  row,
  id,
}: {
  config: CollectionConfig;
  row: Row;
  id?: string;
}) {
  const [state, formAction] = useActionState(saveCollectionRow, emptyActionState);

  return (
    <form action={formAction} className="admin-form">
      <input type="hidden" name="table" value={config.table} />
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <div className="admin-grid">
        {config.fields.map((field) => (
          <FieldControl key={field.name} field={field} value={row[field.name]} />
        ))}
      </div>

      <FormMessage state={state} />

      <div className="admin-form__actions">
        <SubmitButton>{id ? 'Save changes' : `Add ${config.singular}`}</SubmitButton>
      </div>
    </form>
  );
}

function DeleteForm({ config, id }: { config: CollectionConfig; id: string }) {
  const [state, formAction] = useActionState(deleteCollectionRow, emptyActionState);

  return (
    <form
      action={formAction}
      className="admin-delete-form"
      onSubmit={(event) => {
        const message = config.deleteWarning || `Delete this ${config.singular}?`;
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <input type="hidden" name="table" value={config.table} />
      <input type="hidden" name="id" value={id} />
      <SubmitButton className="admin-btn admin-btn--danger" pendingLabel="Deleting…">
        Delete {config.singular}
      </SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}

function rowLabel(row: Row, field: string, fallback = 'Untitled'): string {
  const value = row[field];
  return value == null || String(value).trim() === '' ? fallback : String(value);
}

export default function CollectionManager({ table, rows }: CollectionManagerProps) {
  const config = getCollection(table);
  const sortedRows = [...rows].sort(
    (a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)
  );
  const blank = defaultsFor(config, rows);

  return (
    <div className="admin-collection">
      <details className="admin-row admin-row--new">
        <summary>
          <span className="admin-row__plus">+</span>
          <span className="admin-row__summary">
            <strong>Add {config.singular}</strong>
            <span>Create a new entry in {config.title.toLowerCase()}</span>
          </span>
        </summary>
        <div className="admin-row__body">
          <RowForm config={config} row={blank} />
        </div>
      </details>

      {sortedRows.length === 0 ? (
        <p className="admin-empty">Nothing here yet. Use “Add {config.singular}” above.</p>
      ) : null}

      {sortedRows.map((row) => {
        const id = String(row.id ?? '');
        if (!id) return null;

        const imageUrl = config.imageField ? String(row[config.imageField] ?? '') : '';
        const published = row.is_published !== false;
        const title = rowLabel(row, config.titleField);
        const subtitle = config.subtitleField
          ? rowLabel(row, config.subtitleField, '')
          : '';
        const meta = typeof row._meta === 'string' ? row._meta : '';
        const subtitleLine = [subtitle, meta].filter(Boolean).join(' · ');

        return (
          <details className="admin-row" key={id}>
            <summary>
              <span className="admin-row__thumb">
                {imageUrl ? <img src={imageUrl} alt="" /> : <span>—</span>}
              </span>
              <span className="admin-row__summary">
                <strong>{title}</strong>
                {subtitleLine ? <span>{subtitleLine}</span> : null}
              </span>
              <span className={`admin-pill ${published ? 'admin-pill--live' : 'admin-pill--draft'}`}>
                {published ? 'Live' : 'Hidden'}
              </span>
              {config.detailBasePath ? (
                <Link
                  href={`${config.detailBasePath}/${id}`}
                  className="admin-btn admin-btn--outline admin-btn--small"
                  onClick={(event) => event.stopPropagation()}
                >
                  {config.detailLabel || 'Open'}
                </Link>
              ) : null}
            </summary>

            <div className="admin-row__body">
              <RowForm config={config} row={row} id={id} />
              <DeleteForm config={config} id={id} />
            </div>
          </details>
        );
      })}
    </div>
  );
}
