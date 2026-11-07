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
