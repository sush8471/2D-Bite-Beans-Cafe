'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { deleteMenuItem, saveMenuItem } from '@/app/admin/actions';
import SubmitButton from '@/components/admin/SubmitButton';
import { emptyActionState, type ActionState } from '@/lib/admin/action-state';

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

function nextSortOrder(items: Item[]): number {
  return items.reduce((max, item) => Math.max(max, item.sort_order || 0), 0) + 10;
}

function ItemForm({ categoryId, item, items }: { categoryId: string; item?: Item; items: Item[] }) {
  const [state, formAction] = useActionState(saveMenuItem, emptyActionState);
  const [variants, setVariants] = useState<EditableVariant[]>(() =>
    item && item.variants.length > 0
      ? item.variants.map((variant) => ({ label: variant.label, price: String(variant.price) }))
      : [{ label: 'Standard', price: '' }]
  );
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state.ok && !item) {
      formRef.current?.reset();
      setVariants([{ label: 'Standard', price: '' }]);
    }
  }, [state.ok, item]);

  const variantsPayload = JSON.stringify(
    variants.map((variant, index) => ({
      label: variant.label.trim() || 'Standard',
      price: Number(variant.price) || 0,
      sort_order: (index + 1) * 10,
    }))
  );

  return (
    <form action={formAction} className="admin-form" ref={formRef}>
      <input type="hidden" name="category_id" value={categoryId} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input type="hidden" name="variants" value={variantsPayload} readOnly />

      <div className="admin-grid">
        <div className="admin-field">
          <label>Dish name</label>
          <input type="text" name="name" defaultValue={item?.name ?? ''} required />
        </div>

        <div className="admin-field">
          <label>Sort order</label>
          <input
            type="number"
            name="sort_order"
            min={0}
            step={1}
            defaultValue={item?.sort_order ?? nextSortOrder(items)}
          />
        </div>

        <div className="admin-field admin-field--full">
          <label>Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={item?.description ?? ''}
            placeholder="Optional. Shown under the dish name."
          />
        </div>

        <div className="admin-field">
          <label className="admin-check">
            <input type="checkbox" name="is_new" defaultChecked={item?.is_new ?? false} />
            <span>Mark as new</span>
          </label>
        </div>

        <div className="admin-field">
          <label className="admin-check">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={item?.is_published ?? true}
            />
            <span>Published</span>
          </label>
        </div>
      </div>

      <div className="admin-variants">
        <div className="admin-variants__head">
          <div>
            <strong>Prices</strong>
            <p className="admin-help">Add one row per size, protein, or option.</p>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn--outline admin-btn--small"
            onClick={() =>
              setVariants((current) => [...current, { label: current.length === 0 ? 'Standard' : '', price: '' }])
            }
          >
            + Add price
          </button>
        </div>

        {variants.map((variant, index) => (
          <div className="admin-variant-row" key={index}>
            <input
              type="text"
              value={variant.label}
              placeholder="Standard, Chicken, With Boba…"
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

      <div className="admin-form__actions">
        <SubmitButton>{item ? 'Save dish' : 'Add dish'}</SubmitButton>
      </div>
    </form>
  );
}

function DeleteItemForm({ id }: { id: string }) {
  const [state, formAction] = useActionState(deleteMenuItem, emptyActionState);

  return (
    <form
      action={formAction}
      className="admin-delete-form"
      onSubmit={(event) => {
        if (!window.confirm('Delete this dish and all of its prices?')) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton className="admin-btn admin-btn--danger" pendingLabel="Deleting…">
        Delete dish
      </SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}

export default function MenuItemsManager({ categoryId, items }: MenuItemsManagerProps) {
  const sorted = [...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="admin-collection">
      <details className="admin-row admin-row--new">
        <summary>
          <span className="admin-row__plus">+</span>
          <span className="admin-row__summary">
            <strong>Add dish</strong>
            <span>Create a new dish with one or more prices</span>
          </span>
        </summary>
        <div className="admin-row__body">
          <ItemForm categoryId={categoryId} items={items} />
        </div>
      </details>

      {sorted.length === 0 ? (
        <p className="admin-empty">No dishes yet. Use “Add dish” above.</p>
      ) : null}

      {sorted.map((item) => (
        <details className="admin-row" key={item.id}>
          <summary>
            <span className="admin-row__thumb admin-row__thumb--text">
              {item.is_new ? 'NEW' : '—'}
            </span>
            <span className="admin-row__summary">
              <strong>{item.name}</strong>
              <span>{priceSummary(item.variants)}</span>
            </span>
            <span
              className={`admin-pill ${item.is_published ? 'admin-pill--live' : 'admin-pill--draft'}`}
            >
              {item.is_published ? 'Live' : 'Hidden'}
            </span>
          </summary>
          <div className="admin-row__body">
            <ItemForm categoryId={categoryId} item={item} items={items} />
            <DeleteItemForm id={item.id} />
          </div>
        </details>
      ))}
    </div>
  );
}
