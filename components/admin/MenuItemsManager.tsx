'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { deleteMenuItem, saveMenuItem } from '@/app/admin/actions';
import SubmitButton from '@/components/admin/SubmitButton';
import { emptyActionState, type ActionState } from '@/lib/admin/action-state';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';

type Variant = {
  id?: string;
  label: string;
  price: number;
  sort_order: number;
};

type Item = {
  id: string;
  name: string;
  description: string | null;
  is_new: boolean;
  is_published: boolean;
  sort_order: number;
  variants: Variant[];
};

type MenuItemsManagerProps = {
  categoryId: string;
  items: Item[];
};

type EditableVariant = {
  label: string;
  price: string;
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

function priceSummary(variants: Variant[]): string {
  const prices = variants.map((variant) => variant.price).filter((price) => Number.isFinite(price));
  if (prices.length === 0) return 'No price';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `Rs. ${min}` : `Rs. ${min} – ${max}`;
}

function ItemForm({
  categoryId,
  item,
  onSaved,
  onCancel,
  deleteSlot,
}: {
  categoryId: string;
  item?: Item;
  onSaved?: () => void;
  onCancel?: () => void;
  deleteSlot?: React.ReactNode;
}) {
  const [state, formAction] = useActionState(saveMenuItem, emptyActionState);
  const [variants, setVariants] = useState<EditableVariant[]>(() =>
    item && item.variants.length > 0
      ? item.variants.map((variant) => ({ label: variant.label, price: String(variant.price) }))
      : [{ label: 'Standard', price: '' }]
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.ok) {
      if (!item) {
        formRef.current?.reset();
        setVariants([{ label: 'Standard', price: '' }]);
      }
      const timer = setTimeout(() => {
        onSaved?.();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [state.ok, item, onSaved]);

  const variantsPayload = JSON.stringify(
    variants.map((variant, index) => ({
      label: variant.label.trim() || 'Standard',
      price: Number(variant.price) || 0,
      sort_order: (index + 1) * 10,
    }))
  );

  return (
    <form action={formAction} className="admin-form flex flex-col flex-1 min-h-0" ref={formRef}>
      <input type="hidden" name="category_id" value={categoryId} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input type="hidden" name="variants" value={variantsPayload} readOnly />

      <div className="overflow-y-auto px-5 sm:px-6 py-4 flex-1 admin-modal-scroll">
        <div className="admin-grid">
          <div className="admin-field admin-field--full">
            <label>Dish name</label>
            <input type="text" name="name" defaultValue={item?.name ?? ''} required placeholder="e.g. Signature Bento Box" />
          </div>

          <div className="admin-field admin-field--full">
            <label>Description</label>
            <textarea
              name="description"
              rows={2}
              defaultValue={item?.description ?? ''}
              placeholder="Key ingredients, taste profile or allergens"
            />
          </div>

          <div className="admin-field admin-field--full">
            <div className="flex flex-wrap items-center gap-6 p-3 rounded-xl bg-stone-50/80 dark:bg-stone-900/40 border border-border/60">
              <label className="admin-check !min-h-0 cursor-pointer">
                <input type="checkbox" name="is_new" defaultChecked={item?.is_new ?? false} />
                <span className="text-sm font-medium">Mark as “NEW” badge</span>
              </label>
              <label className="admin-check !min-h-0 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={item ? item.is_published : true}
                />
                <span className="text-sm font-medium">Visible on site</span>
              </label>
            </div>
          </div>
        </div>

        <div className="admin-variants">
          <div className="admin-variants__head">
            <div>
              <strong>Sizes &amp; prices</strong>
              <p className="admin-help">
                Every dish needs at least one price. Add more for sizes (e.g. Regular, Large).
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--outline admin-btn--small shrink-0"
              onClick={() => setVariants((current) => [...current, { label: '', price: '' }])}
            >
              + Add option
            </button>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_130px_36px] gap-2 mb-1.5 px-0.5 text-[0.72rem] font-bold text-stone-500 uppercase tracking-wider">
            <span>Portion / Size</span>
            <span>Price (Rs.)</span>
            <span></span>
          </div>

          {variants.map((variant, index) => (
            <div className="admin-variant-row" key={index}>
              <input
                type="text"
                value={variant.label}
                placeholder="e.g. Standard, Half, Full"
                aria-label={`Option ${index + 1} label`}
                onChange={(event) =>
                  setVariants((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index ? { ...row, label: event.target.value } : row
                    )
                  )
                }
              />
              <input
                type="number"
                min={0}
                step={1}
                value={variant.price}
                placeholder="Price (Rs.)"
                aria-label={`Option ${index + 1} price`}
                onChange={(event) =>
                  setVariants((current) =>
                    current.map((row, rowIndex) =>
                      rowIndex === index ? { ...row, price: event.target.value } : row
                    )
                  )
                }
              />
              <button
                type="button"
                className="admin-icon-btn"
                aria-label={`Remove option ${index + 1}`}
                disabled={variants.length === 1}
                onClick={() =>
                  setVariants((current) => current.filter((_, rowIndex) => rowIndex !== index))
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <FormMessage state={state} />
      </div>

      <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-t border-border/50 bg-stone-50/50 dark:bg-stone-900/30 shrink-0">
        <div>{deleteSlot}</div>
        <div className="flex items-center gap-2.5">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : null}
          <SubmitButton>{item ? 'Save dish' : 'Add dish'}</SubmitButton>
        </div>
      </div>
    </form>
  );
}

function DeleteItemForm({
  id,
  name,
  onDeleted,
}: {
  id: string;
  name?: string;
  onDeleted?: () => void;
}) {
  const [state, formAction] = useActionState(deleteMenuItem, emptyActionState);
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-400 transition-colors cursor-pointer"
        title="Delete dish"
        aria-label="Delete dish"
      >
        <Trash2 className="size-3.5" />
        <span>Delete dish</span>
      </button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-5 shadow-2xl z-[60]">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-base font-bold text-stone-900 dark:text-stone-100">
              Delete dish?
            </DialogTitle>
            <DialogDescription className="text-sm text-stone-500">
              Are you sure you want to delete {name ? `“${name}”` : 'this dish'} and all of its
              prices? This action cannot be undone.
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

export default function MenuItemsManager({ categoryId, items }: MenuItemsManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

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
              <strong className="text-sm font-semibold">Add dish</strong>
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl shadow-2xl border bg-background">
          <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border/50 shrink-0 pr-12 text-left">
            <DialogTitle className="text-lg font-bold">Add New Dish</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Add a new dish and set up portion sizes and pricing.
            </DialogDescription>
          </DialogHeader>
          <ItemForm
            categoryId={categoryId}
            onSaved={() => setIsAddOpen(false)}
            onCancel={() => setIsAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {sorted.length === 0 ? (
        <p className="admin-empty">No dishes yet. Use “Add dish” above.</p>
      ) : null}

      {/* List of Dishes with Modal Edit Trigger */}
      {sorted.map((item) => (
        <div
          className="admin-row flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 gap-3"
          key={item.id}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="admin-row__summary min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <strong className="truncate text-sm font-semibold">{item.name}</strong>
                {item.is_new ? (
                  <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    NEW
                  </span>
                ) : null}
              </div>
              <span className="truncate text-xs text-muted-foreground font-mono">
                {priceSummary(item.variants)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {/* Edit Modal Dialog for this Dish */}
            <Dialog
              open={editingItemId === item.id}
              onOpenChange={(open) => setEditingItemId(open ? item.id : null)}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="size-7 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 inline-flex items-center justify-center cursor-pointer transition-colors"
                  aria-label={`Edit ${item.name}`}
                  title={`Edit ${item.name}`}
                >
                  <Pencil className="size-3.5" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl shadow-2xl border bg-background">
                <DialogHeader className="px-5 sm:px-6 pt-5 pb-4 border-b border-border/50 shrink-0 pr-12 text-left">
                  <DialogTitle className="text-lg font-bold truncate pr-8">
                    Edit: {item.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Update dish details, portion sizes, or visibility.
                  </DialogDescription>
                </DialogHeader>

                <ItemForm
                  categoryId={categoryId}
                  item={item}
                  onSaved={() => setEditingItemId(null)}
                  onCancel={() => setEditingItemId(null)}
                  deleteSlot={
                    <DeleteItemForm
                      id={item.id}
                      name={item.name}
                      onDeleted={() => setEditingItemId(null)}
                    />
                  }
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );
}
