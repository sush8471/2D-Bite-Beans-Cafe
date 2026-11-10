'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/app/admin/actions';
import { Upload, Trash2, ImageIcon } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 w-full gap-3.5">
      <input type="hidden" name={name} value={url} />

      {/* Centralized & Larger Image Preview */}
      <div className="w-full flex items-center justify-center">
        {url ? (
          <div className="relative rounded-xl overflow-hidden border border-border/70 bg-stone-100 dark:bg-stone-900 shadow-sm p-1.5 flex items-center justify-center max-w-full">
            <img
              src={url}
              alt="Selected image preview"
              className="max-h-60 sm:max-h-72 w-auto max-w-full object-contain block rounded-lg shadow-2xs"
            />
          </div>
        ) : (
          <div className="w-full max-w-sm h-40 sm:h-48 rounded-xl border-2 border-dashed border-stone-300 dark:border-stone-700 bg-stone-100/70 dark:bg-stone-900/40 flex flex-col items-center justify-center p-4 text-center text-stone-400 gap-2">
            <ImageIcon className="size-8 text-stone-400/80" />
            <span className="text-xs font-medium text-muted-foreground">No image selected</span>
          </div>
        )}
      </div>

      {/* Action buttons below the preview */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap">
        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 transition-colors cursor-pointer shadow-xs relative overflow-hidden">
          <Upload className="size-3.5" />
          <span>{uploading ? 'Uploading…' : url ? 'Change image' : 'Upload image'}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </label>
        {url ? (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition-colors cursor-pointer"
            onClick={() => setUrl('')}
          >
            <Trash2 className="size-3.5" />
            <span>Remove</span>
          </button>
        ) : null}
      </div>

      {error ? <p className="admin-help admin-help--error text-xs text-center">{error}</p> : null}
    </div>
  );
}
