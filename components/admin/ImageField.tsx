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
    <div className="admin-image-field">
      <input type="hidden" name={name} value={url} />

      {url ? (
        <img className="admin-image-preview" src={url} alt="Selected image preview" />
      ) : (
        <div className="admin-image-empty">No image selected</div>
      )}

      <div className="admin-image-actions">
        <label className="admin-btn admin-btn--outline admin-btn--file">
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
          <button type="button" className="admin-btn admin-btn--ghost-dark" onClick={() => setUrl('')}>
            Remove
          </button>
        ) : null}
      </div>

      <input
        type="text"
        className="admin-url-input"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="/assets/... or https://..."
        aria-label="Image URL"
      />

      {error ? <p className="admin-help admin-help--error">{error}</p> : null}
      <p className="admin-help">JPG, PNG, WebP, GIF or AVIF · max 10 MB</p>
    </div>
  );
}
