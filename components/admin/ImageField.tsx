'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/app/admin/actions';

type ImageFieldProps = {
  name: string;
  defaultValue?: string;
  folder?: string;
};

/**
 * Uploads to the public `site-media` bucket, then submits the resulting URL
 * through a hidden input alongside the rest of the row form.
 */
export default function ImageField({ name, defaultValue = '', folder = 'uploads' }: ImageFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const result = await uploadImage(formData);

      if (!result.ok) {
        setError(result.error);
      } else {
        setUrl(result.url);
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-1.5">
      <input type="hidden" name={name} value={url} />

      {/* Image Preview - sized according to the image, not horizontally stretched */}
      <div className="shrink-0">
        {url ? (
          <div className="relative rounded-xl overflow-hidden border border-border/70 bg-stone-50 dark:bg-stone-900 shadow-sm p-1 inline-flex items-center justify-center">
            <img
              src={url}
              alt="Selected image preview"
              className="max-h-36 max-w-[200px] w-auto h-auto object-contain block rounded-lg"
            />
          </div>
        ) : (
          <div className="w-32 h-24 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 flex items-center justify-center p-2 text-center">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      {/* Action buttons and info on the right-hand side */}
      <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="admin-btn admin-btn--outline admin-btn--file !rounded-lg !py-1.5 !px-3 !text-xs !font-medium">
            {uploading ? 'Uploading…' : 'Upload image'}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              disabled={uploading}
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
          </label>
          {url ? (
            <button
              type="button"
              className="admin-btn admin-btn--ghost-dark !rounded-lg !py-1.5 !px-3 !text-xs !font-medium"
              onClick={() => setUrl('')}
            >
              Remove
            </button>
          ) : null}
        </div>

        {error ? <p className="admin-help admin-help--error text-xs">{error}</p> : null}
        <p className="text-[11px] text-muted-foreground">JPG, PNG, WebP, GIF or AVIF · max 10 MB</p>
      </div>
    </div>
  );
}
