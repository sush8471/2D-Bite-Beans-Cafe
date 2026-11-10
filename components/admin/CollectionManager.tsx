'use client';

import Link from 'next/link';
import { useActionState, useEffect, useId, useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';

type Row = Record<string, unknown>;

type CollectionManagerProps = {
  table: TableName;
  rows: Row[];
};

function defaultsFor(config: CollectionConfig): Row {
  const defaults: Row = {
    is_published: true,
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
  onSaved,
}: {
  config: CollectionConfig;
  row: Row;
  id?: string;
  onSaved?: () => void;
}) {
  const [state, formAction] = useActionState(saveCollectionRow, emptyActionState);

  useEffect(() => {
    if (state.ok) {
      const timer = setTimeout(() => {
        onSaved?.();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.ok, onSaved]);

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

function DeleteForm({
  config,
  id,
  title,
  onDeleted,
}: {
  config: CollectionConfig;
  id: string;
  title?: string;
  onDeleted?: () => void;
}) {
  const [state, formAction] = useActionState(deleteCollectionRow, emptyActionState);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (state.ok) {
      setConfirmOpen(false);
      onDeleted?.();
    }
  }, [state.ok, onDeleted]);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="size-8 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 inline-flex items-center justify-center transition-colors cursor-pointer mr-1"
        title={`Delete ${config.singular}`}
        aria-label={`Delete ${config.singular}`}
      >
        <Trash2 className="size-5" />
      </button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-5 shadow-2xl z-[60]">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-base font-bold text-stone-900 dark:text-stone-100">
              Delete {config.singular}?
            </DialogTitle>
            <DialogDescription className="text-sm text-stone-500">
              {config.deleteWarning ||
                `Are you sure you want to delete ${
                  title ? `“${title}”` : `this ${config.singular.toLowerCase()}`
                }? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          {state.error ? (
            <p className="admin-alert admin-alert--error text-xs" role="alert">
              {state.error}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <form action={formAction}>
              <input type="hidden" name="table" value={config.table} />
              <input type="hidden" name="id" value={id} />
              <SubmitButton
                className="admin-btn admin-btn--danger !m-0 !px-4 !py-1.5 text-sm"
                pendingLabel="Deleting…"
              >
                Delete
              </SubmitButton>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function rowLabel(row: Row, field: string, fallback = 'Untitled'): string {
  const value = row[field];
  return value == null || String(value).trim() === '' ? fallback : String(value);
}

export default function CollectionManager({ table, rows }: CollectionManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

  const config = getCollection(table);
  const sortedRows = [...rows].sort(
    (a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)
  );
  const blank = defaultsFor(config);

  return (
    <div className="admin-collection">
      {/* Top Add Trigger with Dialog Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="admin-row admin-row--new flex items-center gap-3 p-3 w-full text-left cursor-pointer hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-colors"
          >
            <span className="admin-row__plus">+</span>
            <span className="admin-row__summary">
              <strong className="text-sm font-semibold">Add {config.singular}</strong>
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 shadow-2xl">
          <DialogHeader className="pt-1.5 pb-4 border-b border-border/50">
            <div className="flex items-center justify-between gap-4 pr-10 min-h-[2.5rem]">
              <DialogTitle className="text-lg font-bold">Add {config.singular}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="py-2">
            <RowForm config={config} row={blank} onSaved={() => setIsAddOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {sortedRows.length === 0 ? (
        <p className="admin-empty">Nothing here yet. Use “Add {config.singular}” above.</p>
      ) : null}

      {/* List of Rows with Modal Edit Trigger */}
      {sortedRows.map((row) => {
        const id = String(row.id ?? '');
        if (!id) return null;

        const imageUrl = config.imageField ? String(row[config.imageField] ?? '') : '';
        const title = rowLabel(row, config.titleField);
        const subtitle = config.subtitleField
          ? rowLabel(row, config.subtitleField, '')
          : '';
        const meta = typeof row._meta === 'string' ? row._meta : '';
        const subtitleLine = [subtitle, meta].filter(Boolean).join(' · ');

        return (
          <div
            className="admin-row flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 gap-3"
            key={id}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {imageUrl ? (
                <span className="admin-row__thumb shrink-0">
                  <img src={imageUrl} alt="" />
                </span>
              ) : null}
              <div className="admin-row__summary min-w-0 flex-1">
                {config.detailBasePath ? (
                  <Link
                    href={`${config.detailBasePath}/${id}`}
                    className="truncate text-sm font-semibold hover:text-[#8B2635] hover:underline transition-colors block w-fit"
                    title={`Manage dishes in ${title}`}
                  >
                    {title}
                  </Link>
                ) : (
                  <strong className="truncate text-sm font-semibold">{title}</strong>
                )}
                {subtitleLine ? (
                  <span className="truncate text-xs text-muted-foreground">{subtitleLine}</span>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {/* Minimal Edit Pencil Button */}
              <Dialog
                open={editingRowId === id}
                onOpenChange={(open) => setEditingRowId(open ? id : null)}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="size-7 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 inline-flex items-center justify-center cursor-pointer transition-colors"
                    aria-label={`Edit ${title}`}
                    title={`Edit ${title}`}
                  >
                    <Pencil className="size-3.5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 shadow-2xl">
                  <DialogHeader className="pt-1.5 pb-4 border-b border-border/50">
                    <div className="flex items-center justify-between gap-4 pr-10 min-h-[2.5rem]">
                      <DialogTitle className="text-lg font-bold truncate">
                        Edit: {title}
                      </DialogTitle>
                      {config.canDelete !== false ? (
                        <DeleteForm
                          config={config}
                          id={id}
                          title={title}
                          onDeleted={() => setEditingRowId(null)}
                        />
                      ) : null}
                    </div>
                  </DialogHeader>

                  <div className="py-2">
                    <RowForm
                      config={config}
                      row={row}
                      id={id}
                      onSaved={() => setEditingRowId(null)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        );
      })}
    </div>
  );
}
