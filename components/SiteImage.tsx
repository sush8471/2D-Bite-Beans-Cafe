type SiteImageProps = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
};

/**
 * Plain <img> so the existing CSS keeps working exactly as before.
 * Empty image values are skipped instead of rendering a broken image.
 */
export default function SiteImage({ src, alt, className, eager = false }: SiteImageProps) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
