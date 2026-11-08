'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { moveCollectionRow, moveMenuItem } from '@/app/admin/actions';
import { emptyActionState, type ActionState } from '@/lib/admin/action-state';

type PositionProps = {
  isFirst: boolean;
  isLast: boolean;
};

function MoveButtons({ isFirst, isLast }: PositionProps) {
  const { pending } = useFormStatus();

  return (
    <span className="admin-position__buttons">
      <button
        type="submit"
        name="direction"
        value="up"
        className="admin-position__btn"
        aria-label="Move up"
        title="Move up"
        disabled={pending || isFirst}
      >
        ↑
      </button>
      <button
        type="submit"
        name="direction"
        value="down"
        className="admin-position__btn"
        aria-label="Move down"
        title="Move down"
        disabled={pending || isLast}
      >
        ↓
      </button>
    </span>
  );
}

function FormMessage({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <span className="admin-position__error" role="alert">
        {state.error}
      </span>
    );
  }
  if (state.ok) {
    return (
      <span className="admin-position__ok" role="status">
        Saved
      </span>
    );
  }
  return null;
}

export function CollectionPositionControls({
  table,
  id,
  isFirst,
  isLast,
}: PositionProps & { table: string; id: string }) {
  const [state, formAction] = useActionState(moveCollectionRow, emptyActionState);

  return (
    <form action={formAction} className="admin-position">
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <span className="admin-position__label">Order</span>
      <MoveButtons isFirst={isFirst} isLast={isLast} />
      <FormMessage state={state} />
    </form>
  );
}

export function MenuItemPositionControls({
  categoryId,
  id,
  isFirst,
  isLast,
}: PositionProps & { categoryId: string; id: string }) {
  const [state, formAction] = useActionState(moveMenuItem, emptyActionState);

  return (
    <form action={formAction} className="admin-position">
      <input type="hidden" name="category_id" value={categoryId} />
      <input type="hidden" name="id" value={id} />
      <span className="admin-position__label">Order</span>
      <MoveButtons isFirst={isFirst} isLast={isLast} />
      <FormMessage state={state} />
    </form>
  );
}
