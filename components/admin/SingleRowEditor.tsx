'use client';

import { RowForm } from '@/components/admin/CollectionManager';
import { getCollection, type TableName } from '@/lib/admin/collections';

type SingleRowEditorProps = {
  table: TableName;
  row: Record<string, unknown>;
};

/**
 * Edits one existing row without rendering the collection list.
 * Used on the category detail page.
 */
export default function SingleRowEditor({ table, row }: SingleRowEditorProps) {
  const config = getCollection(table);
  const id = String(row.id ?? '');

  return <RowForm config={config} row={row} id={id} />;
}
