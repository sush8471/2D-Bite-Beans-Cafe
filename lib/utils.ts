export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function whatsappUrl(number: string): string {
  return `https://wa.me/${number.replace(/\D/g, '')}`;
}

export function rs(price: number): string {
  return `Rs. ${price}`;
}

export function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function safeImageUrl(value: string): string {
  if (!value) return '';
  if (value.startsWith('/') || value.startsWith('https://') || value.startsWith('http://')) {
    return value;
  }
  return `/${value}`;
}

/** Builds the “Open in Google Maps” link from the address the owner edits. */
export function mapsSearchUrl(address: string): string {
  const query = address.trim();
  if (!query) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Turns a profile URL into the “@handle” shown on the Visit page. */
export function instagramHandleFromUrl(url: string): string {
  if (!url) return '';

  try {
    const segments = new URL(url).pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1] ?? '';
    return last ? `@${last.replace(/^@/, '')}` : '';
  } catch {
    const match = url.match(/instagram\.com\/([^/?#]+)/i);
    return match ? `@${match[1].replace(/^@/, '')}` : '';
  }
}
