export function toSlug(text: string): string {
  return String(text ?? '')
    .trim()
    .toLowerCase()
    // collapse whitespace/underscores to single hyphen
    .replace(/[\s_]+/g, '-')
    // keep: a-z0-9, hyphen, Arabic letters + Arabic digits
    .replace(/[^a-z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// "كرسي مكتب VIP" + "abc123xyz" → "كرسي-مكتب-vip_abc123xyz"
// ✅ بنستخدم _ كفاصل بين الاسم والـ ID عشان مش هيتكرر في الاسم
export function toSlugWithId(name: string, id: string): string {
  return `${toSlug(name)}_${id}`;
}

export function extractShortId(slug: string): string {
  const s = String(slug ?? '').trim();
  const idx = s.lastIndexOf('_');
  // If no underscore, fallback to whole string (useful for legacy links).
  return idx >= 0 ? s.slice(idx + 1) : s;
}