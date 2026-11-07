'use client';

import { useEffect } from 'react';

export type LightboxImage = {
  src: string;
  alt: string;
  caption: string;
};

type LightboxProps = {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
};

export default function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    if (index === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onNavigate(1);
      if (event.key === 'ArrowLeft') onNavigate(-1);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [index, onClose, onNavigate]);

  if (index === null || !images[index]) return null;

  const image = images[index];

  return (
    <div
      className="lightbox lightbox--visible"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button className="lightbox__close" aria-label="Close image viewer" onClick={onClose}>
        ✕
      </button>
      <button
        className="lightbox__arrow lightbox__arrow--prev"
        aria-label="Previous image"
        onClick={() => onNavigate(-1)}
      >
        ‹
      </button>
      <button
        className="lightbox__arrow lightbox__arrow--next"
        aria-label="Next image"
        onClick={() => onNavigate(1)}
      >
        ›
      </button>
      <div className="lightbox__stage">
        <img className="lightbox__image" src={image.src} alt={image.alt} />
        <p className="lightbox__caption">
          {image.caption} ({index + 1}/{images.length})
        </p>
      </div>
    </div>
  );
}
